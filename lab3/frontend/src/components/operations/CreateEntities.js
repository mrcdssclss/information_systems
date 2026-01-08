import { useState, useEffect } from "react";
import ProgressBar from "../tables/ProgressBar";

export default function CreateEntities( {externalSetHistory} ) {

    const [coordinates, setCoordinates] = useState({ x: "", y: "" });

    const [directorLocation, setDirectorLocation] = useState({ x: "", y: "", z: "", name: "" });
    const [operatorLocation, setOperatorLocation] = useState({ x: "", y: "", z: "", name: "" });
    const [screenwriterLocation, setScreenwriterLocation] = useState({ x: "", y: "", z: "", name: "" });

    const [tasksProgress, setTasksProgress] = useState([]);

    const [message, _setMessage] = useState("");

    const setMessage = (msg) => {
        _setMessage(msg);
    };


    const [director, setDirector] = useState({
        name: "", eyeColor: "RED", hairColor: "RED",
        weight: 1, nationality: "UNITED_KINGDOM"
    });
    const [operator, setOperator] = useState({
        name: "", eyeColor: "RED", hairColor: "RED",
        weight: 1, nationality: "UNITED_KINGDOM"
    });
    const [screenwriter, setScreenwriter] = useState({
        name: "", eyeColor: "RED", hairColor: "RED",
        weight: 1, nationality: "UNITED_KINGDOM"
    });

    const [movie, setMovie] = useState({
        name: "unnamed",
        genre: "DRAMA",
        length: 1,
        oscarsCount: 1,
        totalBoxOffice: 1,
        mpaaRating: "PG",
        budget: 1,
        goldenPalmCount: 1,
        usaBoxOffice: 1,
        isImported: false
    });

    const [persons, setPersons] = useState([]);
    const [selectedDirectorId, setSelectedDirectorId] = useState("");
    const [selectedOperatorId, setSelectedOperatorId] = useState("");
    const [selectedScreenwriterId, setSelectedScreenwriterId] = useState("");

    useEffect(() => {
        fetch("http://localhost:8080/persons")
            .then(res => res.json())
            .then(data => setPersons(data || []))
            .catch(err => console.error(err));
    }, []);

    const handleSubmit = async (e, importedData = null) => {
        if (e) e.preventDefault();
        const taskId = importedData ? `import-${importedData.movie?.id || Math.random()}` : `manual-${Date.now()}`;

        updateProgress(taskId, 0, "in-progress", importedData ? `Импорт фильма` : `Создание фильма`);

        const data = importedData ?? {
            movie,
            coordinates,
            director,
            operator,
            screenwriter,
            directorLocation,
            operatorLocation,
            screenwriterLocation,
            selectedDirectorId,
            selectedOperatorId,
            selectedScreenwriterId
        };

        try {
            const coordRes = await fetch("http://localhost:8080/coordinates", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    x: Number(data.coordinates.x),
                    y: Number(data.coordinates.y)
                })
            });
            if (!coordRes.ok) throw new Error("Ошибка при создании координат");
            const savedCoord = await coordRes.json();

            const savedDirector = data.selectedDirectorId
                ? { id: data.selectedDirectorId }
                : await (async () => {
                    const loc = await createLocation(data.directorLocation);
                    return await createPerson(data.director, loc.id);
                })();

            const savedOperator = data.selectedOperatorId
                ? { id: data.selectedOperatorId }
                : await (async () => {
                    const loc = await createLocation(data.operatorLocation);
                    return await createPerson(data.operator, loc.id);
                })();

            let savedScreenwriter = null;
            if (data.selectedScreenwriterId && data.selectedScreenwriterId !== "skip") {
                savedScreenwriter = { id: data.selectedScreenwriterId };
            } else if (!data.selectedScreenwriterId && data.screenwriter.name?.trim() !== "") {
                const loc = await createLocation(data.screenwriterLocation);
                savedScreenwriter = await createPerson(data.screenwriter, loc.id);
            }

            const movieToSave = {
                ...data.movie,
                isImported: !!importedData,
                coordinates: { id: savedCoord.id },
                director: { id: savedDirector.id },
                operator: { id: savedOperator.id },
                ...(savedScreenwriter && { screenwriter: { id: savedScreenwriter.id } }),
            };

            const movieRes = await fetch("http://localhost:8080/movies", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(movieToSave)
            });

            if (!movieRes.ok) throw new Error("Ошибка при создании фильма");

            const savedMovie = await movieRes.json();
            updateProgress(taskId, 100, "success", importedData ? `Импорт фильма` : `Создание фильма`);

            if (!importedData) setMessage("Создано! Movie ID: " + savedMovie.id);

            return savedMovie;

        } catch (err) {
            if (!importedData) setMessage(err.message);
            console.error(err.message);
            throw err;
        }
    };

    const createLocation = async (loc) => {
        if (!loc) return null;
        const res = await fetch("http://localhost:8080/locations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                x: Number(loc.x),
                y: Number(loc.y),
                z: Number(loc.z),
                name: loc.name
            })
        });
        if (!res.ok) throw new Error("Ошибка при создании локации");
        return await res.json();
    };

    const createPerson = async (person, locId) => {
        if (!person) return null;
        const payload = {
            name: person.name,
            eyeColor: person.eyeColor,
            hairColor: person.hairColor,
            weight: person.weight,
            nationality: person.nationality,
            location: { id: locId }
        };
        const res = await fetch("http://localhost:8080/persons", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error("Ошибка при создании человека");
        return await res.json();
    };

    const handleImport = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                setMessage("Ошибка загрузки файла на сервер");
                return;
            }

            const result = await response.json();
            const fileId = result.fileId;

            const text = await file.text();
            const list = JSON.parse(text);

            if (!Array.isArray(list)) {
                setMessage("Формат неверный: нужен массив фильмов");
                return;
            }

            let ok = 0, fail = 0;

            for (let i = 0; i < list.length; i++) {
                const taskId = `import-${i}`;
                try {
                    const savedMovie = await handleSubmit(null, list[i]);
                    updateProgress(taskId, 100, "success", `Импорт фильма ${i + 1}`);

                    externalSetHistory(prev => [
                        ...prev,
                        { id: savedMovie.id, status: "success", count: 1 }
                    ]);

                    ok++;
                } catch (err) {
                    updateProgress(taskId, 100, "fail", `Импорт фильма ${i + 1}`);

                    externalSetHistory(prev => [
                        ...prev,
                        {
                            id: null,
                            status: "fail",
                            count: 0,
                            error: err.message
                        }
                    ]);

                    fail++;
                }
            }

            setMessage(`Импорт завершён. Успех: ${ok}, Ошибки: ${fail}`);

        } catch (err) {
            setMessage("Ошибка чтения JSON: " + err.message);

            externalSetHistory(prev => [
                ...prev,
                {
                    id: null,
                    status: "fail",
                    count: 0,
                    error: "Ошибка чтения JSON: " + err.message
                }
            ]);
        }
    };



    const renderPersonSelect = (
        label, selectedId, setSelectedId,
        person, setPerson,
        location, setLocation,
        optional = false
    ) => (
        <>
            <h3>{label}</h3>

            <select value={selectedId} onChange={e => setSelectedId(e.target.value)}>
                <option value="">Создать нового</option>
                {optional && <option value="skip">Пропустить</option>}
                {persons.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                ))}
            </select>

            {selectedId === "" && (
                <>
                    <input placeholder="Name"
                           value={person.name}
                           onChange={e => setPerson({ ...person, name: e.target.value })}
                           required={!optional}
                    />

                    <label>
                        Eye:
                        <select value={person.eyeColor}
                                onChange={e => setPerson({ ...person, eyeColor: e.target.value })}>
                            <option value="RED">RED</option>
                            <option value="ORANGE">ORANGE</option>
                            <option value="BROWN">BROWN</option>
                        </select>
                    </label>

                    <label>
                        Hair:
                        <select value={person.hairColor}
                                onChange={e => setPerson({ ...person, hairColor: e.target.value })}>
                            <option value="RED">RED</option>
                            <option value="ORANGE">ORANGE</option>
                            <option value="BROWN">BROWN</option>
                        </select>
                    </label>

                    <label>
                        Weight:
                        <input type="number"
                               value={person.weight}
                               onChange={e => setPerson({ ...person, weight: e.target.value })}/>
                    </label>

                    <label>
                        Nationality:
                        <select value={person.nationality}
                                onChange={e => setPerson({ ...person, nationality: e.target.value })}>
                            <option value="UNITED_KINGDOM">United Kingdom</option>
                            <option value="GERMANY">Germany</option>
                            <option value="CHINA">China</option>
                            <option value="NORTH_KOREA">North Korea</option>
                        </select>
                    </label>

                    <h4>{label} Location</h4>
                    <input placeholder="X" value={location.x}
                           onChange={e => setLocation({ ...location, x: e.target.value })}/>
                    <input placeholder="Y" value={location.y}
                           onChange={e => setLocation({ ...location, y: e.target.value })}/>
                    <input placeholder="Z" value={location.z}
                           onChange={e => setLocation({ ...location, z: e.target.value })}/>
                    <input placeholder="Name" value={location.name}
                           onChange={e => setLocation({ ...location, name: e.target.value })}/>
                </>
            )}
        </>
    );

    const updateProgress = (id, progress, status = "in-progress", label = "") => {
        setTasksProgress(prev => {
            const index = prev.findIndex(task => task.id === id);
            if (index >= 0) {
                const newTasks = [...prev];
                newTasks[index] = { ...newTasks[index], progress, status, label };
                return newTasks;
            }
            return [...prev, { id, progress, status, label }];
        });

        if (progress >= 100) {
            setTimeout(() => {
                setTasksProgress(prev => prev.filter(task => task.id !== id));
            }, 500);
        }
    };

    return (
        <div>

            <div style={{ padding: 10, border: "1px solid #B890E0" }}>
                <input type="file" accept=".json" onChange={handleImport}/>
                <p>Формат: [{"{"}"movie": "...", ...{"}"}]</p>
            </div>
            {tasksProgress.length > 0 && (
                <div style={{ marginTop: 10 }}>
                    {tasksProgress.map(task => (
                        <ProgressBar key={task.id} {...task} />
                    ))}
                </div>
            )}


            {message && <p style={{ color: "#B890E0", fontWeight: "bold", margin: "10px 0" }}>{message}</p>}
            <form onSubmit={handleSubmit} style={{ padding: 20, border: "1px solid #ccc" }}>

                <h3>Coordinates</h3>
                <input placeholder="X" value={coordinates.x}
                       onChange={e => setCoordinates({ ...coordinates, x: e.target.value })}/>
                <input placeholder="Y" value={coordinates.y}
                       onChange={e => setCoordinates({ ...coordinates, y: e.target.value })} required/>

                {renderPersonSelect("Director", selectedDirectorId, setSelectedDirectorId,
                    director, setDirector, directorLocation, setDirectorLocation)}

                {renderPersonSelect("Operator", selectedOperatorId, setSelectedOperatorId,
                    operator, setOperator, operatorLocation, setOperatorLocation)}

                {renderPersonSelect("Screenwriter", selectedScreenwriterId, setSelectedScreenwriterId,
                    screenwriter, setScreenwriter, screenwriterLocation, setScreenwriterLocation, true)}

                <h3>Movie</h3>

                <input placeholder="Название" value={movie.name}
                       onChange={e => setMovie({ ...movie, name: e.target.value })} required/>

                <label>Length:
                    <input type="number" value={movie.length}
                           onChange={e => setMovie({ ...movie, length: e.target.value })}/>
                </label>

                <label>Oscars:
                    <input type="number" value={movie.oscarsCount}
                           onChange={e => setMovie({ ...movie, oscarsCount: e.target.value })}/>
                </label>

                <label>Budget:
                    <input type="number" value={movie.budget}
                           onChange={e => setMovie({ ...movie, budget: e.target.value })}/>
                </label>

                <label>Golden Palm:
                    <input type="number" value={movie.goldenPalmCount}
                           onChange={e => setMovie({ ...movie, goldenPalmCount: e.target.value })}/>
                </label>

                <label>USA Box:
                    <input type="number" value={movie.usaBoxOffice}
                           onChange={e => setMovie({ ...movie, usaBoxOffice: e.target.value })}/>
                </label>

                <label>Total Box:
                    <input type="number" value={movie.totalBoxOffice}
                           onChange={e => setMovie({ ...movie, totalBoxOffice: e.target.value })}/>
                </label>

                <select value={movie.genre}
                        onChange={e => setMovie({ ...movie, genre: e.target.value })}>
                    <option value="DRAMA">Drama</option>
                    <option value="ADVENTURE">Adventure</option>
                    <option value="FANTASY">Fantasy</option>
                </select>

                <select value={movie.mpaaRating}
                        onChange={e => setMovie({ ...movie, mpaaRating: e.target.value })}>
                    <option value="PG">PG</option>
                    <option value="R">R</option>
                    <option value="PG_13">PG_13</option>
                </select>

                <button type="submit" style={{ marginTop: 10 }}>
                    Create All
                </button>

            </form>
        </div>
    );
}
