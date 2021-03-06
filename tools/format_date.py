import datetime
import dateutil.parser as parser

mydate = '09.02.2020'
date = parser.parse(mydate, dayfirst=True)
print(date.replace(day=date.day - 1).isoformat())

import json
quotes_path = '/home/thomas/quotes.json'

try:
  with open(quotes_path, 'rt') as json_quotes:
    quotes = json.load(json_quotes)
except IOError:
  print("Could not read file")

for quote in quotes["quotes_list"]:
  date = parser.parse(quote["date"], dayfirst=True)
  print(quote)
  if (date.day == 1):
    print(quote["quote"])
  else:
    quote["date"] = date.replace(day=date.day - 1).isoformat() + ".000Z"

print(quotes)
with open(quotes_path, 'wt') as json_quotes:
  json.dump(quotes, json_quotes)
