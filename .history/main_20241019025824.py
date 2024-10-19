from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List

# Define the Pydantic model for each row of data
class RowData(BaseModel):
    input1: str
    input2: str
    selectedOptions: List[str]

app = FastAPI()

@app.post("/submit")
async def submit_rows(rows: List[RowData]):
    # Filter out invalid rows (just for demonstration, the frontend should also filter)
    valid_rows = [row for row in rows if row.input1.strip() and row.input2.strip()]

    if not valid_rows:
        raise HTTPException(status_code=400, detail="No valid rows to submit")

    # Process or save the valid_rows data as needed
    # For this example, we will simply return the valid rows
    return {"message": "Data submitted successfully", "valid_rows": valid_rows}
