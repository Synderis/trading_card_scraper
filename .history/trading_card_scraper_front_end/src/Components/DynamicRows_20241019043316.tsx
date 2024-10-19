import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Define the Row type
type Row = {
    cardName: string;
    cardId: string;
    cardOptions: string[];
};

const DynamicRows: React.FC = () => {
    // Initialize the state with the Row type
    const [rows, setRows] = useState<Row[]>([{ cardName: '', cardId: '', cardOptions: [] }]);
    const navigate = useNavigate();

    // Change handler for text inputs
    const handleChange = (index: number, field: keyof Row, value: string) => {
        const newRows = [...rows]; // Create a shallow copy of rows
        newRows[index] = { ...newRows[index], [field]: value }; // Spread the row to update the specific field
        setRows(newRows); // Update the state with the new rows
    };

    // Change handler for checkboxes
    const handleCheckboxChange = (index: number, option: string) => {
        const newRows = [...rows]; // Create a shallow copy of rows
        const currentOptions = newRows[index].cardOptions;

        // Toggle the checkbox option
        if (currentOptions.includes(option)) {
        newRows[index].cardOptions = currentOptions.filter(opt => opt !== option); // Remove if already included
        } else {
        newRows[index].cardOptions = [...currentOptions, option]; // Add if not included
        }
        
        setRows(newRows); // Update the state with the new rows
    };

    // Function to add a new row
    const handleAddRow = () => {
        setRows([...rows, { cardName: '', cardId: '', cardOptions: [] }]); // Add a new empty row
    };

    // Function to handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
        const response = await fetch('http://localhost:8000/submit', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(rows), // Send the rows data to the backend
        });

        if (!response.ok) {
            throw new Error('Failed to submit rows'); // Handle error response
        }

        // Redirect to results page after successful submission
        navigate('/results');
        } catch (error) {
        console.error('Error:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
        {rows.map((row, index) => (
            <div key={index}>
            <input
                type="text"
                placeholder="Card Name"
                value={row.cardName}
                onChange={(e) => handleChange(index, 'cardName', e.target.value)} // Update cardName
            />
            <input
                type="text"
                placeholder="Card ID"
                value={row.cardId}
                onChange={(e) => handleChange(index, 'cardId', e.target.value)} // Update cardId
            />
            <div>
                <label>
                <input
                    type="checkbox"
                    checked={row.cardOptions.includes('holo')}
                    onChange={() => handleCheckboxChange(index, 'holo')} // Toggle Holo
                />
                Holo
                </label>
                <label>
                <input
                    type="checkbox"
                    checked={row.cardOptions.includes('reverse holo')}
                    onChange={() => handleCheckboxChange(index, 'reverse holo')} // Toggle Reverse Holo
                />
                Reverse Holo
                </label>
                <label>
                <input
                    type="checkbox"
                    checked={row.cardOptions.includes('first edition')}
                    onChange={() => handleCheckboxChange(index, 'first edition')} // Toggle First Edition
                />
                First Edition
                </label>
            </div>
            </div>
        ))}
        <button type="button" onClick={handleAddRow}>Add Row</button> {/* Button to add more rows */}
        <button type="submit">Submit</button> {/* Submit button */}
        </form>
    );
};

export default DynamicRows;
