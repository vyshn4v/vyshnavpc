from pathlib import Path
import re
path = Path('seed-docs-react-general.js')
text = path.read_text('utf8')
# Fix double-escaped backticks like \\` into a single escaped backtick \`
text = text.replace('\\`', '\`')

lines = text.splitlines()
out_lines = []
in_block = False
for line in lines:
    stripped = line.strip()
    if not in_block and re.match(r'^\s*(content|solutionCode):\s*`\s*$', line):
        in_block = True
        out_lines.append(line)
        continue
    if in_block and re.match(r'^\s*`\s*(,)?\s*$', line):
        in_block = False
        out_lines.append(line)
        continue
    if in_block:
        # Escape raw backticks inside the content block, but preserve already escaped backticks.
        new_line = re.sub(r'(?<!\\)`', r'\\`', line)
        out_lines.append(new_line)
    else:
        out_lines.append(line)
Path('seed-docs-react-general.js').write_text('\n'.join(out_lines) + '\n', 'utf8')
print('normalized backticks')