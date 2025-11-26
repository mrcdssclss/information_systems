import { useState, useEffect } from "react";

export default function UpdateEntities({ movieId, onClose }) {
    const [movie, setMovie] = useState(null);
    const [coordinates, setCoordinates] = useState(null);
    const [director, setDirector] = useState(null);
    const [operator, setOperator] = useState(null);
    const [screenwriter, setScreenwriter] = useState(null);
    const [directorLocation, setDirectorLocation] = useState(null);
    const [operatorLocation, setOperatorLocation] = useState(null);
    const [screenwriterLocation, setScreenwriterLocation] = useState(null);

    useEffect(() => {
        if (!movieId) return;
        fetch(`http://localhost:8080/movies/${movieId}`)
            .then(res => res.json())
            .then(data => {
                setMovie(data);
                setCoordinates(data.coordinates);
                setDirector(data.director);
                setOperator(data.operator);
                setScreenwriter(data.screenwriter || { name: "", eyeColor: "RED", hairColor: "RED", weight: 1, nationality: "UNITED_KINGDOM", location: null });
                setDirectorLocation(data.director?.location || { x: "", y: "", z: "", name: "" });
                setOperatorLocation(data.operator?.location || { x: "", y: "", z: "", name: "" });
                setScreenwriterLocation(data.screenwriter?.location || { x: "", y: "", z: "", name: "" });
            })
            .catch(err => console.error(err));
    }, [movieId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const coordRes = await fetch(`http://localhost:8080/coordinates/${coordinates.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(coordinates)
            });
            const savedCoord = await coordRes.json();

            const saveLocation = async (loc) => {
                const res = await fetch(`http://localhost:8080/locations/${loc.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(loc)
                });
                return await res.json();
            };
            const savedDirectorLoc = await saveLocation(directorLocation);
            const savedOperatorLoc = await saveLocation(operatorLocation);
            let savedScreenwriterLoc = null;
            if (screenwriter?.id) {
                savedScreenwriterLoc = await saveLocation(screenwriterLocation);
            }

            const savePerson = async (person, loc) => {
                const res = await fetch(`http://localhost:8080/persons/${person.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ...person, location: loc })
                });
                return await res.json();
            };
            const savedDirector = await savePerson(director, savedDirectorLoc);
            const savedOperator = await savePerson(operator, savedOperatorLoc);
            let savedScreenwriter = screenwriter;
            if (screenwriter?.id) {
                savedScreenwriter = await savePerson(screenwriter, savedScreenwriterLoc);
            }

            const movieToUpdate = {
                ...movie,
                coordinates: savedCoord,
                director: savedDirector,
                operator: savedOperator,
                screenwriter: screenwriter?.id ? savedScreenwriter : null
            };
            const movieRes = await fetch(`http://localhost:8080/movies/${movie.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(movieToUpdate)
            });
            const savedMovie = await movieRes.json();
            alert("Фильм успешно обновлен! ID: " + savedMovie.id);
            onClose();
        } catch (err) {
            console.error(err);
            alert("Ошибка при обновлении!");
        }
    };

    if (!movie) return <div>Загрузка фильма...</div>;

    return (
        <form onSubmit={handleSubmit} style={{ maxHeight: "80vh", overflowY: "auto" }}>
            <h3>Редактировать фильм ID: {movie.id}</h3>

            <h4>Основные данные</h4>
            <label>Name
                <input value={movie.name} onChange={e => setMovie({ ...movie, name: e.target.value })} required/>
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
            <label>Length
                <input type="number" value={movie.length} onChange={e => setMovie({ ...movie, length: e.target.value })}/>
            </label>
            <label>Oscars Count
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

            <h4>Coordinates</h4>
            <label>X
                <input type="number" value={coordinates?.x || ""} onChange={e => setCoordinates({ ...coordinates, x: e.target.value })}/>
            </label>
            <label>Y
                <input type="number" value={coordinates?.y || ""} onChange={e => setCoordinates({ ...coordinates, y: e.target.value })}/>
            </label>

            <h4>Director</h4>
            <label>Name
                <input value={director?.name || ""} onChange={e => setDirector({ ...director, name: e.target.value })}/>
            </label>
            <h5>Location</h5>
            <label>X
                <input value={directorLocation?.x || ""} onChange={e => setDirectorLocation({ ...directorLocation, x: e.target.value })}/>
            </label>
            <label>Y
                <input value={directorLocation?.y || ""} onChange={e => setDirectorLocation({ ...directorLocation, y: e.target.value })}/>
            </label>
            <label>Z
                <input value={directorLocation?.z || ""} onChange={e => setDirectorLocation({ ...directorLocation, z: e.target.value })}/>
            </label>
            <label>Name
                <input value={directorLocation?.name || ""} onChange={e => setDirectorLocation({ ...directorLocation, name: e.target.value })}/>
            </label>

            <h4>Operator</h4>
            <label>Name
                <input value={operator?.name || ""} onChange={e => setOperator({ ...operator, name: e.target.value })}/>
            </label>
            <h5>Location</h5>
            <label>X
                <input value={operatorLocation?.x || ""} onChange={e => setOperatorLocation({ ...operatorLocation, x: e.target.value })}/>
            </label>
            <label>Y
                <input value={operatorLocation?.y || ""} onChange={e => setOperatorLocation({ ...operatorLocation, y: e.target.value })}/>
            </label>
            <label>Z
                <input value={operatorLocation?.z || ""} onChange={e => setOperatorLocation({ ...operatorLocation, z: e.target.value })}/>
            </label>
            <label>Name
                <input value={operatorLocation?.name || ""} onChange={e => setOperatorLocation({ ...operatorLocation, name: e.target.value })}/>
            </label>

            <h4>Screenwriter (опционально)</h4>
            <label>
                <input
                    type="checkbox"
                    checked={!screenwriter}
                    onChange={() => setScreenwriter(prev => prev ? null : { name: "", eyeColor: "RED", hairColor: "RED", weight: 1, nationality: "UNITED_KINGDOM", location: { x: "", y: "", z: "", name: "" } })}
                /> Нет сценариста
                <h4> </h4>
            </label>

            {screenwriter && (
                <>
                    <label>Name
                        <input value={screenwriter.name || ""} onChange={e => setScreenwriter({ ...screenwriter, name: e.target.value })}/>
                    </label>
                    <h5>Location</h5>
                    <label>X
                        <input value={screenwriter.location?.x || ""} onChange={e => setScreenwriter({
                            ...screenwriter,
                            location: { ...screenwriter.location, x: e.target.value }
                        })}/>
                    </label>
                    <label>Y
                        <input value={screenwriter.location?.y || ""} onChange={e => setScreenwriter({
                            ...screenwriter,
                            location: { ...screenwriter.location, y: e.target.value }
                        })}/>
                    </label>
                    <label>Z
                        <input value={screenwriter.location?.z || ""} onChange={e => setScreenwriter({
                            ...screenwriter,
                            location: { ...screenwriter.location, z: e.target.value }
                        })}/>
                    </label>
                    <label>Name
                        <input value={screenwriter.location?.name || ""} onChange={e => setScreenwriter({
                            ...screenwriter,
                            location: { ...screenwriter.location, name: e.target.value }
                        })}/>
                    </label>
                </>
            )}


            <button type="submit" style={{ marginTop: "10px" }}>Сохранить изменения</button>
        </form>
    );
}
