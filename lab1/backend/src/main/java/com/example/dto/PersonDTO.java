package com.example.dto;

import com.example.entities.Color;
import com.example.entities.Country;
import com.example.entities.Location;
import com.example.entities.Person;
import lombok.Data;

@Data
public class PersonDTO {
    private Long id;
    private String name;
    private Color eyeColor;
    private Color hairColor;
    private LocationDTO location;
    private long weight;
    private Country nationality;

    public static PersonDTO fromEntity(Person person) {
        if (person == null) return null;
        PersonDTO personDTO = new PersonDTO();
        personDTO.setId(person.getId());
        personDTO.setName(person.getName());
        personDTO.setEyeColor(person.getEyeColor());
        personDTO.setHairColor(person.getHairColor());
        personDTO.setLocation(LocationDTO.fromEntity(person.getLocation()));
        personDTO.setWeight(person.getWeight());
        personDTO.setNationality(person.getNationality());
        return personDTO;
    }

    public static Person toEntity(PersonDTO personDTO) {
        Person person = new Person();
        person.setName(personDTO.name);
        person.setEyeColor(personDTO.eyeColor);
        person.setHairColor(personDTO.hairColor);
        person.setWeight(personDTO.weight);
        person.setNationality(personDTO.nationality);
        if (personDTO.getLocation() != null) {
            Location loc = new Location();
            loc.setId(personDTO.getLocation().getId());
            person.setLocation(loc);
        }
        return person;
    }
}
