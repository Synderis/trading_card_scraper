import React, { useEffect, useState } from 'react';

const ResultsPage: React.FC = () => {
    const [results, setResults] = useState<any[]>([]);

    useEffect(() => {
        const fetchResults = async () => {
        const response = await fetch('http://localhost:8000/results'); // Adjust this endpoint as necessary
        if (response.ok) {
            const data = await response.json();
            setResults(data); // Assuming the response is a list of results
        }
        };

        fetchResults();
    }, []);

    return (
        <div>
        <h1>Results</h1>
        <table>
            <thead>
            <tr>
                <th>Card Name</th>
                <th>Card ID</th>
                <th>Options</th>
            </tr>
            </thead>
            <tbody>
            {results.map((result, index) => (
                <tr key={index}>
                <td>{result.card}</td>
                <td>{result.id}</td>
                <td>
                    {result.holo ? 'Holo ' : ''}
                    {result.reverse_holo ? 'Reverse Holo ' : ''}
                    {result.first_edition ? 'First Edition' : ''}
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    );
};

export default ResultsPage;
