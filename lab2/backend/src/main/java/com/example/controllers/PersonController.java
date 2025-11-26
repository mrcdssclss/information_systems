package com.example.controllers;

import com.example.dto.PersonDTO;
import com.example.entities.Location;
import com.example.entities.Person;
import com.example.jpa.PersonService;
import org.springframework.http.ResponseEntity;
import com.example.jpa.LocationService;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/persons")
@CrossOrigin(origins = "http://localhost:3000")
public class PersonController {
    private final LocationService locationService;
    private final PersonService personService;

    public PersonController(PersonService personService, LocationService locationService) {
        this.personService = personService;
        this.locationService = locationService;
    }

    @GetMapping
    public ResponseEntity<List<PersonDTO>> getAllPersons() {
        List<PersonDTO> persons = personService.findAll().stream()
                .map(PersonDTO::fromEntity)
                .toList();
        return ResponseEntity.ok(persons);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PersonDTO> getPerson(@PathVariable Integer id) {
        Optional<Person> personOpt = personService.findById(Long.valueOf(id));
        return personOpt
                .map(p -> ResponseEntity.ok(PersonDTO.fromEntity(p)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping()
    public ResponseEntity<PersonDTO> createPerson(@RequestBody PersonDTO dto) {
        if (dto == null) return ResponseEntity.badRequest().build();

        Person person = PersonDTO.toEntity(dto);
        if (person.getLocation() != null && person.getLocation().getId() != null) {
            Location existingLoc = locationService.findById(Math.toIntExact(person.getLocation().getId()))
                    .orElseThrow(() -> new IllegalArgumentException("Location not found"));
            person.setLocation(existingLoc);
        }

        Person saved = personService.save(person);
        return ResponseEntity.status(201).body(PersonDTO.fromEntity(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PersonDTO> updatePerson(@PathVariable Integer id, @RequestBody PersonDTO dto) {
        if (dto == null) return ResponseEntity.badRequest().build();
        Person updatedEntity = PersonDTO.toEntity(dto);
        if (updatedEntity.getLocation() != null && updatedEntity.getLocation().getId() != null) {
            Location existingLoc = locationService.findById(Math.toIntExact(updatedEntity.getLocation().getId()))
                    .orElseThrow(() -> new IllegalArgumentException("Location not found"));
            updatedEntity.setLocation(existingLoc);
        }
        return personService.update(Long.valueOf(id), updatedEntity)
                .map(p -> ResponseEntity.ok(PersonDTO.fromEntity(p)))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePerson(@PathVariable Integer id) {
        if (personService.findById(Long.valueOf(id)).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        personService.delete(Long.valueOf(id));
        return ResponseEntity.noContent().build();
    }
}
