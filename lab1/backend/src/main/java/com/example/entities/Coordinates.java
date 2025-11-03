package com.example.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Entity(name="coordinates")
public class Coordinates {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer Id;

    @Max(643)
    private Double x; //Максимальное значение поля: 643
    @NotNull
    @Column(nullable = false)
    private Integer y; //Поле не может быть null
}
