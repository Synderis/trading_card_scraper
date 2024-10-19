import React, { useEffect, useState } from 'react';

const ResultsPage: React.FC = () => {
    const [results, setResults] = useState<any>({}); // Set initial state as an empty object
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

    // Transform results into an array of objects for rendering
    const transformedResults = Object.keys(results.card || {}).map((key) => ({
        card: results.card[key],
        id: results.id[key],
        Ungraded: results.Ungraded[key],
        'Grade 1': results['Grade 1'][key],
        'Grade 2': results['Grade 2'][key],
        'Grade 3': results['Grade 3'][key],
        'Grade 4': results['Grade 4'][key],
        'Grade 5': results['Grade 5'][key],
        'Grade 6': results['Grade 6'][key],
        'Grade 7': results['Grade 7'][key],
        'Grade 8': results['Grade 8'][key],
        'Grade 9': results['Grade 9'][key],
        'Grade 9.5': results['Grade 9.5'][key],
        'SGC 10': results['SGC 10'][key],
        'CGC 10': results['CGC 10'][key],
        'PSA 10': results['PSA 10'][key],
        'BGS 10': results['BGS 10'][key],
        'BGS 10 Black': results['BGS 10 Black'][key],
        'CGC 10 Pristine': results['CGC 10 Pristine'][key],
        final_link: results.final_link[key],
    }));

    return (
        <div>
            <h1>Results</h1>
            {error && <p>Error: {error}</p>}
            <table>
                <thead>
                    <tr>
                        <th>Card</th>
                        <th>ID</th>
                        <th>Ungraded</th>
                        <th>Grade 1</th>
                        <th>Grade 2</th>
                        <th>Grade 3</th>
                        <th>Grade 4</th>
                        <th>Grade 5</th>
                        <th>Grade 6</th>
                        <th>Grade 7</th>
                        <th>Grade 8</th>
                        <th>Grade 9</th>
                        <th>Grade 9.5</th>
                        <th>SGC 10</th>
                        <th>CGC 10</th>
                        <th>PSA 10</th>
                        <th>BGS 10</th>
                        <th>BGS 10 Black</th>
                        <th>CGC 10 Pristine</th>
                        <th>Final Link</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(transformedResults) && transformedResults.length > 0 ? (
                        transformedResults.map((result, index) => (
                            <tr key={index}>
                                <td>{result.card}</td>
                                <td>{result.id}</td>
                                <td>{result.Ungraded}</td>
                                <td>{result['Grade 1']}</td>
                                <td>{result['Grade 2']}</td>
                                <td>{result['Grade 3']}</td>
                                <td>{result['Grade 4']}</td>
                                <td>{result['Grade 5']}</td>
                                <td>{result['Grade 6']}</td>
                                <td>{result['Grade 7']}</td>
                                <td>{result['Grade 8']}</td>
                                <td>{result['Grade 9']}</td>
                                <td>{result['Grade 9.5']}</td>
                                <td>{result['SGC 10']}</td>
                                <td>{result['CGC 10']}</td>
                                <td>{result['PSA 10']}</td>
                                <td>{result['BGS 10']}</td>
                                <td>{result['BGS 10 Black']}</td>
                                <td>{result['CGC 10 Pristine']}</td>
                                <td>
                                    <a href={result.final_link} target="_blank" rel="noopener noreferrer">View</a>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={18}>No results found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ResultsPage;
