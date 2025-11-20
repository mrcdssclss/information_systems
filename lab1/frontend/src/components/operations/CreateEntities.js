import { useState, useEffect } from "react";

export default function CreateEntities() {
    const [coordinates, setCoordinates] = useState({ x: "", y: "" });
    const [directorLocation, setDirectorLocation] = useState({ x: "", y: "", z: "", name: "" });
    const [screenwriterLocation, setScreenwriterLocation] = useState({ x: "", y: "", z: "", name: "" });
    const [operatorLocation, setOperatorLocation] = useState({ x: "", y: "", z: "", name: "" });

    const [director, setDirector] = useState({ name: "", eyeColor: "RED", hairColor: "RED", weight: 1, nationality: "UNITED_KINGDOM", location: null });
    const [operator, setOperator] = useState({ name: "", eyeColor: "RED", hairColor: "RED", weight: 1, nationality: "UNITED_KINGDOM", location: null });
    const [screenwriter, setScreenwriter] = useState({ name: "", eyeColor: "RED", hairColor: "RED", weight: 1, nationality: "UNITED_KINGDOM", location: null });

    const [movie, setMovie] = useState({
        name: "unnamed",
        genre: "DRAMA",
        length: 1,
        oscarsCount: 1,
        totalBoxOffice: 1,
        mpaaRating: "PG",
        budget: 1,
        goldenPalmCount: 1,
        usaBoxOffice: 1
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Создание координат
            const coordRes = await fetch("http://localhost:8080/coordinates", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ x: Number(coordinates.x), y: Number(coordinates.y) })
            });
            if (!coordRes.ok) throw new Error("Ошибка при создании координат");
            const savedCoord = await coordRes.json();

            const createLocation = async (loc) => {
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

            // Director
            const savedDirector = selectedDirectorId
                ? { id: selectedDirectorId }
                : await createPerson(director, (await createLocation(directorLocation)).id);

            // Operator
            const savedOperator = selectedOperatorId
                ? { id: selectedOperatorId }
                : await createPerson(operator, (await createLocation(operatorLocation)).id);

            // Screenwriter (опционально, но можно создать нового)
            let savedScreenwriter;
            if (selectedScreenwriterId) {
                savedScreenwriter = { id: selectedScreenwriterId };
            } else if (screenwriter.name.trim().length > 0) {
                const savedLocScreenwriter = await createLocation(screenwriterLocation);
                savedScreenwriter = await createPerson(screenwriter, savedLocScreenwriter.id);
            }

            const movieToSave = {
                ...movie,
                coordinates: { id: savedCoord.id },
                director: { id: savedDirector.id },
                operator: { id: savedOperator.id },
                ...(savedScreenwriter && { screenwriter: { id: savedScreenwriter.id } })
            };

            const movieRes = await fetch("http://localhost:8080/movies", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(movieToSave)
            });
            if (!movieRes.ok) throw new Error("Ошибка при создании фильма");
            const savedMovie = await movieRes.json();

            alert("Все сущности успешно созданы! Movie ID: " + savedMovie.id);

            // Сброс формы
            setCoordinates({ x: "", y: "" });
            setDirectorLocation({ name: "", x: "", y: "", z: "" });
            setOperatorLocation({ name: "", x: "", y: "", z: "" });
            setScreenwriterLocation({ name: "", x: "", y: "", z: "" });
            setDirector({ name: "", eyeColor: "RED", hairColor: "RED", weight: 1, nationality: "UNITED_KINGDOM", location: null });
            setScreenwriter({ name: "", eyeColor: "RED", hairColor: "RED", weight: 1, nationality: "UNITED_KINGDOM", location: null });
            setOperator({ name: "", eyeColor: "RED", hairColor: "RED", weight: 1, nationality: "UNITED_KINGDOM", location: null });
            setSelectedDirectorId("");
            setSelectedOperatorId("");
            setSelectedScreenwriterId("");
            setMovie({
                name: "unnamed",
                genre: "DRAMA",
                length: 1,
                oscarsCount: 1,
                totalBoxOffice: 1,
                mpaaRating: "PG",
                budget: 1,
                goldenPalmCount: 1,
                usaBoxOffice: 1
            });

        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };

    const renderPersonSelect = (label, selectedId, setSelectedId, person, setPerson, location, setLocation, optional=false) => (
        <>
            <h3>{label}</h3>
            <select value={selectedId} onChange={e => setSelectedId(e.target.value)}>
                <option value=""> Создать нового</option>
                {optional && <option value="skip">Пропустить</option>}
                {persons.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            {selectedId === "" && (
                <>
                    <input
                        placeholder="Name"
                        value={person.name}
                        onChange={e => setPerson({ ...person, name: e.target.value })}
                        required={!optional}
                    />
                    <label>Eye color
                        <select value={person.eyeColor} onChange={e => setPerson({ ...person, eyeColor: e.target.value })}>
                            <option value="RED">red</option>
                            <option value="ORANGE">orange</option>
                            <option value="BROWN">brown</option>
                        </select>
                    </label>
                    <label>Hair color
                        <select value={person.hairColor} onChange={e => setPerson({ ...person, hairColor: e.target.value })}>
                            <option value="RED">red</option>
                            <option value="ORANGE">orange</option>
                            <option value="BROWN">brown</option>
                        </select>
                    </label>
                    <label>Weight
                        <input type="number" value={person.weight} onChange={e => setPerson({ ...person, weight: e.target.value })}/>
                    </label>
                    <label>Nationality
                        <select value={person.nationality} onChange={e => setPerson({ ...person, nationality: e.target.value })}>
                            <option value="UNITED_KINGDOM">United Kingdom</option>
                            <option value="GERMANY">Germany</option>
                            <option value="CHINA">China</option>
                            <option value="NORTH_KOREA">North Korea</option>
                        </select>
                    </label>
                    <h4>{label} Location</h4>
                    <input placeholder="X" value={location.x} onChange={e => setLocation({ ...location, x: e.target.value })}/>
                    <input placeholder="Y" value={location.y} onChange={e => setLocation({ ...location, y: e.target.value })}/>
                    <input placeholder="Z" value={location.z} onChange={e => setLocation({ ...location, z: e.target.value })}/>
                    <input placeholder="Name" value={location.name} onChange={e => setLocation({ ...location, name: e.target.value })}/>
                </>
            )}
        </>
    );

    return (
        <form onSubmit={handleSubmit} style={{ padding: "20px", border: "1px solid #ccc" }}>
            <h3>Coordinates</h3>
            <input placeholder="X" value={coordinates.x} min={0} max={643} onChange={e => setCoordinates({ ...coordinates, x: e.target.value })}/>
            <input placeholder="Y" value={coordinates.y} min={0} onChange={e => setCoordinates({ ...coordinates, y: e.target.value })} required/>

            {renderPersonSelect("Director", selectedDirectorId, setSelectedDirectorId, director, setDirector, directorLocation, setDirectorLocation)}
            {renderPersonSelect("Operator", selectedOperatorId, setSelectedOperatorId, operator, setOperator, operatorLocation, setOperatorLocation)}
            {renderPersonSelect("Screenwriter", selectedScreenwriterId, setSelectedScreenwriterId, screenwriter, setScreenwriter, screenwriterLocation, setScreenwriterLocation, true)}

            <h3>Movie</h3>
            <label>Name
                <input placeholder="Название фильма" value={movie.name} onChange={e => setMovie({ ...movie, name: e.target.value })} required/>
            </label>
            <label>Length
                <input type="number" value={movie.length} onChange={e => setMovie({ ...movie, length: e.target.value })}/>
            </label>
            <label>Oscars
                <input type="number" value={movie.oscarsCount} onChange={e => setMovie({ ...movie, oscarsCount: e.target.value })}/>
            </label>
            <label>Budget
                <input type="number" value={movie.budget} onChange={e => setMovie({ ...movie, budget: e.target.value })}/>
            </label>
            <label>Golden Palm
                <input type="number" value={movie.goldenPalmCount} onChange={e => setMovie({ ...movie, goldenPalmCount: e.target.value })}/>
            </label>
            <label>USA Box Office
                <input type="number" value={movie.usaBoxOffice} onChange={e => setMovie({ ...movie, usaBoxOffice: e.target.value })}/>
            </label>
            <label>Total Box Office
                <input type="number" value={movie.totalBoxOffice} onChange={e => setMovie({ ...movie, totalBoxOffice: e.target.value })}/>
            </label>
            <label>Genre
                <select value={movie.genre} onChange={e => setMovie({ ...movie, genre: e.target.value })} required>
                    <option value="DRAMA">Drama</option>
                    <option value="ADVENTURE">Adventure</option>
                    <option value="FANTASY">Fantasy</option>
                </select>
            </label>
            <label>MPAA Rating
                <select value={movie.mpaaRating} onChange={e => setMovie({ ...movie, mpaaRating: e.target.value })}>
                    <option value="PG">PG</option>
                    <option value="R">R</option>
                    <option value="PG_13">PG_13</option>
                </select>
            </label>

            <button type="submit" style={{ marginTop: "10px" }}>Create All</button>
        </form>
    );
}
