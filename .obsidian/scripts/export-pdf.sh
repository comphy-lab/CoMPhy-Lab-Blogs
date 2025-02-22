#!/bin/bash

# Ensure script fails on any error
set -e

# Get the absolute path to the Obsidian vault
VAULT_PATH="/Users/vatsal/CoMPhy-Lab-Blogs"

# Ensure we're in the vault directory
cd "$VAULT_PATH"

# Get the input file path and make it absolute if it isn't already
input_file="$1"
if [[ "$input_file" != /* ]]; then
    # If the input doesn't have a directory path, assume it's in _Inbox
    if [[ "$input_file" != *"/"* ]]; then
        input_file="_Inbox/$input_file"
    fi
    input_file="$VAULT_PATH/$input_file"
fi

# Extract the filename without path and extension
filename=$(basename "$input_file" .md)

# Get the directory of the input file relative to vault
dir=$(dirname "${input_file#$VAULT_PATH/}")

# Create output path in the same directory as input file
output_file="$dir/$filename.pdf"

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

# 2. Convert Obsidian wiki-links with aliases [[note|alias]] to italic alias
sed 's/\[\[\([^]|]*\)|\([^]]*\)\]\]/\\textit{\2}/g' "$temp_dir/temp1.md" > "$temp_dir/temp2.md"

# 3. Convert remaining Obsidian wiki-links [[note]] to italic text
sed 's/\[\[\([^]]*\)\]\]/\\textit{\1}/g' "$temp_dir/temp2.md" > "$temp_dir/temp3.md"

# 4. Remove iframe blocks but keep "Open on YouTube" text
awk '/<iframe/{p=1;next}/Open on YouTube/{print;p=0;next}/^<\/iframe>/{p=0;next}!p{print}' "$temp_dir/temp3.md" > "$temp_dir/temp4.md"

# 5. Strip YAML frontmatter
sed -e '1{/^---$/!q;};1,/^---$/d' "$temp_dir/temp4.md" > "$temp_dir/input.md"

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
\newunicodechar{🌊}{\emojiwave}
\newunicodechar{🌍}{\emojiearth}
\newunicodechar{🔗}{\emojilink}
\newunicodechar{🧮}{\emojimath}
\newunicodechar{📈}{\emojichart}
\newunicodechar{👨}{\emojidev}
\newunicodechar{✅}{\emojicheckmark}
EOL

# Run pandoc with your configuration
/opt/homebrew/bin/pandoc \
  --from=markdown+citations+pipe_tables+raw_html+implicit_figures \
  --pdf-engine=xelatex \
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
  --highlight-style=tango \
  -o "$VAULT_PATH/$output_file" \
  "input.md"

# Check if the conversion was successful
if [ $? -eq 0 ]; then
    echo "Successfully created: $output_file"
else
    echo "Error creating PDF"
    exit 1
fi
