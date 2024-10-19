import React, { useState } from 'react';

interface RowData {
    card_name: string;
    card_id_number: string;
    radio: string;
}

const DynamicRows: React.FC = () => {
    const [rows, setRows] = useState<RowData[]>(createInitialRows(10));

    function createInitialRows(count: number): RowData[] {
        return Array.from({ length: count }, () => ({
        card_name: '',
        card_id_number: '',
        radio: '',
        }));
    }

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        index: number
    ) => {
        const { name, value } = e.target;
        const newRows = [...rows];
        (newRows[index] as any)[name] = value;
        setRows(newRows);
    };

    const handleAddRows = () => {
        setRows([...rows, ...createInitialRows(10)]);
    };

    return (
        <div>
        {rows.map((row, index) => (
            <div key={index} style={{ marginBottom: '10px' }}>
            <input
                type="text"
                name="Card Name"
                value={row.card_name}
                onChange={(e) => handleInputChange(e, index)}
                placeholder="Card Name"
            />
            <input
                type="text"
                name="Card Id/Number"
                value={row.card_id_number}
                onChange={(e) => handleInputChange(e, index)}
                placeholder="Card Id/Number"
            />
            <label>
                <input
                    type="radio"
                    name={`radio-${index}`}
                    value="Holo"
                    checked={row.radio === 'Holo'}
                    onChange={(e) => handleInputChange(e, index)}
                />
                Option 1
            </label>
            <label>
                <input
                    type="radio"
                    name={`radio-${index}`}
                    value="Reverse Holo"
                    checked={row.radio === 'Reverse Holo'}
                    onChange={(e) => handleInputChange(e, index)}
                />
                Option 2
            </label>
            <label>
                <input
                    type="radio"
                    name={`radio-${index}`}
                    value="1st Edition"
                    checked={row.radio === '1st Edition'}
                    onChange={(e) => handleInputChange(e, index)}
                />
                Option 3
            </label>
            </div>
        ))}
        <button onClick={handleAddRows}>Add 10 More Rows</button>
        </div>
    );
};

export default DynamicRows;
