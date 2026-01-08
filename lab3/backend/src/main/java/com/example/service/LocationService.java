package com.example.service;

import com.example.entities.Location;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class LocationService {
    private final LocationRepo repo;

    public LocationService(LocationRepo repo) { this.repo = repo; }

    public List<Location> findAll() { return repo.findAll(); }
    public Optional<Location> findById(int id) { return repo.findById(id); }

    @Transactional
    public Location save(Location loc) { return repo.save(loc); }

    @Transactional
    public void delete(int id) {
        repo.deleteById(id);
    }

    @Transactional
    public Optional<Location> update(int id, Location updated) {
        return repo.findById(id)
                .map(existing -> {
                    updated.setId(existing.getId()); // сохраняем ID
                    return repo.save(updated);
                });
    }
}
