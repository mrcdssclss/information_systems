package com.example.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Entity(name="person")
public class Person {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @NotNull
    @Column(nullable = false)
    private String name; //Поле не может быть null, Строка не может быть пустой

    @Enumerated(EnumType.STRING)
    private Color eyeColor; //Поле может быть null
    @Enumerated(EnumType.STRING)
    private Color hairColor; //Поле может быть null


    @ManyToOne(cascade = CascadeType.ALL)
    private Location location; //Поле может быть null

    @Min(1)
    private long weight;

    @NotNull
    @Enumerated(EnumType.STRING)
    private Country nationality; //Поле может быть null
}
