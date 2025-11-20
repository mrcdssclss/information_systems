package com.example.dto;


import com.example.entities.Location;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
public class LocationDTO {
    private Long id;
    private float x;
    private Double y;
    private float z;
    private String name;


    public static LocationDTO fromEntity(Location location) {
        LocationDTO locationDTO = new LocationDTO();
        locationDTO.setId(location.getId());
        locationDTO.setX(location.getX());
        locationDTO.setY(location.getY());
        locationDTO.setZ(location.getZ());
        locationDTO.setName(location.getName());
        return locationDTO;
    }

    public static Location toEntity(LocationDTO locationDTO) {
        Location location = new Location();
        location.setName(locationDTO.getName());
        location.setX(locationDTO.getX());
        location.setY(locationDTO.getY());
        location.setZ(locationDTO.getZ());
        return location;
    }

}
