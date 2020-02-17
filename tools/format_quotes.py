import json

quotes_path = '/home/thomas/Projects/1_workspace_webdev/broz-website2/broz-backend/instance/data/quotes.json'

try:
  with open(quotes_path, 'rt') as json_quotes:
    quotes = json.load(json_quotes)
except IOError:
  print("Could not read file")

for quote in quotes["quotes_list"]:
  del quote["id"]

print(quotes)

with open(quotes_path, 'wt') as json_quotes:
  json.dump(quotes, json_quotes)