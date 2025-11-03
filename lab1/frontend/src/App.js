import { useState } from "react";

function App() {
    const [name, setName] = useState("");
    const [response, setResponse] = useState("");

    const handleSubmit = async () => {
        try {
            const res = await fetch("http://localhost:8080/main", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                        "name": "Interstellar",
                        "coordinates": {
                            "x": 320.5,
                            "y": 150
                        },
                        "oscarsCount": 5,
                        "budget": 200000000,
                        "totalBoxOffice": 250000000,
                        "mpaaRating": "PG_13",
                        "director": {
                            "name": "James Cameron",
                            "eyeColor": "BROWN",
                            "hairColor": "BROWN",
                            "weight": 85,
                            "nationality": "UNITED_KINGDOM",
                            "location": {
                                "x": 12.5,
                                "y": 45.3,
                                "z": 8.2,
                                "name": "London"
                            }
                        },
                        "screenwriter": {
                            "name": "Rick Jaffa",
                            "eyeColor": "RED",
                            "hairColor": "ORANGE",
                            "weight": 72,
                            "nationality": "GERMANY",
                            "location": {
                                "x": 33.2,
                                "y": 55.1,
                                "z": 10.4,
                                "name": "Berlin"
                            }
                        },
                        "operator": {
                            "name": "Russell Carpenter",
                            "eyeColor": "BROWN",
                            "hairColor": "BROWN",
                            "weight": 90,
                            "nationality": "CHINA",
                            "location": {
                                "x": 14.7,
                                "y": 30.9,
                                "z": 5.0,
                                "name": "Beijing"
                            }
                        },
                        "length": 190,
                        "goldenPalmCount": 3,
                        "usaBoxOffice": 150000000.0,
                        "genre": "FANTASY"
                    }
                ),
            });
            if (!res.ok) throw new Error(res.statusText);
            const data = await res.json();
            setResponse(JSON.stringify(data));
        } catch (err) {
            setResponse("Error: " + err.message);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Создать фильм</h2>
            <input
                type="text"
                placeholder="Название фильма"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <button onClick={handleSubmit}>Отправить</button>

            <h3>Ответ сервера:</h3>
            <pre>{response}</pre>
        </div>
    );
}

export default App;
