package com.example.controllers;

import com.example.dto.LocationDTO;
import com.example.entities.Location;
import com.example.jpa.LocationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/locations")
@CrossOrigin(origins = "http://localhost:3000")
public class LocationController {
    private final LocationService service;


    public LocationController(LocationService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<LocationDTO>> getAll() {
        List<LocationDTO> locations = service.findAll().stream()
                .map(LocationDTO::fromEntity)
                .toList();
        if (locations.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(locations);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LocationDTO> get(@PathVariable Integer id) {
        Optional<Location> locOpt = service.findById(id);
        return locOpt
                .map(l -> ResponseEntity.ok(LocationDTO.fromEntity(l)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<LocationDTO> create(@RequestBody LocationDTO dto) {
        if (dto == null) {
            return ResponseEntity.badRequest().build();
        }
        Location saved = service.save(LocationDTO.toEntity(dto));
        return ResponseEntity.status(201).body(LocationDTO.fromEntity(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LocationDTO> update(@PathVariable Integer id, @RequestBody LocationDTO dto) {
        if (dto == null) {
            return ResponseEntity.badRequest().build();
        }
        return service.update(id, LocationDTO.toEntity(dto))
                .map(l -> ResponseEntity.ok(LocationDTO.fromEntity(l)))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (service.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

}
