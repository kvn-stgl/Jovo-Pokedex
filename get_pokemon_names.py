
import csv
import urllib.request
import io

# 6 -> de
# 9 -> en
langId = "9"

CSV_URL = 'https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/pokemon_species_names.csv'
stream = urllib.request.urlopen(CSV_URL)
text = io.TextIOWrapper(stream)
csvfile = csv.DictReader(text)

for line in csvfile:
    if line["local_language_id"] == langId:
        print("{\"value\": \"" + line['name'] + "\"},")