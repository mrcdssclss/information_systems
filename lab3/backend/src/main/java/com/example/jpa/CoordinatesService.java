package com.example.jpa;

import com.example.entities.Coordinates;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CoordinatesService {
    private final CoordinatesRepo repo;

    public CoordinatesService(CoordinatesRepo repo) {
        this.repo = repo;
    }

    public List<Coordinates> findAll() {
        return repo.findAll();
    }
    public Optional<Coordinates> findById(int id) { return repo.findById(id); }

    @Transactional
    public Coordinates save(Coordinates c) { return repo.save(c); }

    @Transactional
    public void delete(int id) { repo.deleteById(Math.toIntExact(id)); }


    @Transactional
    public Optional<Coordinates> update(int id, Coordinates updated) {
        return repo.findById(id)
                .map(existing -> {
                    updated.setId(existing.getId());
                    return repo.save(updated);
                });
    }
}
