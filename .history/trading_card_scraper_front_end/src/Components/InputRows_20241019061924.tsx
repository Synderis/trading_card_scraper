import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import '../CSS Sheets/DynamicRows.css'; // Ensure this path is correct

type Row = {
  cardName: string;
  cardId: string;
  holo: boolean;
  reverse_holo: boolean;
  first_edition: boolean;
};

const DynamicRows: React.FC = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Row[]>(Array.from({ length: 10 }, () => ({
    cardName: '',
    cardId: '',
    holo: false,
    reverse_holo: false,
    first_edition: false,
  })));

  const handleChange = (index: number, field: 'cardName' | 'cardId' | 'holo' | 'reverse_holo' | 'first_edition', value: string | boolean) => {
    const newRows = [...rows];

    if (field === 'holo' || field === 'reverse_holo' || field === 'first_edition') {
      newRows[index][field] = value as boolean;
    } else {
      newRows[index][field] = value as string;
    }

    setRows(newRows);
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Transform the rows to match the Pydantic model structure
    const payload = rows.map(row => ({
      card_name: row.cardName, // Change to match the Pydantic model
      card_id: row.cardId,     // Change to match the Pydantic model
      holo: row.holo,
      reverse_holo: row.reverse_holo,
      first_edition: row.first_edition,
    }));
  
    try {
      const response = await fetch('http://localhost:8000/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload), // Send the transformed payload
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit rows');
      }
  
      navigate('/results');
    } catch (error) {
      console.error('Error:', error);
    }
  };

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
            holo: row.holo === 'true',
            reverse_holo: row.reverse_holo === 'true',
            first_edition: row.first_edition === 'true',
          }));
          setRows(parsedRows);
        },
        error: (error) => {
          console.error('CSV parsing error:', error);
        }
      });
    }
  };

  return (
    <div className="container">
      <h1>Card Input Rows</h1>
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
                onChange={() => handleChange(index, 'holo', !row.holo)}
              />
              Holo
            </label>
            <label>
              <input
                type="checkbox"
                checked={row.reverse_holo}
                onChange={() => handleChange(index, 'reverse_holo', !row.reverse_holo)}
              />
              Reverse Holo
            </label>
            <label>
              <input
                type="checkbox"
                checked={row.first_edition}
                onChange={() => handleChange(index, 'first_edition', !row.first_edition)}
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
