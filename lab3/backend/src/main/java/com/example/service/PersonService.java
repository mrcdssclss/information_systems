package com.example.service;

import com.example.entities.Person;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class PersonService {
    private final PersonRepo personRepo;

    public PersonService(PersonRepo personRepo) {
        this.personRepo = personRepo;
    }
    public List<Person> findAll() { return personRepo.findAll(); }

    public Optional<Person> findById(Long id) { return personRepo.findById(Math.toIntExact(id)); }

    @Transactional
    public Person save(Person p) {
        System.out.println(p);
        return personRepo.save(p);
    }

    @Transactional
    public Optional<Person> update(Long id, Person updated) {
        return personRepo.findById(Math.toIntExact(id))
                .map(existing -> {
                    updated.setId(existing.getId());
                    return personRepo.save(updated);
                });
    }

    @Transactional
    public void delete(Long id) {
        personRepo.deleteById(Math.toIntExact(id));
    }

}
