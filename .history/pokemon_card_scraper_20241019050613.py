import pandas as pd
import requests
from bs4 import BeautifulSoup

def find_hyperlink_text(card_var, id_var, holo_var, reverse_holo_var, first_edition_var, soup):
    # Construct search text based on card conditions
    if holo_var:
        search_text = f"{card_var} [Holo] #{id_var}"
    elif first_edition_var:
        search_text = f"{card_var} [First Edition] #{id_var}"
    elif reverse_holo_var:
        search_text = f"{card_var} [Reverse Holo] #{id_var}"
    else:
        search_text = f"{card_var} #{id_var}"

    print(search_text)

    # Search for matching link text
    links = soup.find_all('a')
    for link in links:
        if search_text in link.get_text():
            print(f"Found link text: {link.get_text()}")
            return link['href']

    # Fallback search (just card name and number)
    fallback_text = f"{card_var} #{id_var}"
    for link in links:
        if fallback_text in link.get_text():
            print(f"Found link text: {link.get_text()}")
            return link['href']

    print("No matching link text found")
    return None

# Function to extract table data and convert it to a dictionary
def extract_table_to_dict(final_link, card, card_id):
    # Define standard labels
    standard_labels = [
        'card', 'id', 'Ungraded', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4',
        'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9',
        'Grade 9.5', 'SGC 10', 'CGC 10', 'PSA 10', 'BGS 10',
        'BGS 10 Black', 'CGC 10 Pristine', 'final_link'
    ]
    
    try:
        response = requests.get(final_link)
        soup = BeautifulSoup(response.text, 'html.parser')

        table = soup.find(id='full-prices')
        rows = table.find_all('tr') if table else []

        table_data = {label: 'not_available' for label in standard_labels}

        # Extract data from rows
        for row in rows:
            cells = row.find_all('td')
            if len(cells) == 2:
                label, value = cells[0].get_text(strip=True), cells[1].get_text(strip=True)
                if label in table_data:
                    table_data[label] = value

        # Set the final link, card, and number
        table_data['final_link'] = final_link
        table_data['card'] = card
        table_data['id'] = card_id
        return table_data
    except Exception as e:
        print(f"Failed to extract table, setting all prices to 'not_available'. Error: {e}")
        return {label: 'not_available' for label in standard_labels}

# Iterate through each row in the source DataFrame
def card_finder(source_df):
    # Capitalize each word in the "card" column
    source_df['card'] = source_df['card'].str.title()
    
    # Create a list to hold new rows
    new_rows = []

    for i in range(len(source_df)):
        card = source_df.iloc[i, 0]
        card_id = source_df.iloc[i, 1]
        base_url = f'https://www.pricecharting.com/search-products?q={card}+{card_id}&type=prices'
        
        response = requests.get(base_url)
        soup = BeautifulSoup(response.text, 'html.parser')

        holo = source_df.iloc[i, 2]
        reverse_holo = source_df.iloc[i, 3]
        first_edition = source_df.iloc[i, 4]
        
        if 'game' in response.url:
            final_link = response.url
            df_new_rows = extract_table_to_dict(final_link, card, card_id)
        else:
            matching_link = find_hyperlink_text(card, card_id, holo, reverse_holo, first_edition, soup)
            if matching_link:
                final_link = matching_link
                df_new_rows = extract_table_to_dict(final_link, card, card_id)
            else:
                final_link = 'not_available'
                df_new_rows = {label: 'not_available' for label in [
                    'card', 'id', 'Ungraded', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4',
                    'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9',
                    'Grade 9.5', 'SGC 10', 'CGC 10', 'PSA 10', 'BGS 10',
                    'BGS 10 Black', 'CGC 10 Pristine', 'final_link']}
                df_new_rows['card'] = card
                df_new_rows['id'] = card_id

        # Append the new row data to the new_rows list
        new_rows.append(df_new_rows)

    # Create a DataFrame from the collected new rows
    df_new_rows = pd.DataFrame(new_rows)

    # Write the new data to the CSV file
    df_new_rows.to_csv(r"C:\Users\Dylan\Downloads\pokemon_cards2.csv", mode='w', header=True, index=False)

    # Output a message indicating that data has been appended
    print(f"Data appended to {r'C:\Users\Dylan\Downloads\pokemon_cards2.csv'}:")
    return df_new_rows
