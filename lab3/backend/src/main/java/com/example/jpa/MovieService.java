package com.example.jpa;

import com.example.entities.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.criteria.Predicate;
import java.util.*;

@Service
public class MovieService {
    private final MovieRepo movieRepo;
    private final PersonRepo personRepo;
    private final CoordinatesRepo coordinatesRepo;
    private final LocationRepo locationRepo;

    public MovieService(MovieRepo movieRepo,
                        PersonRepo personRepo,
                        CoordinatesRepo coordinatesRepo,
                        LocationRepo locationRepo) {
        this.movieRepo = movieRepo;
        this.personRepo = personRepo;
        this.coordinatesRepo = coordinatesRepo;
        this.locationRepo = locationRepo;
    }

    public Optional<Movie> getMovie(Integer id) {
        return movieRepo.findById(id);
    }

    private Person resolveOrSavePerson(Person person) {
        if (person == null) return null;
        if (person.getId() != null) {
            return personRepo.findById(Math.toIntExact(person.getId())).orElse(person);
        } else {
            if (person.getLocation() != null) {
                Location loc = person.getLocation();
                if (loc.getId() != null) {
                    Location persisted = locationRepo.findById(Math.toIntExact(loc.getId())).orElse(loc);
                    person.setLocation(persisted);
                } else {
                    Location savedLoc = locationRepo.save(loc);
                    person.setLocation(savedLoc);
                }
            }
            return personRepo.save(person);
        }
    }

    private Coordinates resolveOrSaveCoordinates(Coordinates c) {
        if (c == null) return null;
        if (c.getId() != null) {
            return coordinatesRepo.findById(Math.toIntExact(c.getId())).orElse(c);
        } else {
            return coordinatesRepo.save(c);
        }
    }

    @Transactional
    public Movie save(Movie movie) {
        movie.setCoordinates(resolveOrSaveCoordinates(movie.getCoordinates()));
        movie.setDirector(resolveOrSavePerson(movie.getDirector()));
        movie.setOperator(resolveOrSavePerson(movie.getOperator()));
        movie.setScreenwriter(resolveOrSavePerson(movie.getScreenwriter()));
        return movieRepo.save(movie);
    }

    @Transactional
    public Optional<Movie> update(Integer id, Movie updated) {
        return movieRepo.findById(id).map(existing -> {
            updated.setId(existing.getId());
            updated.setCreationDate(existing.getCreationDate());
            updated.setCoordinates(resolveOrSaveCoordinates(updated.getCoordinates()));
            updated.setDirector(resolveOrSavePerson(updated.getDirector()));
            updated.setOperator(resolveOrSavePerson(updated.getOperator()));
            updated.setScreenwriter(resolveOrSavePerson(updated.getScreenwriter()));
            return movieRepo.save(updated);
        });
    }

    @Transactional
    public void delete(Integer id) {
        movieRepo.deleteById(id);
    }

    @Transactional
    public long deleteByUsaBoxOffice(Double usaBoxOffice) {
        List<Movie> list = movieRepo.findByUsaBoxOffice(usaBoxOffice);
        long cnt = list.size();
        movieRepo.deleteAll(list);
        return cnt;
    }

    public long sumGoldenPalmCount() {
        return movieRepo.findAll().stream().mapToLong(Movie::getGoldenPalmCount).sum();
    }

    public List<Movie> getMoviesWithGoldenPalmCountGreaterThan(long threshold) {
        return movieRepo.findByGoldenPalmCountGreaterThan(threshold);
    }

    @Transactional
    public long stripOscarsByGenre(MovieGenre genre) {
        List<Movie> all = movieRepo.findAll();
        Set<Long> directors = new HashSet<>();
        for (Movie m : all) if (m.getGenre() == genre && m.getDirector() != null) directors.add(m.getDirector().getId());

        long stripped = 0;
        for (Movie m : all) {
            if (m.getDirector() != null && directors.contains(m.getDirector().getId())) {
                stripped += m.getOscarsCount();
                m.setOscarsCount(0L);
                movieRepo.save(m);
            }
        }
        return stripped;
    }

    @Transactional
    public long awardOscarsByLength(int lengthThreshold, long extraOscars) {
        List<Movie> list = movieRepo.findByLengthGreaterThan(lengthThreshold);
        long updated = 0;
        for (Movie m : list) {
            m.setOscarsCount(m.getOscarsCount() + extraOscars);
            movieRepo.save(m);
            updated++;
        }
        return updated;
    }

    public List<Movie> getAll(){
        return movieRepo.findAll();
    }

    public List<Movie> history(){
        List<Movie> movies = movieRepo.findAll();
        List<Movie> history = new ArrayList<>(List.of());
        for (Movie movie : movies) {
            if (movie.isImported()){
                history.add(movie);
            }
        }
        int fromIndex = Math.max(history.size() - 10, 0);
        return history.subList(fromIndex, history.size());
    }


}


