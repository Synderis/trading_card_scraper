import React, { useEffect, useState } from 'react';
import '../CSS Sheets/ResultsPage.css';

interface ResultData {
    card: string;
    id: string;
    Ungraded: string;
    'Grade 1': string;
    'Grade 2': string;
    'Grade 3': string;
    'Grade 4': string;
    'Grade 5': string;
    'Grade 6': string;
    'Grade 7': string;
    'Grade 8': string;
    'Grade 9': string;
    'Grade 9.5': string;
    'SGC 10': string;
    'CGC 10': string;
    'PSA 10': string;
    'BGS 10': string;
    'BGS 10 Black': string;
    'CGC 10 Pristine': string;
    final_link: string;
}

const ResultsPage: React.FC = () => {
    const [results, setResults] = useState<ResultData[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await fetch('http://localhost:8000/results');
                if (!response.ok) {
                    throw new Error('Failed to fetch results');
                }
                const data = await response.json();
                // Extract the results from the response
                const formattedResults = Object.keys(data.results.card).map(key => ({
                    card: data.results.card[key],
                    id: data.results.id[key],
                    Ungraded: data.results.Ungraded[key],
                    'Grade 1': data.results['Grade 1'][key],
                    'Grade 2': data.results['Grade 2'][key],
                    'Grade 3': data.results['Grade 3'][key],
                    'Grade 4': data.results['Grade 4'][key],
                    'Grade 5': data.results['Grade 5'][key],
                    'Grade 6': data.results['Grade 6'][key],
                    'Grade 7': data.results['Grade 7'][key],
                    'Grade 8': data.results['Grade 8'][key],
                    'Grade 9': data.results['Grade 9'][key],
                    'Grade 9.5': data.results['Grade 9.5'][key],
                    'SGC 10': data.results['SGC 10'][key],
                    'CGC 10': data.results['CGC 10'][key],
                    'PSA 10': data.results['PSA 10'][key],
                    'BGS 10': data.results['BGS 10'][key],
                    'BGS 10 Black': data.results['BGS 10 Black'][key],
                    'CGC 10 Pristine': data.results['CGC 10 Pristine'][key],
                    final_link: data.results.final_link[key],
                }));
                setResults(formattedResults);
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
                    {results.length > 0 ? (
                        results.map((result, index) => (
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
