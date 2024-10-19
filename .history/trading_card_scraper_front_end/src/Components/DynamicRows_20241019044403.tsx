import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Define the Row type
type Row = {
  cardName: string;
  cardId: string;
  cardOptions: string[];
};

const DynamicRows: React.FC = () => {
  // Initialize the state with 10 rows
  const [rows, setRows] = useState<Row[]>(Array.from({ length: 10 }, () => ({ cardName: '', cardId: '', cardOptions: [] })));
  const navigate = useNavigate();

  const handleChange = (index: number, field: keyof Row, value: string) => {
    const newRows = [...rows];
    newRows[index] = { ...newRows[index], [field]: value };
    setRows(newRows);
  };

  const handleCheckboxChange = (index: number, option: string) => {
    const newRows = [...rows];
    const currentOptions = newRows[index].cardOptions;

    if (currentOptions.includes(option)) {
      newRows[index].cardOptions = currentOptions.filter(opt => opt !== option);
    } else {
      newRows[index].cardOptions = [...currentOptions, option];
    }

    setRows(newRows);
  };

  const handleAddRow = () => {
    // Add 10 new rows
    const newRows = Array.from({ length: 10 }, () => ({ cardName: '', cardId: '', cardOptions: [] }));
    setRows([...rows, ...newRows]);
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

      // Navigate to results page after successful submission
      navigate('/results');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h1>Dynamic Rows</h1>
      <form onSubmit={handleSubmit}>
        {rows.map((row, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder="Card Name"
              value={row.cardName}
              onChange={(e) => handleChange(index, 'cardName', e.target.value)}
            />
            <input
              type="text"
              placeholder="Card ID"
              value={row.cardId}
              onChange={(e) => handleChange(index, 'cardId', e.target.value)}
            />
            <div>
              <label>
                <input
                  type="checkbox"
                  checked={row.cardOptions.includes('holo')}
                  onChange={() => handleCheckboxChange(index, 'holo')}
                />
                Holo
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={row.cardOptions.includes('reverse holo')}
                  onChange={() => handleCheckboxChange(index, 'reverse holo')}
                />
                Reverse Holo
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={row.cardOptions.includes('first edition')}
                  onChange={() => handleCheckboxChange(index, 'first edition')}
                />
                First Edition
              </label>
            </div>
          </div>
        ))}
        <button type="button" onClick={handleAddRow}>Add 10 Rows</button>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default DynamicRows;
