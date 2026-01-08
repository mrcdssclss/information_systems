package com.example.service;

import com.example.entities.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieRepo extends JpaRepository<Movie, Integer>, JpaSpecificationExecutor<Movie> {
    List<Movie> findByUsaBoxOffice(Double usaBoxOffice);
    List<Movie> findByGoldenPalmCountGreaterThan(Long goldenPalmCount);
    List<Movie> findByLengthGreaterThan(Integer length);

}
