#!/bin/bash

# Ensure script fails on any error
set -e

# Get the absolute path to the Obsidian vault by deriving from script location
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
VAULT_PATH="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Validate vault path exists
if [[ ! -d "$VAULT_PATH" ]]; then
    echo "Error: Vault path not found: $VAULT_PATH"
    exit 1
fi

# Get the input file path (expecting absolute path from Shell Commands plugin)
input_file="$1"

# Validate input file
if [[ -z "$input_file" ]]; then
    echo "Error: No input file specified"
    echo "Usage: $0 <absolute-path-to-markdown-file>"
    exit 1
fi

if [[ ! -f "$input_file" ]]; then
    echo "Error: File not found: $input_file"
    exit 1
fi

# Support both absolute paths and relative paths (for backward compatibility)
if [[ "$input_file" != /* ]]; then
    # If relative path provided, make it absolute from vault root
    if [[ "$input_file" != *"/"* ]]; then
        input_file="$VAULT_PATH/_Inbox/$input_file"
    else
        input_file="$VAULT_PATH/$input_file"
    fi
fi

# Verify required files exist
if [[ ! -f "$VAULT_PATH/.pandoc/zotero-library-1.json" ]]; then
    echo "Error: Bibliography file not found: $VAULT_PATH/.pandoc/zotero-library-1.json"
    exit 1
fi

if [[ ! -f "$VAULT_PATH/.pandoc/ieee.csl" ]]; then
    echo "Error: CSL file not found: $VAULT_PATH/.pandoc/ieee.csl"
    exit 1
fi

# Extract the filename without path and extension
filename=$(basename "$input_file" .md)

# Get the directory of the input file relative to vault
dir=$(dirname "${input_file#$VAULT_PATH/}")

# Create absolute output path in the same directory as input file
output_file="$VAULT_PATH/$dir/$filename.pdf"

# Create a temporary directory for processing
temp_dir=$(mktemp -d)
trap 'rm -rf "$temp_dir"' EXIT

# Create media directory structure in temp dir to match vault structure
mkdir -p "$temp_dir/_Media/zotero"

# Copy all images maintaining directory structure
cp -r "$VAULT_PATH/_Media" "$temp_dir/" 2>/dev/null || true

# Process markdown file in steps:

# 1. Convert Obsidian image syntax to standard markdown and URL encode image paths only
sed 's/!\[\[\(_Media\/[^]]*\)\]\]/![](\1)/g' "$input_file" | \
    sed '/^!\[.*\](.*)/ s/ /%20/g' > "$temp_dir/temp1.md"

# 2. Normalize relative image paths (../../_Media/ or ../_Media/) to _Media/
sed 's|\(\.\./\)*_Media/|_Media/|g' "$temp_dir/temp1.md" > "$temp_dir/temp1a.md"

# 3. Convert Obsidian wiki-links with aliases [[note|alias]] to italic alias
sed 's/\[\[\([^]|]*\)|\([^]]*\)\]\]/\\textit{\2}/g' "$temp_dir/temp1a.md" > "$temp_dir/temp2.md"

# 4. Convert remaining Obsidian wiki-links [[note]] to italic text
sed 's/\[\[\([^]]*\)\]\]/\\textit{\1}/g' "$temp_dir/temp2.md" > "$temp_dir/temp3.md"

# 5. Remove iframe blocks and their wrapper divs
awk '/<div style="text-align: center;">$/{getline;if(/<iframe/)p=1;else print}/Open on YouTube/{print;p=0;next}/<\/iframe>/{p=0;next}/<\/div>/{if(!p)print;next}!p{print}' "$temp_dir/temp3.md" > "$temp_dir/temp4.md"

# 6. Strip YAML frontmatter
sed -e '1{/^---$/!q;};1,/^---$/d' "$temp_dir/temp4.md" > "$temp_dir/temp5.md"

# 7. Remove PDF export ignore blocks (PDF download links)
sed '/<!-- PDF-EXPORT-IGNORE-START -->/,/<!-- PDF-EXPORT-IGNORE-END -->/d' "$temp_dir/temp5.md" > "$temp_dir/temp6.md"

# 8. Process Obsidian callouts
# - Remove [!info]-, [!meta] callouts entirely (web-only content)
# - Convert [!significance], [!note], [!tip], etc. to bold headers
awk '
BEGIN { in_remove = 0; in_keep = 0; title = "" }
/^> \[!info\]/ || /^> \[!meta\]/ {
    in_remove = 1
    next
}
/^> \[!significance\]/ || /^> \[!note\]/ || /^> \[!tip\]/ || /^> \[!warning\]/ || /^> \[!important\]/ || /^> \[!tldr\]/ || /^> \[!abstract\]/ || /^> \[!summary\]/ || /^> \[!question\]/ || /^> \[!example\]/ || /^> \[!quote\]/ {
    in_keep = 1
    # Extract title: everything after ] and optional -
    gsub(/^> \[![a-zA-Z]+\]-? */, "", $0)
    title = $0
    next
}
/^>/ {
    if (in_remove) next
    if (in_keep) {
        content = $0
        sub(/^> ?/, "", content)
        if (title != "") {
            print "**" title ":** " content
            title = ""
        } else {
            print content
        }
        next
    }
}
!/^>/ {
    in_remove = 0
    in_keep = 0
    title = ""
    print
}
' "$temp_dir/temp6.md" > "$temp_dir/input.md"

