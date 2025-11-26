import React, { useState } from "react";

function SpecialOperations() {
    const API = "http://localhost:8080/movies";

    const [usaBoxOffice, setUsaBoxOffice] = useState("");
    const [threshold, setThreshold] = useState("");
    const [genre, setGenre] = useState("DRAMA");
    const [lengthThreshold, setLengthThreshold] = useState("");
    const [extraOscars, setExtraOscars] = useState("");
    const [result, setResult] = useState(null);
    const [isArray, setIsArray] = useState(false);

    const deleteByBoxOffice = async () => {
        const res = await fetch(`${API}/deleteByUsaBoxOffice/${usaBoxOffice}`, {
            method: "DELETE"
        });
        setResult(await res.text());
    };

    const sumGoldenPalm = async () => {
        const res = await fetch(`${API}/sumGoldenPalm`);
        setResult(await res.text());
    };

    const getGreaterGoldenPalm = async () => {
        const res = await fetch(`${API}/greaterGoldenPalm/${threshold}`);
        const data = await res.json();
        setIsArray(true);
        setResult(data);
    };


    const stripOscars = async () => {
        const res = await fetch(`${API}/special/stripOscars/${genre}`, { method: "POST" });
        setIsArray(false);
        setResult(await res.text());
    };

    const awardOscars = async () => {
        const res = await fetch(
            `${API}/awardOscars?length=${lengthThreshold}&extra=${extraOscars}`,
            { method: "POST" }
        );
        setIsArray(false);
        setResult(await res.text());
    };

    return (
        <div style={{padding: "20px", border: "1px solid #aaa"}}>
            <h2>Special Movie Operations</h2>

            <h3>Удалить по USA Box Office</h3>
            <input
                type="number"
                value={usaBoxOffice}
                onChange={e => setUsaBoxOffice(e.target.value)}
                placeholder="USA Box Office"
            />
            <button onClick={deleteByBoxOffice}>Удалить</button>

            <h3>Сумма GoldenPalmCount</h3>
            <button onClick={sumGoldenPalm}>Посчитать</button>

            <h3>Фильмы с GoldenPalmCount &gt; N</h3>
            <input
                type="number"
                value={threshold}
                onChange={e => setThreshold(e.target.value)}
                placeholder="Порог"
            />
            <button onClick={getGreaterGoldenPalm}>Получить</button>

            <h3>Убрать Оскары по жанру</h3>
            <select value={genre} onChange={e => setGenre(e.target.value)}>
                <option value="DRAMA">Drama</option>
                <option value="ADVENTURE">Adventure</option>
                <option value="FANTASY">Fantasy</option>
            </select>
            <button onClick={stripOscars}>Убрать</button>

            <h3>Добавить Оскары фильмам с длиной больше N</h3>
            <input
                type="number"
                placeholder="Минимальная длина"
                value={lengthThreshold}
                onChange={e => setLengthThreshold(e.target.value)}
            />
            <input
                type="number"
                placeholder="Сколько добавить"
                value={extraOscars}
                onChange={e => setExtraOscars(e.target.value)}
            />
            <button onClick={awardOscars}>Добавить</button>

            <h3>Результат</h3>

            {result !== null && !Array.isArray(result) && !isNaN(Number(result)) && (
                <pre style={{ background: "#eee", padding: "10px" }}>{result}</pre>
            )}

            {Array.isArray(result) && (
                <table border="1" cellPadding="5" style={{ borderCollapse: "collapse", width: "100%" }}>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Creation Date</th>
                        <th>Oscars Count</th>
                        <th>Budget</th>
                        <th>Total Box Office</th>
                        <th>USA Box Office</th>
                        <th>Length</th>
                        <th>Golden Palm</th>
                        <th>Genre</th>
                        <th>MPAA Rating</th>
                        <th>Coordinates (X,Y)</th>
                        <th>Director</th>
                        <th>Screenwriter</th>
                        <th>Operator</th>
                    </tr>
                    </thead>

                    <tbody>
                    {result.map(m => (
                        <tr key={m.id}>
                            <td>{m.id}</td>
                            <td>{m.name}</td>
                            <td>{m.creationDate ? new Date(m.creationDate).toLocaleString() : "-"}</td>
                            <td>{m.oscarsCount ?? "-"}</td>
                            <td>{m.budget ?? "-"}</td>
                            <td>{m.totalBoxOffice ?? "-"}</td>
                            <td>{m.usaBoxOffice ?? "-"}</td>
                            <td>{m.length ?? "-"}</td>
                            <td>{m.goldenPalmCount ?? "-"}</td>
                            <td>{m.genre ?? "-"}</td>
                            <td>{m.mpaaRating ?? "-"}</td>
                            <td>{m.coordinates ? `${m.coordinates.x}, ${m.coordinates.y}` : "-"}</td>
                            <td>{m.director ? `${m.director.id} / ${m.director.name}` : "-"}</td>
                            <td>{m.screenwriter ? `${m.screenwriter.id} / ${m.screenwriter.name}` : "-"}</td>
                            <td>{m.operator ? `${m.operator.id} / ${m.operator.name}` : "-"}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
            {result !== null && typeof result === "string" && isNaN(Number(result)) && (
                <pre style={{ background: "#eee", padding: "10px", marginTop: "10px" }}>
        {result}
    </pre>
            )}


        </div>
    );
}

export default SpecialOperations;
