import React, { useEffect, useState } from "react";
import axios from "axios";
import "../CSS Sheets/ResultsPage.css"; // Adjust the path as necessary

interface Results {
    [key: string]: string[];
}

const ResultsPage: React.FC = () => {
    const [results, setResults] = useState<Results | null>(null);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await axios.get("http://localhost:8000/results");
                console.log("Full response:", response.data);
                console.log("Fetched results:", response.data.results); // Log the raw response
                setResults(response.data.results); // Set the results in state
            } catch (error) {
                console.error("Error fetching results:", error);
            }
        };

        fetchResults();
    }, []);

    useEffect(() => {
        console.log("Results state:", results); // Log the results state for debugging
    }, [results]);

    if (!results) {
        return <div>Loading...</div>;
    }

    // Check the structure of results
    const columnHeaders = results ? Object.keys(results) : [];
    console.log("Column headers:", columnHeaders); // Debugging log for headers

    // Make sure to check if results[columnHeaders[0]] exists before accessing length
    const numRows = results && Object.values(results)[0] ? Object.values(results)[0].length : 0; // Ensure this correctly counts rows
    // Use optional chaining to prevent undefined access

    console.log("Number of rows:", numRows); // Debugging log for number of rows

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
                            {columnHeaders.map((header) => {
                                return (
                                    <td key={header} className="table-cell">
                                        {results[header][rowIndex] || "N/A"} {/* Provide a fallback */}
                                    </td>
                                );
                            })}
                            <td>{rowIndex}</td> {/* Debugging cell */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ResultsPage;