# Change to temp directory for processing
cd "$temp_dir"

# Create header file for LaTeX
cat > "$temp_dir/header.tex" << 'EOL'
\usepackage{hyperref}
\hypersetup{
    colorlinks=true,
    linkcolor=[rgb]{0.839,0.368,0.054},
    urlcolor=[rgb]{0.839,0.368,0.054},
    citecolor=[rgb]{0.839,0.368,0.054},
    pdfborder={0 0 2},
    breaklinks=true,
    allcolors=[rgb]{0.839,0.368,0.054}
}
\usepackage{newunicodechar}
\usepackage{xcolor}
\DeclareRobustCommand{\emojiwave}{\textcolor{blue}{$\sim$}}
\DeclareRobustCommand{\emojiearth}{\textcolor{blue}{\textbullet}}
\DeclareRobustCommand{\emojilink}{\textcolor{gray}{\textbullet}}
\DeclareRobustCommand{\emojimath}{\textcolor{purple}{$\sum$}}
\DeclareRobustCommand{\emojichart}{\textcolor{red}{$\uparrow$}}
\DeclareRobustCommand{\emojidev}{\textcolor{gray}{$\triangleright$}}
\DeclareRobustCommand{\emojicheckmark}{\textcolor{green}{$\checkmark$}}
\DeclareRobustCommand{\emojibeer}{\textcolor{orange}{$\ast$}}
\DeclareRobustCommand{\emojimemo}{\textcolor{blue}{$\square$}}
\DeclareRobustCommand{\approxsym}{$\approx$}
\DeclareRobustCommand{\greekmu}{$\mu$}
\DeclareRobustCommand{\checkmarksym}{$\checkmark$}
\DeclareRobustCommand{\subzero}{$_0$}
\DeclareRobustCommand{\subone}{$_1$}
\DeclareRobustCommand{\subtwo}{$_2$}
\DeclareRobustCommand{\subthree}{$_3$}
\DeclareRobustCommand{\subfour}{$_4$}
\DeclareRobustCommand{\subfive}{$_5$}
\DeclareRobustCommand{\subsix}{$_6$}
\DeclareRobustCommand{\subseven}{$_7$}
\DeclareRobustCommand{\subeight}{$_8$}
\DeclareRobustCommand{\subnine}{$_9$}
\newunicodechar{🌊}{\emojiwave}
\newunicodechar{🌍}{\emojiearth}
\newunicodechar{🔗}{\emojilink}
\newunicodechar{🧮}{\emojimath}
\newunicodechar{📈}{\emojichart}
\newunicodechar{👨}{\emojidev}
\newunicodechar{✅}{\emojicheckmark}
\newunicodechar{🍺}{\emojibeer}
\newunicodechar{📝}{\emojimemo}
\newunicodechar{≈}{\approxsym}
\newunicodechar{μ}{\greekmu}
\newunicodechar{✓}{\checkmarksym}
\newunicodechar{₀}{\subzero}
\newunicodechar{₁}{\subone}
\newunicodechar{₂}{\subtwo}
\newunicodechar{₃}{\subthree}
\newunicodechar{₄}{\subfour}
\newunicodechar{₅}{\subfive}
\newunicodechar{₆}{\subsix}
\newunicodechar{₇}{\subseven}
\newunicodechar{₈}{\subeight}
\newunicodechar{₉}{\subnine}
EOL

# Run pandoc with your configuration
/opt/homebrew/bin/pandoc \
  --from=markdown+citations+pipe_tables+raw_html+implicit_figures \
  --pdf-engine=/Library/TeX/texbin/xelatex \
  --citeproc \
  --bibliography="$VAULT_PATH/.pandoc/zotero-library-1.json" \
  --csl="$VAULT_PATH/.pandoc/ieee.csl" \
  --metadata link-citations=true \
  --wrap=preserve \
  -V geometry:margin=1in \
  -V papersize=letter \
  -V colorlinks=true \
  -V linkcolor=orange \
  -V urlcolor=orange \
  -V citecolor=orange \
  -H "$temp_dir/header.tex" \
  --syntax-highlighting=tango \
  -o "$output_file" \
  "input.md"

# Check if the conversion was successful
if [ $? -eq 0 ]; then
    echo "Successfully created: $output_file"
else
    echo "Error creating PDF"
    exit 1
fi
