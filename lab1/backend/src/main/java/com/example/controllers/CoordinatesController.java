package com.example.controllers;


import com.example.dto.CoordinatesDTO;
import com.example.entities.Coordinates;
import com.example.jpa.CoordinatesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/coordinates")
@CrossOrigin(origins = "http://localhost:3000")
public class CoordinatesController {
    private final CoordinatesService service;
    public CoordinatesController(CoordinatesService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<CoordinatesDTO>> getAll() {
        List<CoordinatesDTO> coords = service.findAll().stream()
                .map(CoordinatesDTO::fromEntity)
                .toList();
        if (coords.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(coords);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CoordinatesDTO> get(@PathVariable Integer id) {
        Optional<Coordinates> coordOpt = service.findById(id);
        return coordOpt
                .map(c -> ResponseEntity.ok(CoordinatesDTO.fromEntity(c)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<CoordinatesDTO> create(@RequestBody CoordinatesDTO dto) {
        if (dto == null) {
            return ResponseEntity.badRequest().build();
        }
        Coordinates saved = service.save(CoordinatesDTO.toEntity(dto));
        return ResponseEntity.status(201).body(CoordinatesDTO.fromEntity(saved));
    }


    @PutMapping("/{id}")
    public ResponseEntity<CoordinatesDTO> update(@PathVariable Integer id, @RequestBody CoordinatesDTO dto) {
        if (dto == null) {
            return ResponseEntity.badRequest().build();
        }
        return service.update(id, CoordinatesDTO.toEntity(dto))
                .map(c -> ResponseEntity.ok(CoordinatesDTO.fromEntity(c)))
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
