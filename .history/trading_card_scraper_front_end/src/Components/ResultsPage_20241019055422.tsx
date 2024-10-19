import React, { useEffect, useState } from 'react';

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
    [key: string]: string[]; // Index signature to allow any string key
}

const ResultsPage: React.FC = () => {
    const [results, setResults] = useState<Results | null>(null);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await fetch('http://localhost:8000/results');
                const data = await response.json();
                console.log("Fetched data:", data);
                setResults(data.results);
                console.log("Results state:", data.results);
            } catch (error) {
                console.error("Error fetching results:", error);
            }
        };

        fetchResults();
    }, []);

    // Check if results are loaded
    if (!results) {
        return <div>Loading...</div>;
    }

    // Number of rows based on the length of the "card" array
    const numRows = results.card.length;

    return (
        <div>
            <h1>Results</h1>
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
                    {numRows > 0 ? (
                        Array.from({ length: numRows }, (_, rowIndex) => (
                            <tr key={rowIndex}>
                                <td>{results.card[rowIndex]}</td>
                                <td>{results.id[rowIndex]}</td>
                                <td>{results.Ungraded[rowIndex]}</td>
                                <td>{results['Grade 1'][rowIndex]}</td>
                                <td>{results['Grade 2'][rowIndex]}</td>
                                <td>{results['Grade 3'][rowIndex]}</td>
                                <td>{results['Grade 4'][rowIndex]}</td>
                                <td>{results['Grade 5'][rowIndex]}</td>
                                <td>{results['Grade 6'][rowIndex]}</td>
                                <td>{results['Grade 7'][rowIndex]}</td>
                                <td>{results['Grade 8'][rowIndex]}</td>
                                <td>{results['Grade 9'][rowIndex]}</td>
                                <td>{results['Grade 9.5'][rowIndex]}</td>
                                <td>{results['SGC 10'][rowIndex]}</td>
                                <td>{results['CGC 10'][rowIndex]}</td>
                                <td>{results['PSA 10'][rowIndex]}</td>
                                <td>{results['BGS 10'][rowIndex]}</td>
                                <td>{results['BGS 10 Black'][rowIndex]}</td>
                                <td>{results['CGC 10 Pristine'][rowIndex]}</td>
                                <td><a href={results.final_link[rowIndex]} target="_blank" rel="noopener noreferrer">Link</a></td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={18}>No results available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ResultsPage;
