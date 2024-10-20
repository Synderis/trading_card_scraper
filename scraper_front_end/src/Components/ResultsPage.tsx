import React, { useEffect, useState } from 'react';
import '../CSS Sheets/ResultsPage.css';

interface ResultData {
    card: string;
    id: string;
    card_count: string;
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
    img_link: string;
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
                const formattedResults: ResultData[] = [];
                const length = Object.keys(data.results.card).length;

                for (let i = 0; i < length; i++) {
                    formattedResults.push({
                        card: data.results.card[i],
                        id: data.results.id[i],
                        card_count: data.results.card_count[i],
                        Ungraded: data.results.Ungraded[i],
                        'Grade 1': data.results['Grade 1'][i],
                        'Grade 2': data.results['Grade 2'][i],
                        'Grade 3': data.results['Grade 3'][i],
                        'Grade 4': data.results['Grade 4'][i],
                        'Grade 5': data.results['Grade 5'][i],
                        'Grade 6': data.results['Grade 6'][i],
                        'Grade 7': data.results['Grade 7'][i],
                        'Grade 8': data.results['Grade 8'][i],
                        'Grade 9': data.results['Grade 9'][i],
                        'Grade 9.5': data.results['Grade 9.5'][i],
                        'SGC 10': data.results['SGC 10'][i],
                        'CGC 10': data.results['CGC 10'][i],
                        'PSA 10': data.results['PSA 10'][i],
                        'BGS 10': data.results['BGS 10'][i],
                        'BGS 10 Black': data.results['BGS 10 Black'][i],
                        'CGC 10 Pristine': data.results['CGC 10 Pristine'][i],
                        final_link: data.results.final_link[i],
                        img_link: data.results.img_link[i],
                    });
                }
                setResults(formattedResults);
            } catch (err) {
                setError((err as Error)?.message || 'An unknown error occurred');
                console.error('Error fetching results:', err);
            }
        };

        fetchResults();
    }, []);

    const convertToCSV = (data: ResultData[], totals: any) => {
        const header = [
            'Card',
            'ID',
            'Card Count',
            'Ungraded',
            'Grade 1',
            'Grade 2',
            'Grade 3',
            'Grade 4',
            'Grade 5',
            'Grade 6',
            'Grade 7',
            'Grade 8',
            'Grade 9',
            'Grade 9.5',
            'SGC 10',
            'CGC 10',
            'PSA 10',
            'BGS 10',
            'BGS 10 Black',
            'CGC 10 Pristine',
            'Final Link',
        ].join(',');

        const rows = data.map(item => [
            item.card,
            item.id,
            item.card_count,
            item.Ungraded,
            item['Grade 1'],
            item['Grade 2'],
            item['Grade 3'],
            item['Grade 4'],
            item['Grade 5'],
            item['Grade 6'],
            item['Grade 7'],
            item['Grade 8'],
            item['Grade 9'],
            item['Grade 9.5'],
            item['SGC 10'],
            item['CGC 10'],
            item['PSA 10'],
            item['BGS 10'],
            item['BGS 10 Black'],
            item['CGC 10 Pristine'],
            item.final_link,
        ].join(',')).join('\n');

        // Add totals row
        const totalsRow = [
            'Totals:',
            '',
            totals.card_count,
            `$${totals.Ungraded.toFixed(2)}`,
            `$${totals['Grade 1'].toFixed(2)}`,
            `$${totals['Grade 2'].toFixed(2)}`,
            `$${totals['Grade 3'].toFixed(2)}`,
            `$${totals['Grade 4'].toFixed(2)}`,
            `$${totals['Grade 5'].toFixed(2)}`,
            `$${totals['Grade 6'].toFixed(2)}`,
            `$${totals['Grade 7'].toFixed(2)}`,
            `$${totals['Grade 8'].toFixed(2)}`,
            `$${totals['Grade 9'].toFixed(2)}`,
            `$${totals['Grade 9.5'].toFixed(2)}`,
            `$${totals['SGC 10'].toFixed(2)}`,
            `$${totals['CGC 10'].toFixed(2)}`,
            `$${totals['PSA 10'].toFixed(2)}`,
            `$${totals['BGS 10'].toFixed(2)}`,
            `$${totals['BGS 10 Black'].toFixed(2)}`,
            `$${totals['CGC 10 Pristine'].toFixed(2)}`,
            '',
        ].join(',');

        return `${header}\n${rows}\n${totalsRow}`;
    };

    const downloadCSV = () => {
        const totals = calculateTotals(results);
        const csvData = convertToCSV(results, totals);
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'results.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Function to calculate totals for each grade category
    const calculateTotals = (results: ResultData[]) => {
        const initialTotals = {
            card_count: 0,
            Ungraded: 0,
            'Grade 1': 0,
            'Grade 2': 0,
            'Grade 3': 0,
            'Grade 4': 0,
            'Grade 5': 0,
            'Grade 6': 0,
            'Grade 7': 0,
            'Grade 8': 0,
            'Grade 9': 0,
            'Grade 9.5': 0,
            'SGC 10': 0,
            'CGC 10': 0,
            'PSA 10': 0,
            'BGS 10': 0,
            'BGS 10 Black': 0,
            'CGC 10 Pristine': 0,
        };
    
        return results.reduce((totals, item) => {
            const count = parseInt(item.card_count) || 0; // Convert card_count to an integer
    
            totals.card_count += count; // Add card_count
    
            // Calculate totals for each grade category multiplied by card_count
            totals.Ungraded += (parseFloat(item.Ungraded.replace(/[^0-9.-]+/g, '')) || 0) * count;
            totals['Grade 1'] += (parseFloat(item['Grade 1'].replace(/[^0-9.-]+/g, '')) || 0) * count;
            totals['Grade 2'] += (parseFloat(item['Grade 2'].replace(/[^0-9.-]+/g, '')) || 0) * count;
            totals['Grade 3'] += (parseFloat(item['Grade 3'].replace(/[^0-9.-]+/g, '')) || 0) * count;
            totals['Grade 4'] += (parseFloat(item['Grade 4'].replace(/[^0-9.-]+/g, '')) || 0) * count;
            totals['Grade 5'] += (parseFloat(item['Grade 5'].replace(/[^0-9.-]+/g, '')) || 0) * count;
            totals['Grade 6'] += (parseFloat(item['Grade 6'].replace(/[^0-9.-]+/g, '')) || 0) * count;
            totals['Grade 7'] += (parseFloat(item['Grade 7'].replace(/[^0-9.-]+/g, '')) || 0) * count;
            totals['Grade 8'] += (parseFloat(item['Grade 8'].replace(/[^0-9.-]+/g, '')) || 0) * count;
            totals['Grade 9'] += (parseFloat(item['Grade 9'].replace(/[^0-9.-]+/g, '')) || 0) * count;
            totals['Grade 9.5'] += (parseFloat(item['Grade 9.5'].replace(/[^0-9.-]+/g, '')) || 0) * count;
            totals['SGC 10'] += (parseFloat(item['SGC 10'].replace(/[^0-9.-]+/g, '')) || 0) * count;
            totals['CGC 10'] += (parseFloat(item['CGC 10'].replace(/[^0-9.-]+/g, '')) || 0) * count;
            totals['PSA 10'] += (parseFloat(item['PSA 10'].replace(/[^0-9.-]+/g, '')) || 0) * count;
            totals['BGS 10'] += (parseFloat(item['BGS 10'].replace(/[^0-9.-]+/g, '')) || 0) * count;
            totals['BGS 10 Black'] += (parseFloat(item['BGS 10 Black'].replace(/[^0-9.-]+/g, '')) || 0) * count;
            totals['CGC 10 Pristine'] += (parseFloat(item['CGC 10 Pristine'].replace(/[^0-9.-]+/g, '')) || 0) * count;
    
            return totals;
        }, initialTotals);
    };
    
    const totals = calculateTotals(results);

    return (
        <div className="results-page">
            <h1>Results</h1>
            {error && <p>Error: {error}</p>}
            <button onClick={downloadCSV} style={{ marginBottom: '20px' }} className="download-button">
                Download CSV
            </button>
            <table>
                <thead>
                    <tr>
                        <th>Card</th>
                        <th>ID</th>
                        <th>Card Count</th>
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
                        <th>Page Link</th>
                    </tr>
                </thead>
                <tbody>
                    {results.map((item, index) => (
                        <tr key={index}>
                            <td>
                                <span className="img-hover-link">
                                    {item.card}
                                    <span className="img-hover-tooltip">
                                        <img src={item.img_link} alt="Card" />
                                    </span>
                                </span>
                            </td>
                            {/* <td>{item.card}</td> */}
                            <td>{item.id}</td>
                            <td>{item.card_count}</td>
                            <td>{item.Ungraded}</td>
                            <td>{item['Grade 1']}</td>
                            <td>{item['Grade 2']}</td>
                            <td>{item['Grade 3']}</td>
                            <td>{item['Grade 4']}</td>
                            <td>{item['Grade 5']}</td>
                            <td>{item['Grade 6']}</td>
                            <td>{item['Grade 7']}</td>
                            <td>{item['Grade 8']}</td>
                            <td>{item['Grade 9']}</td>
                            <td>{item['Grade 9.5']}</td>
                            <td>{item['SGC 10']}</td>
                            <td>{item['CGC 10']}</td>
                            <td>{item['PSA 10']}</td>
                            <td>{item['BGS 10']}</td>
                            <td>{item['BGS 10 Black']}</td>
                            <td>{item['CGC 10 Pristine']}</td>
                            <td>
                                <a href={item.final_link} target="_blank" rel="noopener noreferrer">View</a>
                            </td>
                        </tr>
                    ))}
                    <tr>
                        <td colSpan={2}><strong>Totals:</strong></td>
                        <td>{totals.card_count}</td>
                        <td>${totals.Ungraded.toFixed(2)}</td>
                        <td>${totals['Grade 1'].toFixed(2)}</td>
                        <td>${totals['Grade 2'].toFixed(2)}</td>
                        <td>${totals['Grade 3'].toFixed(2)}</td>
                        <td>${totals['Grade 4'].toFixed(2)}</td>
                        <td>${totals['Grade 5'].toFixed(2)}</td>
                        <td>${totals['Grade 6'].toFixed(2)}</td>
                        <td>${totals['Grade 7'].toFixed(2)}</td>
                        <td>${totals['Grade 8'].toFixed(2)}</td>
                        <td>${totals['Grade 9'].toFixed(2)}</td>
                        <td>${totals['Grade 9.5'].toFixed(2)}</td>
                        <td>${totals['SGC 10'].toFixed(2)}</td>
                        <td>${totals['CGC 10'].toFixed(2)}</td>
                        <td>${totals['PSA 10'].toFixed(2)}</td>
                        <td>${totals['BGS 10'].toFixed(2)}</td>
                        <td>${totals['BGS 10 Black'].toFixed(2)}</td>
                        <td>${totals['CGC 10 Pristine'].toFixed(2)}</td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default ResultsPage;
