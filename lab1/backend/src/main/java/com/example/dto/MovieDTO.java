package com.example.dto;

import com.example.entities.*;
import lombok.Data;

import java.time.ZonedDateTime;

@Data
public class MovieDTO {
    private Integer id;
    private String name;
    private CoordinatesDTO coordinates;
    private ZonedDateTime creationDate;
    private long oscarsCount;
    private float budget;
    private Long totalBoxOffice;
    private MpaaRating mpaaRating;
    private PersonDTO director;
    private PersonDTO screenwriter;
    private PersonDTO operator;
    private Integer length;
    private long goldenPalmCount;
    private Double usaBoxOffice;
    private MovieGenre genre;

    public static MovieDTO fromEntity(Movie movie) {
        if (movie == null) return null;
        MovieDTO dto = new MovieDTO();
        dto.setId(movie.getId());
        dto.setName(movie.getName());
        dto.setCoordinates(CoordinatesDTO.fromEntity(movie.getCoordinates()));
        dto.setCreationDate(movie.getCreationDate());
        dto.setOscarsCount(movie.getOscarsCount());
        dto.setBudget(movie.getBudget());
        dto.setTotalBoxOffice(Long.valueOf(movie.getTotalBoxOffice()));
        dto.setMpaaRating(movie.getMpaaRating());
        dto.setDirector(PersonDTO.fromEntity(movie.getDirector()));
        dto.setScreenwriter(PersonDTO.fromEntity(movie.getScreenwriter()));
        dto.setOperator(PersonDTO.fromEntity(movie.getOperator()));
        dto.setLength(movie.getLength());
        dto.setGoldenPalmCount(movie.getGoldenPalmCount());
        dto.setUsaBoxOffice(movie.getUsaBoxOffice());
        dto.setGenre(movie.getGenre());
        return dto;
    }

    public static Movie toEntity(MovieDTO dto) {
        if (dto == null) return null;
        Movie movie = new Movie();
        movie.setId(dto.getId());
        movie.setName(dto.getName());
        movie.setCoordinates(CoordinatesDTO.toEntity(dto.getCoordinates()));
        movie.setCreationDate(dto.getCreationDate() != null ? dto.getCreationDate() : ZonedDateTime.now());
        movie.setOscarsCount(dto.getOscarsCount());
        movie.setBudget((int) dto.getBudget());
        movie.setTotalBoxOffice(Math.toIntExact(dto.getTotalBoxOffice()));
        movie.setMpaaRating(dto.getMpaaRating());
        movie.setDirector(PersonDTO.toEntity(dto.getDirector()));
        movie.setScreenwriter(PersonDTO.toEntity(dto.getScreenwriter()));
        movie.setOperator(PersonDTO.toEntity(dto.getOperator()));
        movie.setLength(dto.getLength());
        movie.setGoldenPalmCount((int) dto.getGoldenPalmCount());
        movie.setUsaBoxOffice(dto.getUsaBoxOffice());
        movie.setGenre(dto.getGenre());
        return movie;
    }
}
