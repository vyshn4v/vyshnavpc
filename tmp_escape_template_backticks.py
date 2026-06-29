from pathlib import Path
import re

path = Path('seed-docs-react-general.js')
text = path.read_text('utf8')
lines = text.splitlines()
out_lines = []
stack = []
block_keys = {'content', 'solutionCode'}
for line in lines:
    stripped = line.strip()
    if not stack and re.match(r'^\s*(content|solutionCode):\s*`\s*$', line):
        stack.append('block')
        out_lines.append(line)
        continue
    if stack and stripped in {'`', '`,', '`,'}:
        stack.pop()
        out_lines.append(line)
        continue
    if stack:
        out_lines.append(line.replace('`', '\\`'))
    else:
        out_lines.append(line)
path.write_text('\n'.join(out_lines) + '\n', 'utf8')
print('updated', path)