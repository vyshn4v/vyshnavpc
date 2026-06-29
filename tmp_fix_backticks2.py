from pathlib import Path
import re

path = Path('seed-docs-react-general.js')
text = path.read_text('utf8')
lines = text.splitlines()
out_lines = []
inside_block = False
for line in lines:
    stripped = line.strip()
    if not inside_block and re.match(r'^\s*(content|solutionCode):\s*`\s*$', line):
        inside_block = True
        out_lines.append(line)
        continue
    if inside_block and re.match(r'^\s*`\s*(,)?\s*$', line):
        inside_block = False
        out_lines.append(line)
        continue
    if inside_block:
        # Collapse multiple backslashes before a backtick into exactly one.
        line = re.sub(r'\\+`', r'\\`', line)
        # Escape raw backticks that are not already escaped.
        line = re.sub(r'(?<!\\)`', r'\\`', line)
    out_lines.append(line)

path.write_text('\n'.join(out_lines) + '\n', 'utf8')
print('normalized backticks in content blocks')