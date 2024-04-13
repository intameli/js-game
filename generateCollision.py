import json

with open('tiled/collision.json', 'r', encoding='utf-8') as f:
    data = json.load(f)
arr = []
for d in data['layers']:
    name = d['name']
    if name == 'markers':
        arr = d['data']


js = open('tiled/markers.js', 'w', encoding='utf-8')
js.write("const collision = " + str(arr))
js.close()
f.close()
