import json

with open('.understand-anything/knowledge-graph.json', 'r', encoding='utf-8') as f:
    kg = json.load(f)

# Fix edge directions: "outward" -> "forward", "inward" -> "forward"
dir_map = {'outward': 'forward', 'inward': 'forward', 'backward': 'backward', 'bidirectional': 'bidirectional'}
for e in kg['edges']:
    d = e.get('direction', '')
    if d in dir_map:
        e['direction'] = dir_map[d]

# Ensure all edges have required fields
for e in kg['edges']:
    for k in ['source', 'target', 'type', 'direction', 'weight']:
        if k not in e:
            if k == 'weight':
                e[k] = 0.5
            elif k == 'direction':
                e[k] = 'forward'
            else:
                e[k] = ''

# Ensure all nodes have required fields
for n in kg['nodes']:
    for k in ['id', 'type', 'name', 'summary', 'tags', 'complexity']:
        if k not in n:
            if k == 'tags':
                n[k] = []
            elif k == 'complexity':
                n[k] = 'moderate'
            elif k == 'summary':
                n[k] = n.get('name', 'No summary')
            else:
                n[k] = ''

# Fix edge types to be valid
valid_edge_types = [
    "imports", "exports", "contains", "inherits", "implements",
    "calls", "subscribes", "publishes", "middleware",
    "reads_from", "writes_to", "transforms", "validates",
    "depends_on", "tested_by", "configures",
    "related", "similar_to",
    "deploys", "serves", "provisions", "triggers",
    "migrates", "documents", "routes", "defines_schema",
    "contains_flow", "flow_step", "cross_domain",
    "cites", "contradicts", "builds_on", "exemplifies", "categorized_under", "authored_by"
]
for e in kg['edges']:
    if e.get('type') not in valid_edge_types:
        print(f"Invalid edge type: {e.get('type')}")

# Fix node types to be valid
valid_node_types = [
    "file", "function", "class", "module", "concept",
    "config", "document", "service", "table", "endpoint",
    "pipeline", "schema", "resource",
    "domain", "flow", "step",
    "article", "entity", "topic", "claim", "source"
]
for n in kg['nodes']:
    if n.get('type') not in valid_node_types:
        print(f"Invalid node type: {n.get('type')} for {n.get('id')}")

# Also verify node IDs are consistent with their types
# If node type is 'file', ID should start with 'file:'
for n in kg['nodes']:
    ntype = n.get('type', '')
    nid = n.get('id', '')
    expected_prefix = ntype + ':'
    if nid and not nid.startswith(expected_prefix):
        # Don't fix - check if dashboard handles it
        pass

with open('.understand-anything/knowledge-graph.json', 'w', encoding='utf-8') as f:
    json.dump(kg, f, indent=2)

# Count valid vs invalid
from collections import Counter
dirs = Counter(e.get('direction') for e in kg['edges'])
print('Edge directions:', dict(dirs))
etypes = Counter(e.get('type') for e in kg['edges'])
print('Edge types:', dict(etypes))
print('Total nodes:', len(kg['nodes']))
print('Total edges:', len(kg['edges']))
