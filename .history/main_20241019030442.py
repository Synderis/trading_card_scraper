from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware

# Define the Pydantic model for each row of data
class RowData(BaseModel):
    input1: str
    input2: str
    selectedOptions: List[str]

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
    valid_rows = [row for row in rows if row.input1.strip() and row.input2.strip()]

    if not valid_rows:
        raise HTTPException(status_code=400, detail="No valid rows to submit")

    # Print the data to the console
    print(f"Valid rows: {valid_rows}", flush=True)

    return {"message": "Data submitted successfully", "valid_rows": valid_rows}

