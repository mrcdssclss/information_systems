import { useState } from "react";

export default function FilterTable({ data }) {
    const [filter, setFilter] = useState("");
    const [sortKey, setSortKey] = useState("");
    const [sortAsc, setSortAsc] = useState(true);

    const filteredData = data.filter(row =>
        Object.values(row).some(
            val => typeof val === "string" && val.toLowerCase().includes(filter.toLowerCase())
        )
    );

    const sortedData = sortKey
        ? [...filteredData].sort((a, b) => {
            if(a[sortKey] < b[sortKey]) return sortAsc ? -1 : 1;
            if(a[sortKey] > b[sortKey]) return sortAsc ? 1 : -1;
            return 0;
        })
        : filteredData;

    const handleSort = key => {
        if(sortKey === key) {
            setSortAsc(!sortAsc);
        } else {
            setSortKey(key);
            setSortAsc(true);
        }
    };

    if(!data || data.length === 0) return <div>Нет данных</div>;

    const columns = Object.keys(data[0]);

    return (
        <div>
            <input
                type="text"
                placeholder="Фильтр по любому тексту..."
                value={filter}
                onChange={e => setFilter(e.target.value)}
                style={{ marginBottom: "10px" }}
            />
            <table border="1" cellPadding="5">
                <thead>
                <tr>
                    {columns.map(col => (
                        <th key={col} onClick={() => handleSort(col)} style={{ cursor: "pointer" }}>
                            {col} {sortKey === col ? (sortAsc ? "▲" : "▼") : ""}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {sortedData.map((row, i) => (
                    <tr key={i}>
                        {columns.map(col => (
                            <td key={col}>{row[col]}</td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
