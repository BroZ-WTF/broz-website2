import datetime
import dateutil.parser as parser

text = '09.02.2020'

#date = parser.parse(text, dayfirst=True)
#print(date.replace(day=date.day - 1).isoformat()

if u"hi" == "hi":
  print("is gleich")

keys = ('date', 'name', 'quote')
mydict = {u'date': u'2020-02-20T23:00:00.000Z', u'quote': u'Thomas testet dinge', u'name': u'Thomas'}

if not mydict.keys() == set({'name', 'quote', 'date'}):
  # raise value error if any key is not set
  raise ValueError

if all(key in mydict for key in ('date', 'name', 'quote')):
  print("is drinne")