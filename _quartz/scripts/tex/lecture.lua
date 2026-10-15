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

return {{BlockQuote = BlockQuote}, {Math = Math, Image = Image}}
