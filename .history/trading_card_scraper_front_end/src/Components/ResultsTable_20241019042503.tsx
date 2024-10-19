import React, { useEffect, useState } from 'react';

interface CardResult {
    card: string;
    id: string;
    holo: boolean;
    reverse_holo: boolean;
    first_edition: boolean;
    limited_edition: boolean;
}

const ResultsTable: React.FC = () => {
    const [results, setResults] = useState<CardResult[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchResults = async () => {
        try {
            const response = await fetch('http://localhost:8000/results'); // Update the port as needed
            if (!response.ok) {
            throw new Error('Failed to fetch results');
            }
            const data = await response.json();
            setResults(data.results);
        } catch (err) {
        // Use optional chaining or fallback to a default message
        setError((err as Error)?.message || 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
        };

        fetchResults();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
        <h2>Results</h2>
        <table>
            <thead>
            <tr>
                <th>Card Name</th>
                <th>Card ID</th>
                <th>Holo</th>
                <th>Reverse Holo</th>
                <th>First Edition</th>
                <th>Limited Edition</th>
            </tr>
            </thead>
            <tbody>
            {results.map((result, index) => (
                <tr key={index}>
                <td>{result.card}</td>
                <td>{result.id}</td>
                <td>{result.holo ? 'Yes' : 'No'}</td>
                <td>{result.reverse_holo ? 'Yes' : 'No'}</td>
                <td>{result.first_edition ? 'Yes' : 'No'}</td>
                <td>{result.limited_edition ? 'Yes' : 'No'}</td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    );
};

export default ResultsTable;
