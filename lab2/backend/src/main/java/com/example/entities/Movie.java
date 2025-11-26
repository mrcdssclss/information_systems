package com.example.entities;


import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import jakarta.validation.constraints.NotBlank;

import java.time.ZonedDateTime;


@Entity
@Table(name="movies")
@Data
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; //Значение поля должно быть больше 0, Значение этого поля должно быть уникальным, Значение этого поля должно генерироваться автоматически

    @Column(nullable = false)
    @NotBlank
    @NotNull
    private String name; //Поле не может быть null, Строка не может быть пустой

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "coordinates_id")
    @NotNull
    private Coordinates coordinates; //Поле не может быть null

    @Column(nullable = false)
    private java.time.ZonedDateTime creationDate = ZonedDateTime.now(); //Поле не может быть null, Значение этого поля должно генерироваться автоматически

    @Min(1)
    private Long oscarsCount; //Значение поля должно быть больше 0

    @Min(1)
    private Integer budget; //Значение поля должно быть больше 0

    @Min(1)
    private int totalBoxOffice; //Поле может быть null, Значение поля должно быть больше 0

    @Enumerated(EnumType.STRING)
    private MpaaRating mpaaRating; //Поле может быть null

    @ManyToOne
    @JoinColumn(name="director_id", nullable=false)
    @NotNull
    private Person director; //Поле не может быть null

    @ManyToOne
    @JoinColumn(name="screenwriter_id")
    private Person screenwriter;

    @ManyToOne
    @JoinColumn(name="operator_id", nullable=false)
    @NotNull
    private Person operator; //Поле не может быть null

    @Min(1)
    private Integer length; //Значение поля должно быть больше 0
    @Min(1)
    private Integer goldenPalmCount; //Значение поля должно быть больше 0
    @Min(1)
    private Double usaBoxOffice; //Значение поля должно быть больше 0
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MovieGenre genre; //Поле не может быть null

    public Movie() {
    }
}

