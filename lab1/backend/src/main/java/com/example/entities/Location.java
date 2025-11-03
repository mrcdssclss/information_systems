package com.example.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Entity(name="location")
public class Location {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer Id;

    private Float x;

    @NotNull
    @Column(nullable = false)
    private Double y; //Поле не может быть null

    private Float z;

    @NotNull
    @Column(nullable = false)
    private String name; //Поле не может быть null
}
