import React, { useEffect, useState } from 'react';

const ResultsPage: React.FC = () => {
    const [results, setResults] = useState<any[]>([]); // Set initial state as an empty array
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await fetch('http://localhost:8000/results');
                if (!response.ok) {
                    throw new Error('Failed to fetch results');
                }
                const data = await response.json();
                console.log('Fetched Results:', data); // Log the fetched data
                setResults(data.results); // Set results from the response
            } catch (err) {
                setError((err as Error)?.message || 'An unknown error occurred');
                console.error('Error fetching results:', err);
            }
        };

        fetchResults();
    }, []);

    return (
        <div>
            <h1>Results</h1>
            {error && <p>Error: {error}</p>}
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
                    {Array.isArray(results) && results.length > 0 ? (
                        results.map((result, index) => (
                            <tr key={index}>
                                <td>{result.card}</td>
                                <td>{result.id}</td>
                                <td>{result.holo ? 'Yes' : 'No'}</td>
                                <td>{result.reverse_holo ? 'Yes' : 'No'}</td>
                                <td>{result.first_edition ? 'Yes' : 'No'}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5}>No results found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ResultsPage;
