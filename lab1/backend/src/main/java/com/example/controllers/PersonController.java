package com.example.controllers;

import com.example.dto.PersonDTO;
import com.example.entities.Person;
import com.example.jpa.PersonService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/persons")
@CrossOrigin(origins = "http://localhost:3000")
public class PersonController {
    private final PersonService personService;

    public PersonController(PersonService personService) {
        this.personService = personService;
    }

    @GetMapping
    public ResponseEntity<List<PersonDTO>> getAllPersons() {
        List<PersonDTO> persons = personService.findAll().stream()
                .map(PersonDTO::fromEntity)
                .toList();
        if (persons.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(persons);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PersonDTO> getPerson(@PathVariable Integer id) {
        Optional<Person> personOpt = personService.findById(Long.valueOf(id));
        return personOpt
                .map(p -> ResponseEntity.ok(PersonDTO.fromEntity(p)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<PersonDTO> createPerson(@RequestBody PersonDTO dto) {
        if (dto == null) {
            return ResponseEntity.badRequest().build();
        }
        Person saved = personService.save(PersonDTO.toEntity(dto));
        return ResponseEntity.status(201).body(PersonDTO.fromEntity(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PersonDTO> updatePerson(@PathVariable Integer id, @RequestBody PersonDTO dto) {
        if (dto == null) {
            return ResponseEntity.badRequest().build();
        }
        return personService.update(Long.valueOf(id), PersonDTO.toEntity(dto))
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
