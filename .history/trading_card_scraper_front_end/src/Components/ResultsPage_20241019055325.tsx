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

    // Manually specify headers and their corresponding keys
    const headers = [
        { label: "Card", key: "card" },
        { label: "ID", key: "id" },
        { label: "Ungraded", key: "Ungraded" },
        { label: "Grade 1", key: "Grade 1" },
        { label: "Grade 2", key: "Grade 2" },
        { label: "Grade 3", key: "Grade 3" },
        { label: "Grade 4", key: "Grade 4" },
        { label: "Grade 5", key: "Grade 5" },
        { label: "Grade 6", key: "Grade 6" },
        { label: "Grade 7", key: "Grade 7" },
        { label: "Grade 8", key: "Grade 8" },
        { label: "Grade 9", key: "Grade 9" },
        { label: "Grade 9.5", key: "Grade 9.5" },
        { label: "SGC 10", key: "SGC 10" },
        { label: "CGC 10", key: "CGC 10" },
        { label: "PSA 10", key: "PSA 10" },
        { label: "BGS 10", key: "BGS 10" },
        { label: "BGS 10 Black", key: "BGS 10 Black" },
        { label: "CGC 10 Pristine", key: "CGC 10 Pristine" },
        { label: "Final Link", key: "final_link" },
    ];

    const numRows = results ? results.card.length : 0; // Assuming all keys have the same length

    return (
        <div>
            <h1>Results</h1>
            <table className="results-table">
                <thead>
                    <tr>
                        {headers.map((header) => (
                            <th key={header.key}>{header.label}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {numRows > 0 && results ? (
                        Array.from({ length: numRows }, (_, rowIndex) => (
                            <tr key={rowIndex}>
                                {headers.map(({ key }) => (
                                    <td key={key} className="table-cell">
                                        {results[key][rowIndex] || "N/A"}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={headers.length}>No results available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ResultsPage;
