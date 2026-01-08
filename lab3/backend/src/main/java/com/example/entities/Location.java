package com.example.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@Data
@Entity(name="location")
@Cacheable
@org.hibernate.annotations.Cache(
        usage = CacheConcurrencyStrategy.READ_WRITE
)
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;

    @Min(0)
    private Float x;

    @NotNull
    @Column(nullable = false)
    @Min(0)
    private Double y; //Поле не может быть null

    @Min(0)
    private Float z;

    @NotNull
    @Column(nullable = false)
    private String name; //Поле не может быть null
}
