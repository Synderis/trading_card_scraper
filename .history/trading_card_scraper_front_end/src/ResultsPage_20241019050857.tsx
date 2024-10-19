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
            {/* {error && <p>Error: {error}</p>} */}
            <table>
                <thead>
                    <tr>
                        <th>Card</th>
                        <th>ID</th>
                        <th>Holo</th>
                        <th>Reverse Holo</th>
                        <th>First Edition</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(results) && results.map((result, index) => (
                        <tr key={index}>
                            <td>{result.card}</td>
                            <td>{result.id}</td>
                            <td>{result.holo ? 'Yes' : 'No'}</td>
                            <td>{result.reverse_holo ? 'Yes' : 'No'}</td>
                            <td>{result.first_edition ? 'Yes' : 'No'}</td>
                        </tr>
                    ))}
                    {!Array.isArray(results) && <tr><td colSpan={5}>No results found</td></tr>}
                </tbody>
            </table>
        </div>
    );
    
};

export default ResultsPage;
