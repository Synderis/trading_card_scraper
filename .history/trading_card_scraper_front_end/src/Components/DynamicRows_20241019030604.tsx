import React, { useState } from 'react';

interface RowData {
    card_name: string;
    card_id: string;
    cardOptions: string[];
}

const DynamicRows: React.FC = () => {
    const [rows, setRows] = useState<RowData[]>(createInitialRows(10));

    function createInitialRows(count: number): RowData[] {
        return Array.from({ length: count }, () => ({
            card_name: '',
            card_id: '',
            cardOptions: [],
        }));
    }

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        index: number
    ) => {
        const { name, value, checked } = e.target;
        const newRows = [...rows];

        if (name.startsWith('checkbox')) {
            if (checked) {
                newRows[index].cardOptions.push(value);
            } else {
                newRows[index].cardOptions = newRows[index].cardOptions.filter(
                    (option) => option !== value
                );
            }
        } else {
            (newRows[index] as any)[name] = value;
        }
        setRows(newRows);
    };

    const handleAddRows = () => {
        setRows([...rows, ...createInitialRows(10)]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        const validRows = rows.filter(
            (row) => row.card_name.trim() !== '' && row.card_id.trim() !== ''
        );
    
        if (validRows.length === 0) {
            alert('No valid rows to submit.');
            return;
        }
    
        try {
            const response = await fetch('http://localhost:8000/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(validRows),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                alert(`Error: ${errorData.detail}`);
                return;
            }
    
            const responseData = await response.json();
            console.log('Server Response:', responseData);
            alert('Form submitted successfully!');
    
        } catch (error) {
            console.error('Submission error:', error);
            alert('An error occurred during submission.');
        }
    };
    

    return (
        <form onSubmit={handleSubmit}>
            {rows.map((row, index) => (
                <div key={index} style={{ marginBottom: '10px' }}>
                    <input
                        type="text"
                        name="card_name"
                        value={row.card_name}
                        onChange={(e) => handleInputChange(e, index)}
                        placeholder="Input 1"
                    />
                    <input
                        type="text"
                        name="card_id"
                        value={row.card_id}
                        onChange={(e) => handleInputChange(e, index)}
                        placeholder="Input 2"
                    />
                    <label>
                        <input
                            type="checkbox"
                            name={`checkbox-${index}`}
                            value="holo"
                            checked={row.cardOptions.includes('holo')}
                            onChange={(e) => handleInputChange(e, index)}
                        />
                        Holo
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            name={`checkbox-${index}`}
                            value="reverse holo"
                            checked={row.cardOptions.includes('reverse holo')}
                            onChange={(e) => handleInputChange(e, index)}
                        />
                        Reverse Holo
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            name={`checkbox-${index}`}
                            value="first edition"
                            checked={row.cardOptions.includes('first edition')}
                            onChange={(e) => handleInputChange(e, index)}
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
