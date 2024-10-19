import React, { useEffect, useState } from 'react';
import '../CSS Sheets/ResultsPage.css';

interface Results {
    card: string[];
    id: string[];
    Ungraded: string[];
    'Grade 1': string[];
    'Grade 2': string[];
    'Grade 3': string[];
    'Grade 4': string[];
    'Grade 5': string[];
    'Grade 6': string[];
    'Grade 7': string[];
    'Grade 8': string[];
    'Grade 9': string[];
    'Grade 9.5': string[];
    'SGC 10': string[];
    'CGC 10': string[];
    'PSA 10': string[];
    'BGS 10': string[];
    'BGS 10 Black': string[];
    'CGC 10 Pristine': string[];
    final_link: string[];
}

const ResultsPage: React.FC = () => {
    const [results, setResults] = useState<Results | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await fetch('http://localhost:8000/results');
                if (!response.ok) {
                    throw new Error('Failed to fetch results');
                }
                const data = await response.json();
                console.log('Fetched Results:', data);
                setResults(data.results); // Set results from the response
            } catch (err) {
                setError((err as Error)?.message || 'An unknown error occurred');
                console.error('Error fetching results:', err);
            }
        };

        fetchResults();
    }, []);

    // Check if results are loaded
    if (!results) {
        return <div>Loading...</div>;
    }

    // Transform results into an array of objects for rendering
    const transformedResults = results.card.map((_, index) => ({
        card: results.card[index],
        id: results.id[index],
        Ungraded: results.Ungraded[index],
        'Grade 1': results['Grade 1'][index],
        'Grade 2': results['Grade 2'][index],
        'Grade 3': results['Grade 3'][index],
        'Grade 4': results['Grade 4'][index],
        'Grade 5': results['Grade 5'][index],
        'Grade 6': results['Grade 6'][index],
        'Grade 7': results['Grade 7'][index],
        'Grade 8': results['Grade 8'][index],
        'Grade 9': results['Grade 9'][index],
        'Grade 9.5': results['Grade 9.5'][index],
        'SGC 10': results['SGC 10'][index],
        'CGC 10': results['CGC 10'][index],
        'PSA 10': results['PSA 10'][index],
        'BGS 10': results['BGS 10'][index],
        'BGS 10 Black': results['BGS 10 Black'][index],
        'CGC 10 Pristine': results['CGC 10 Pristine'][index],
        final_link: results.final_link[index],
    }));

    return (
        <div>
            <h1>Results</h1>
            {error && <p>Error: {error}</p>}
            <table className="results-table">
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
                    {transformedResults.length > 0 ? (
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
