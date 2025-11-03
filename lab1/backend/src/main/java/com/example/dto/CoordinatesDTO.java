package com.example.dto;

import com.example.entities.Coordinates;
import lombok.Data;

@Data
public class CoordinatesDTO {
    private double x;
    private Integer y;

    public static CoordinatesDTO fromEntity(Coordinates coordinates) {
        CoordinatesDTO coordinatesDTO = new CoordinatesDTO();
        coordinatesDTO.setX(coordinates.getX());
        coordinatesDTO.setY(coordinates.getY());
        return coordinatesDTO;
    }

    public static Coordinates toEntity(CoordinatesDTO coordinatesDTO) {
        Coordinates coordinates = new Coordinates();
        coordinates.setX(coordinatesDTO.getX());
        coordinates.setY(coordinatesDTO.getY());
        return coordinates;
    }

}
