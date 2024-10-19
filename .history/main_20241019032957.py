import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
from fastapi.middleware.cors import CORSMiddleware
from pokemon_card_scraper import card_finder

# Define the Pydantic model for each row of data
class RowData(BaseModel):
    card_name: str
    card_id: str
    cardOptions: List[str]

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

@app.post("/submit")
async def submit_rows(rows: List[RowData]):
    valid_rows = [row for row in rows if row.card_name.strip() and row.card_id.strip()]

    if not valid_rows:
        raise HTTPException(status_code=400, detail="No valid rows to submit")

    # Convert valid rows to a list of dictionaries
    data = []
    for row in valid_rows:
        # Create a dictionary for each valid row
        card_data = {
            "card": row.card_name,
            "id": row.card_id,
            "holo": "holo" in row.cardOptions,
            "reverse_holo": "reverse holo" in row.cardOptions,
            "first_edition": "first edition" in row.cardOptions,
            "limited_edition": "limited edition" in row.cardOptions,
        }
        data.append(card_data)

    # Create a DataFrame
    df = pd.DataFrame(data)

    # Print the DataFrame to the console
    print(f"DataFrame:\n{df}", flush=True)

    return {"message": "Data submitted successfully", "valid_rows": df.to_dict(orient="records")}
