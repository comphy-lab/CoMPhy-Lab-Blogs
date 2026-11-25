-- Writer-specific layout; source text and scientific notation stay in the AST.
function BlockQuote(el)
  local first = el.content[1]
  if not first or (first.t ~= 'Para' and first.t ~= 'Plain') then return end
  local text = pandoc.utils.stringify(first)
  local kind, title = text:match('^%[!([%w_-]+)%][+-]?%s*(.*)')
  if not kind then return end
  if kind == 'pdf' then return {} end
  -- The marker and title occupy the first source line. Remaining inlines
  -- belong to the body, and can include links, maths, or a nested callout.
  local body = pandoc.List()
  local after = false
  local heading = pandoc.List()
  for _, inline in ipairs(first.content) do
    if not after and (inline.t == 'SoftBreak' or inline.t == 'LineBreak') then
      after = true
    elseif not after and inline.t == 'Math' and inline.mathtype == 'DisplayMath' then
      after = true
      body:insert(inline)
    elseif after then body:insert(inline)
    else heading:insert(inline) end
  end
  if heading[1] and heading[1].t == 'Str' then
    heading[1].text = heading[1].text:gsub('^%[![%w_-]+%][+-]?', '')
  end
  if pandoc.utils.stringify(heading):match('^%s*$') then heading = {pandoc.Str(kind:sub(1,1):upper() .. kind:sub(2))} end
  local titleTex = pandoc.write(pandoc.Pandoc({pandoc.Plain(heading)}), 'latex')
  el.content:remove(1)
  if #body > 0 then el.content:insert(1, pandoc.Para(body)) end
  el.content:insert(1, pandoc.RawBlock('latex', '\\begin{lecturebox}{' .. titleTex .. '}'))
  el.content:insert(pandoc.RawBlock('latex', '\\end{lecturebox}'))
  return el.content
end

function Math(el)
  if el.mathtype == 'DisplayMath' and not el.text:match('\\begin{align') and not el.text:match('\\begin{equation') then
    local text = el.text:match('^%s*(.-)%s*$'):gsub('\n%s*\n', '\n')
    return pandoc.RawInline('latex', '\\begin{equation}\n' .. text .. '\n\\end{equation}')
  end
end

function Image(el)
  local fraction = tonumber(el.attributes['pdf-width']) or 1
  local caption = pandoc.write(pandoc.Pandoc({pandoc.Plain(el.caption)}), 'latex')
  local path = el.src:gsub('\\', '/'):gsub('([%%#])', '\\%1')
  local tex = '\\begin{center}\n\\includegraphics[width=' .. fraction .. '\\linewidth,height=0.65\\textheight,keepaspectratio]{' .. path .. '}\n'
  if caption ~= '' then tex = tex .. '\\par\\smallskip{\\small ' .. caption .. '}\n' end
  return pandoc.RawInline('latex', tex .. '\\end{center}')
end

local function hasWhitespace(text)
  if text:find('%s') then return true end
  -- Lua's %s does not cover the non-ASCII Unicode White_Space characters.
  for _, c in utf8.codes(text) do
    if c == 0x85 or c == 0xA0 or c == 0x1680 or (c >= 0x2000 and c <= 0x200A)
        or c == 0x2028 or c == 0x2029 or c == 0x202F or c == 0x205F or c == 0x3000 then
      return true
    end
  end
  return false
end

local function urlText(inline)
  -- Escape TeX specials before hyperref scans the URL label.
  local label = inline.text:gsub('[\\{}%%#%^&_$~]', function(char)
    return ('\\lectureurlchar{%d}'):format(char:byte())
  end)
  local tex = '\\lectureurl{' .. label .. '}'
  if inline.t == 'Code' then tex = '\\texttt{' .. tex .. '}' end
  -- Keep the original inline available for Pandoc's PDF bookmark text.
  return {pandoc.RawInline('latex', '\\texorpdfstring{' .. tex .. '}{'),
          inline, pandoc.RawInline('latex', '}')}
end

function Link(el)
  local label = pandoc.utils.stringify(el.content)
  local prefix = label:match('^[dD][oO][iI]: *') or ''
  local identifier = label:sub(#prefix + 1)
  if hasWhitespace(identifier) or identifier:find('##', 1, true) then return end
  local registrant = identifier:match('^10%.(%d+)/.+$')
  local isDoi = registrant and #registrant >= 4 and #registrant <= 9
  local isUrl = label:match('^[a-zA-Z][a-zA-Z0-9+.-]*://.+$') or label:match('^www%..+$')
      or el.classes:includes('pdf-url-label')
  if not isDoi and (not isUrl or hasWhitespace(label)) then return end

  -- Pandoc's native \url already uses xurl and preserves URL annotations.
  local native = pandoc.write(pandoc.Pandoc({pandoc.Plain({el})}), 'latex')
  if native:match('^\\url{') then return end

  -- The prefix may span text and spaces or share an inline with the identifier.
  local remaining = isDoi and prefix or ''
  local function formatText(inline)
    if remaining == '' then return urlText(inline) end
    local count = math.min(#remaining, #inline.text)
    local prefixText = inline.text:sub(1, count)
    if prefixText ~= remaining:sub(1, count) then return end
    remaining = remaining:sub(count + 1)
    if count == #inline.text then return end

    local prefixInline = inline:clone()
    prefixInline.text = prefixText
    inline.text = inline.text:sub(count + 1)
    local formatted = urlText(inline)
    table.insert(formatted, 1, prefixInline)
    return formatted
  end
  local formatted = el:walk {
    traverse = 'topdown',
    Note = function(note) return note, false end,
    Space = function()
      if remaining:sub(1, 1) == ' ' then remaining = remaining:sub(2) end
    end,
    Str = formatText,
    Code = formatText,
  }
  if remaining == '' then return formatted end
end

return {{Link = Link, BlockQuote = BlockQuote}, {Math = Math, Image = Image}}
