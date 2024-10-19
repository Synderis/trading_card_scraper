import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import '../CSS Sheets/DynamicRows.css'; // Ensure this path is correct

// Define the type for each row of data
type Row = {
  cardName: string;
  cardId: string;
  holo: boolean;
  reverse_holo: boolean;
  first_edition: boolean;
};

const DynamicRows: React.FC = () => {
  const navigate = useNavigate();
  
  // Initialize the rows state with empty values
  const [rows, setRows] = useState<Row[]>(Array.from({ length: 10 }, () => ({
    cardName: '',
    cardId: '',
    holo: false,
    reverse_holo: false,
    first_edition: false,
  })));

  // Handle changes to the row inputs
  const handleChange = (index: number, field: 'cardName' | 'cardId' | 'holo' | 'reverse_holo' | 'first_edition', value: string | boolean) => {
    const newRows = [...rows];

    if (field === 'holo' || field === 'reverse_holo' || field === 'first_edition') {
      newRows[index][field] = value as boolean; // Set checkbox values
    } else {
      newRows[index][field] = value as string; // Set string values
    }

    setRows(newRows);
  };

  // Function to add more rows
  const handleAddRows = () => {
    const newRowsToAdd: Row[] = Array.from({ length: 10 }, () => ({
      cardName: '',
      cardId: '',
      holo: false,
      reverse_holo: false,
      first_edition: false,
    }));
    setRows(prevRows => [...prevRows, ...newRowsToAdd]);
  };

  // Handle the form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Transform the rows to match the Pydantic model structure
    const payload = {
        rows: rows.map(row => ({
            card_name: row.cardName,
            card_id: row.cardId,
            holo: row.holo,
            reverse_holo: row.reverse_holo,
            first_edition: row.first_edition,
        })),
    };
    
    try {
        const response = await fetch('http://localhost:8000/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload), // Wrap the array in an object
        });
        
        if (!response.ok) {
            throw new Error('Failed to submit rows');
        }
        
        navigate('/results');
    } catch (error) {
        console.error('Error:', error);
    }
  };


  // Handle CSV file upload
  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        complete: (results) => {
          const parsedRows: Row[] = results.data.map((row: any) => ({
            cardName: row.cardName || '',
            cardId: row.cardId || '',
            // Handle both true/false and 1/0 for booleans
            holo: row.holo === 'true' || row.holo === true || row.holo === 1,
            reverse_holo: row.reverse_holo === 'true' || row.reverse_holo === true || row.reverse_holo === 1,
            first_edition: row.first_edition === 'true' || row.first_edition === true || row.first_edition === 1,
          }));
          setRows(parsedRows); // Update the rows state
        },
        error: (error) => {
          console.error('CSV parsing error:', error);
        }
      });
    }
  };

  // Function to download the CSV template
  const downloadCSVTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "cardName,cardId,holo,reverse_holo,first_edition\n" +
      ",,,,\n"; // One empty line for a row

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "card_template.csv");
    document.body.appendChild(link); // Required for FF
    link.click(); // This will download the data file
    document.body.removeChild(link); // Clean up
  };

  return (
    <div className="container">
      <h1>Card Input Rows</h1>
      <button onClick={downloadCSVTemplate} style={{ marginBottom: '10px' }}>Download CSV Template</button>
      <input type="file" accept=".csv" onChange={handleCSVUpload} />
      <form onSubmit={handleSubmit}>
        {rows.map((row, index) => (
          <div key={index} className="row">
            <input
              type="text"
              value={row.cardName}
              onChange={(e) => handleChange(index, 'cardName', e.target.value)}
              placeholder="Card Name"
            />
            <input
              type="text"
              value={row.cardId}
              onChange={(e) => handleChange(index, 'cardId', e.target.value)}
              placeholder="Card ID"
            />
            <label>
              <input
                type="checkbox"
                checked={row.holo}
                onChange={() => handleChange(index, 'holo', !row.holo)} // Toggle checkbox value
              />
              Holo
            </label>
            <label>
              <input
                type="checkbox"
                checked={row.reverse_holo}
                onChange={() => handleChange(index, 'reverse_holo', !row.reverse_holo)} // Toggle checkbox value
              />
              Reverse Holo
            </label>
            <label>
              <input
                type="checkbox"
                checked={row.first_edition}
                onChange={() => handleChange(index, 'first_edition', !row.first_edition)} // Toggle checkbox value
              />
              First Edition
            </label>
          </div>
        ))}
        <button type="button" onClick={handleAddRows}>Add 10 More Rows</button>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default DynamicRows;
