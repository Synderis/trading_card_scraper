import pandas as pd
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from fastapi.middleware.cors import CORSMiddleware
import card_scraper

# Define the Pydantic model for each row of data
class RowData(BaseModel):
    card_name: str  # Keep camelCase for compatibility with your React app
    card_id: str    # Keep camelCase for compatibility with your React app
    holo: bool
    reverse_holo: bool
    first_edition: bool
    limited_edition: bool

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Wrap the list of RowData in a class for the request body
class CardInput(BaseModel):
    cards: List[RowData]  # The incoming payload expects a field named 'cards'

# Dependency to access the results stored in app state
def get_results_from_state(request: Request):
    return request.app.state.results

@app.post("/submit")
async def submit_cards(card_input: CardInput, request: Request):  # Accept card_input and request
    valid_rows = [row for row in card_input.cards if row.card_name.strip() and row.card_id.strip()]

    if not valid_rows:
        raise HTTPException(status_code=400, detail="No valid rows to submit")

    # Convert valid rows to a list of dictionaries
    data = []
    for row in valid_rows:
        # Create a dictionary for each valid row
        card_data = {
            "card": row.card_name,
            "id": row.card_id,
            "holo": row.holo,
            "reverse_holo": row.reverse_holo,
            "first_edition": row.first_edition,
            "limited_edition": row.limited_edition,
        }
        data.append(card_data)

    # Create a DataFrame
    df = pd.DataFrame(data)

    # Call the card finder and store the results in app state
    results = card_scraper.card_finder(df)
    request.app.state.results = results  # Store the results in app.state

    # Print the DataFrame to the console
    print(f"DataFrame:\n{df}", flush=True)

    return {"message": "Data submitted successfully", "valid_rows": df.to_dict(orient="records")}

@app.get("/results")
async def get_results(request: Request):
    # Access results from app.state using the dependency
    results = get_results_from_state(request)

    if results is None or len(results) == 0:
        raise HTTPException(status_code=404, detail="No results found")
    
    return {"results": results}
