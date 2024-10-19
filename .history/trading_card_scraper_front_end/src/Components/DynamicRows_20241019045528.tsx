import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS Sheets/DynamicRows.css';

type Row = {
  cardName: string;
  cardId: string;
  cardOptions: string[];
};

const DynamicRows: React.FC = () => {
  const navigate = useNavigate();
  // Initialize with 10 empty rows
  const [rows, setRows] = useState<Row[]>(Array.from({ length: 10 }, () => ({ cardName: '', cardId: '', cardOptions: [] })));

  const handleChange = (index: number, field: 'cardName' | 'cardId' | 'cardOptions', value: string | boolean) => {
    const newRows = [...rows];
    
    if (field === 'cardOptions') {
      // Manage checkbox options
      if (newRows[index].cardOptions.includes(value as string)) {
        newRows[index].cardOptions = newRows[index].cardOptions.filter(option => option !== value);
      } else {
        newRows[index].cardOptions.push(value as string);
      }
    } else {
      newRows[index][field] = value as string;
    }
    
    setRows(newRows);
  };

  const handleAddRows = () => {
    const newRowsToAdd: Row[] = Array.from({ length: 10 }, () => ({ cardName: '', cardId: '', cardOptions: [] }));
    setRows(prevRows => [...prevRows, ...newRowsToAdd]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rows),
      });

      if (!response.ok) {
        throw new Error('Failed to submit rows');
      }

      // Navigate to results page
      navigate('/results');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
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
              checked={row.cardOptions.includes('holo')}
              onChange={() => handleChange(index, 'cardOptions', 'holo')}
            />
            Holo
          </label>
          <label>
            <input
              type="checkbox"
              checked={row.cardOptions.includes('reverse holo')}
              onChange={() => handleChange(index, 'cardOptions', 'reverse holo')}
            />
            Reverse Holo
          </label>
          <label>
            <input
              type="checkbox"
              checked={row.cardOptions.includes('first edition')}
              onChange={() => handleChange(index, 'cardOptions', 'first edition')}
            />
            First Edition
          </label>
        </div>
      ))}
      <button type="button" onClick={handleAddRows}>Add 10 More Rows</button>
      <button type="submit">Submit</button>
    </form>
  );
};

export default DynamicRows;
