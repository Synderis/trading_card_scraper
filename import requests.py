import requests
from bs4 import BeautifulSoup

base_url = 'https://www.pricecharting.com/game/pokemon-jungle/flareon-3'

response = requests.get(base_url)
soup = BeautifulSoup(response.text, 'html.parser')

imgs = soup.find_all('img', {'itemprop': 'image'})[0]['src']
print(imgs)