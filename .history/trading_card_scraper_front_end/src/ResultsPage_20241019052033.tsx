import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CSS Sheets/ResultsPage.css"; // Adjust the path as necessary

const ResultsPage: React.FC = () => {
    const [results, setResults] = useState<{ [key: string]: string[] } | null>(null);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await axios.get("http://localhost:8000/results");
                setResults(response.data.results);
            } catch (error) {
                console.error("Error fetching results:", error);
            }
        };

        fetchResults();
    }, []);

    if (!results) {
        return <div>Loading...</div>;
    }

    // Ensure that results are not empty before using Object.values
    const columnHeaders = Object.keys(results);
    const firstColumnValues = Object.values(results)[0];

    if (!firstColumnValues || firstColumnValues.length === 0) {
        return <div>No results found</div>; // Handle the case of no data
    }

    const numRows = firstColumnValues.length;

    return (
        <div className="results-container">
            <h1>Results</h1>
            <table className="results-table">
                <thead>
                    <tr>
                        {columnHeaders.map((header) => (
                            <th key={header}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: numRows }, (_, rowIndex) => (
                        <tr key={rowIndex}>
                            {columnHeaders.map((header) => (
                                <td key={header} className="table-cell">
                                    {results[header][rowIndex]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ResultsPage;
