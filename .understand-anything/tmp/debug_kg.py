import json

with open('.understand-anything/knowledge-graph.json', 'r', encoding='utf-8') as f:
    kg = json.load(f)

dirs = set()
for e in kg['edges']:
    dirs.add(e.get('direction', 'MISSING'))
print('Edge directions:', dirs)

# Count all direction values
from collections import Counter
dir_counts = Counter(e.get('direction', 'MISSING') for e in kg['edges'])
print('Direction counts:', dict(dir_counts))

# Check edge required fields
for i, e in enumerate(kg['edges']):
    missing = [k for k in ['source', 'target', 'type'] if k not in e]
    if missing:
        print('Edge %d missing: %s' % (i, missing))

# Check all edge types
etypes = Counter(e['type'] for e in kg['edges'])
print('Edge types:', dict(etypes))

# Check nodes with missing required fields  
for i, n in enumerate(kg['nodes']):
    missing = [k for k in ['id', 'type', 'name', 'summary'] if k not in n]
    if missing:
        print('Node %d missing: %s' % (i, missing))
    if not n.get('tags'):
        print('Node %d (%s) missing tags' % (i, n.get('id', '?')))

# Check for complex unset/null
for i, n in enumerate(kg['nodes']):
    if n.get('complexity') is None:
        print('Node %d (%s) null complexity' % (i, n.get('id', '?')))
