import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import '../CSS Sheets/InputRows.css';

type Row = {
  cardName: string;
  cardId: string;
  holo: boolean;
  reverse_holo: boolean;
  first_edition: boolean;
  limited_edition: boolean;
  card_count: number | null; // Allow card_count to be null
  isInvalid?: boolean;
};

const DynamicRows: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initialRowState = Array.from({ length: 10 }, () => ({
    cardName: '',
    cardId: '',
    holo: false,
    reverse_holo: false,
    first_edition: false,
    limited_edition: false,
    card_count: 1, // Initialize as null
    isInvalid: false, // Initialize isInvalid
  }));

  const [rows, setRows] = useState<Row[]>(initialRowState);

  const checkInvalidRows = (updatedRows: Row[]) => {
    return updatedRows.map(row => ({
      ...row,
      isInvalid: 
        !row.cardName || 
        !row.cardId || 
        (row.card_count !== null && row.card_count <= 0), // Check if card_count is null or greater than 0
    }));
  };

  const handleChange = (index: number, field: keyof Row, value: string | boolean | number) => {
    const newRows = [...rows];

    if (field === 'cardName' || field === 'cardId') {
      newRows[index][field] = value as string;
    } else if (field === 'holo' || field === 'reverse_holo' || field === 'first_edition' || field === 'limited_edition') {
      newRows[index][field] = value as boolean;
    } else if (field === 'card_count') {
      newRows[index][field] = value === '' ? 1 : Number(value); // Set to null if input is empty
    }

    // Check for invalid rows after the change
    const updatedRows = checkInvalidRows(newRows);
    setRows(updatedRows);
  };

  const handleAddRows = () => {
    const newRowsToAdd: Row[] = Array.from({ length: 10 }, () => ({
      cardName: '',
      cardId: '',
      holo: false,
      reverse_holo: false,
      first_edition: false,
      limited_edition: false,
      card_count: 1, // Initialize as null
      isInvalid: false, // Initialize isInvalid
    }));
    setRows(prevRows => [...prevRows, ...newRowsToAdd]);
  };

  const handleClearRow = (index: number) => {
    const newRows = [...rows];
    newRows[index] = {
      cardName: '',
      cardId: '',
      holo: false,
      reverse_holo: false,
      first_edition: false,
      limited_edition: false,
      card_count: 1, // Initialize as null
      isInvalid: false, // Reset isInvalid
    };
    setRows(newRows);
  };

  const handleClearAllRows = () => {
    setRows(initialRowState);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset file input
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const invalidRows = rows.some(row => row.isInvalid);
    
    if (invalidRows) {
      alert('Please fix the invalid rows before submitting.');
      return;
    }

    const payload = {
      cards: rows.map(row => ({
        card_name: row.cardName,
        card_id: String(row.cardId),
        holo: row.holo,
        reverse_holo: row.reverse_holo,
        first_edition: row.first_edition,
        limited_edition: row.limited_edition,
        card_count: row.card_count, // No need to convert to Number, already handled
      })),
    };

    try {
      const response = await fetch('http://localhost:8000/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
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
          const parsedRows: Row[] = results.data.map((row: any) => {
            const isInvalid =
              !(row.holo === 'true' || row.holo === true || row.holo === 1 || row.holo === 'false' || row.holo === false || row.holo === 0 || row.holo === null) ||
              !(row.reverse_holo === 'true' || row.reverse_holo === true || row.reverse_holo === 1 || row.reverse_holo === 'false' || row.reverse_holo === false || row.reverse_holo === 0 || row.reverse_holo === null) ||
              !(row.first_edition === 'true' || row.first_edition === true || row.first_edition === 1 || row.first_edition === 'false' || row.first_edition === false || row.first_edition === 0 || row.first_edition === null) ||
              !(row.limited_edition === 'true' || row.limited_edition === true || row.limited_edition === 1 || row.limited_edition === 'false' || row.limited_edition === false || row.limited_edition === 0 || row.limited_edition === null) ||
              !(row.card_count === null || row.card_count > 0); // Validate card_count
  
            return {
              cardName: row.cardName || '',
              cardId: row.cardId || '',
              holo: row.holo === 'true' || row.holo === true || row.holo === 1,
              reverse_holo: row.reverse_holo === 'true' || row.reverse_holo === true || row.reverse_holo === 1,
              first_edition: row.first_edition === 'true' || row.first_edition === true || row.first_edition === 1,
              limited_edition: row.limited_edition === 'true' || row.limited_edition === true || row.limited_edition === 1,
              // Set card_count to 1 if it's null or empty
              card_count: row.card_count === null || row.card_count === '' ? 1 : row.card_count,
              isInvalid,
            };
          });
          setRows(parsedRows);
        },
        error: (error) => {
          console.error('CSV parsing error:', error);
        }
      });
    }
  };

  const downloadCSVTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "cardName,cardId,holo,reverse_holo,first_edition,limited_edition,card_count\n" +
      ",,,,,,"; // One empty line for a row

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "card_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container">
      <h1>Card Input Rows</h1>
      <button className='download-template-btn' onClick={downloadCSVTemplate}>Download CSV Template</button>
      <input type="file" accept=".csv" ref={fileInputRef} style={{ marginBottom: '10px' }} onChange={handleCSVUpload} />
      <h4>Enter the data for each row or upload a CSV file. Rows with potentially invalid CSV data will be marked red.</h4>
      <form onSubmit={handleSubmit}>
        {rows.map((row, index) => (
          <div key={index} className={`row ${row.isInvalid ? 'invalid-row' : ''}`}>
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
            <label>
              <input
                type="checkbox"
                checked={row.limited_edition}
                onChange={() => handleChange(index, 'limited_edition', !row.limited_edition)}
              />
              Limited Edition
            </label>
            Card Count: 
            <input
              type="number"
              value={row.card_count === null ? '' : row.card_count} // Display as empty string if null
              onChange={(e) => handleChange(index, 'card_count', e.target.value)}
              placeholder="Card Count"
              maxLength={3}
              style={{ marginLeft: '10px' }}
            />
            <button type="button" className="clear-btn" onClick={() => handleClearRow(index)}>Clear</button>
          </div>
        ))}
        <button type="button" onClick={handleAddRows}>Add Rows</button>
        <button type="button" className="clear-all-btn" onClick={handleClearAllRows}>Clear All</button>
        <button type="submit" className="submit-btn">Submit</button>
      </form>
    </div>
  );
};

export default DynamicRows;
