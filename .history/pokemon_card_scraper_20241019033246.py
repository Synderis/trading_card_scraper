import time
import pandas as pd
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

# Set up Selenium driver
chrome_options = webdriver.ChromeOptions()
chrome_options.add_experimental_option("detach", True)
chrome_options.add_argument("--headless")  # Run headless
chrome_options.add_argument("--no-sandbox")  # Bypass OS security model
chrome_options.add_argument("--disable-dev-shm-usage")  # Overcome limited resource problems
driver = webdriver.Chrome(options=chrome_options)

# source_df = pd.read_csv(r"C:\Users\Dylan\Downloads\pokemon_cards.csv")

def find_hyperlink_text(card_var, number_var, holo_var, reverse_holo_var, first_edition_var):
    try:
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.TAG_NAME, 'a')))
        links = driver.find_elements(By.TAG_NAME, 'a')

        # Construct search text based on card conditions
        if holo_var == 1:
            search_text = f"{card_var} [Holo] #{number_var}"
        elif first_edition_var == 1:
            search_text = f"{card_var} [First Edition] #{number_var}"
        elif reverse_holo_var == 1:
            search_text = f"{card_var} [Reverse Holo] #{number_var}"
        else:
            search_text = f"{card_var} #{number_var}"

        print(search_text)

        # Search for matching link text
        for link in links:
            if search_text in link.text:
                print(f"Found link text: {link.text}")
                return link

        # Fallback search (just card name and number)
        fallback_text = f"{card_var} #{number_var}"
        for link in links:
            if fallback_text in link.text:
                print(f"Found link text: {link.text}")
                return link

    except Exception as e:
        print(f"Error finding hyperlink: {e}")
    
    print("No matching link text found")
    return None

# Function to extract table data and convert it to a dictionary
def extract_table_to_dict(final_link, card, number):
    try:
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, '//*[@id="full-prices"]/table')))
        table = driver.find_element(By.XPATH, '//*[@id="full-prices"]/table')
        rows = table.find_elements(By.TAG_NAME, "tr")

        # Define standard labels
        standard_labels = [
            'card', 'number', 'Ungraded', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4',
            'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9',
            'Grade 9.5', 'SGC 10', 'CGC 10', 'PSA 10', 'BGS 10',
            'BGS 10 Black', 'CGC 10 Pristine', 'final_link'
        ]
        table_data = {label: 'not_available' for label in standard_labels}

        # Extract data from rows
        for row in rows:
            cells = row.find_elements(By.TAG_NAME, "td")
            if len(cells) == 2:
                label, value = cells[0].text.strip(), cells[1].text.strip()
                if label in table_data:
                    table_data[label] = value

        # Set the final link, card, and number
        table_data['final_link'] = final_link
        table_data['card'] = card
        table_data['number'] = number
        return table_data
    except Exception as e:
        print(f"Failed to extract table, setting all prices to 'not_available'. Error: {e}")
        return {label: 'not_available' for label in standard_labels}

# Iterate through each row in the source DataFrame
def card_finder(source_df):
    # Capitalize each word in the "card" column
    source_df['card'] = source_df['card'].str.title()
    
    for i in range(len(source_df)):
        card = source_df.iloc[i, 0]
        number = source_df.iloc[i, 1]
        base_url = f'https://www.pricecharting.com/search-products?q={card}+{number}&type=prices'
        driver.get(base_url)
        holo = source_df.iloc[i, 2]
        reverse_holo = source_df.iloc[i, 3]
        first_edition = source_df.iloc[i, 4]

        matching_link = find_hyperlink_text(card, number, holo, reverse_holo, first_edition)
        
        if matching_link:
            final_link = matching_link.get_attribute("href")
            df_new_rows = extract_table_to_dict(final_link, card, number)
        else:
            final_link = 'not_available'
            df_new_rows = {label: 'not_available' for label in [
                'card', 'number', 'Ungraded', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4',
                'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9',
                'Grade 9.5', 'SGC 10', 'CGC 10', 'PSA 10', 'BGS 10',
                'BGS 10 Black', 'CGC 10 Pristine', 'final_link']}
            df_new_rows['card'] = card
            df_new_rows['number'] = number

        # Create DataFrame from the new row data
        df_new_row = pd.DataFrame([df_new_rows])
        df_final = pd.merge(source_df, df_new_row, on=['card', 'number'], how='outer')

        # Append the new row to the CSV file
        df_final.to_csv(r"C:\Users\Dylan\Downloads\pokemon_cards2.csv", mode='a', header=not pd.io.common.file_exists(r"C:\Users\Dylan\Downloads\pokemon_cards2.csv"), index=False)

        # Output a message indicating that data has been appended
        print(df_new_row)
        print(f"Data appended to {r'C:\Users\Dylan\Downloads\pokemon_cards2.csv'}:")

    # Close the browser
    driver.quit()