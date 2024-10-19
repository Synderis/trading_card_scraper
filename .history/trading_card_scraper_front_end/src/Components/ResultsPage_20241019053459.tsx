import React, { useEffect, useState } from "react";
import axios from "axios";
import "../CSS Sheets/ResultsPage.css"; // Adjust the path as necessary

// Define an interface for the expected structure of results
interface Results {
    card: string[];
    id: string[];
    Ungraded: string[];
    "Grade 1": string[];
    "Grade 2": string[];
    "Grade 3": string[];
    "Grade 4": string[];
    "Grade 5": string[];
    "Grade 6": string[];
    "Grade 7": string[];
    "Grade 8": string[];
    "Grade 9": string[];
    "Grade 9.5": string[];
    "SGC 10": string[];
    "CGC 10": string[];
    "PSA 10": string[];
    "BGS 10": string[];
    "BGS 10 Black": string[];
    "CGC 10 Pristine": string[];
    final_link: string[];
}

const ResultsPage: React.FC = () => {
    const [results, setResults] = useState<Results | null>(null);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await axios.get("http://localhost:8000/results");
                console.log("Fetched results:", response.data.results); // Log the raw response
                setResults(response.data.results); // Set the results in state
            } catch (error) {
                console.error("Error fetching results:", error);
            }
        };

        fetchResults();
    }, []);

    // Log the results state whenever it changes
    useEffect(() => {
        console.log("Results state:", results);
    }, [results]);

    if (!results) {
        return <div>Loading...</div>;
    }

    // Get column headers
    const columnHeaders = Object.keys(results) as (keyof Results)[];
    const numRows = results[columnHeaders[0]].length; // Use the first column's length to determine row count

    if (numRows === 0) {
        return <div>No results found</div>; // Handle the case of no data
    }

    // Function to convert data to CSV format
    const downloadCSV = () => {
        const csvRows: string[] = [];

        // Add header row
        csvRows.push(columnHeaders.join(","));

        // Add data rows
        for (let i = 0; i < numRows; i++) {
            const row = columnHeaders.map(header => results[header][i]).join(",");
            csvRows.push(row);
        }

        // Create a Blob from the CSV data and create a link to download it
        const csvString = csvRows.join("\n");
        const blob = new Blob([csvString], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement("a");
        a.href = url;
        a.download = "results.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="results-container">
            <h1>Results</h1>
            <button onClick={downloadCSV} className="download-button">Download CSV</button>
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
                                    {results[header][rowIndex]} {/* Accessing the data correctly */}
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
