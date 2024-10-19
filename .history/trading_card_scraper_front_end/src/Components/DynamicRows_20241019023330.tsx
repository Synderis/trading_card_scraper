import React, { useState } from 'react';

interface RowData {
    input1: string;
    input2: string;
    radio: string;
}

const DynamicRows: React.FC = () => {
    const [rows, setRows] = useState<RowData[]>(createInitialRows(10));

    function createInitialRows(count: number): RowData[] {
        return Array.from({ length: count }, () => ({
        input1: '',
        input2: '',
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
                name="input1"
                value={row.input1}
                onChange={(e) => handleInputChange(e, index)}
                placeholder="Input 1"
            />
            <input
                type="text"
                name="input2"
                value={row.input2}
                onChange={(e) => handleInputChange(e, index)}
                placeholder="Input 2"
            />
            <label>
                <input
                    type="radio"
                    name={`radio-${index}`}
                    value="option1"
                    checked={row.radio === 'option1'}
                    onChange={(e) => handleInputChange(e, index)}
                />
                Option 1
            </label>
            <label>
                <input
                    type="radio"
                    name={`radio-${index}`}
                    value="option2"
                    checked={row.radio === 'option2'}
                    onChange={(e) => handleInputChange(e, index)}
                />
                Option 2
            </label>
            <label>
                <input
                    type="radio"
                    name={`radio-${index}`}
                    value="option3"
                    checked={row.radio === 'option3'}
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
