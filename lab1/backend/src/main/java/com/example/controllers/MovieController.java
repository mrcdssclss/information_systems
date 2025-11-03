package com.example.controllers;

import com.example.dto.MovieDTO;
import com.example.entities.Movie;
import com.example.jpa.MovieService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/main")
@CrossOrigin(origins = "http://localhost:3000")
public class MovieController {
    private final MovieService movieService;
    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    @GetMapping
    public ResponseEntity<List<MovieDTO>> getAllMovies(){
        List<MovieDTO> movies = movieService.getAll().stream()
                .map(MovieDTO::fromEntity)
                .toList();
        if (movies.isEmpty()) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(movies);
        }
    }


    @GetMapping("/{id}")
    public ResponseEntity<MovieDTO> getMovie(@PathVariable Integer id) {
        Optional<Movie> movieOpt = movieService.getMovie(id);
        return movieOpt
                .map(movie -> ResponseEntity.ok(MovieDTO.fromEntity(movie)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<MovieDTO> createMovie(@RequestBody MovieDTO dto) {
        if (dto == null) {
            return ResponseEntity.badRequest().build();
        }
        Movie movie = movieService.save(MovieDTO.toEntity(dto));
        return ResponseEntity.status(201).body(MovieDTO.fromEntity(movie));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MovieDTO> updateMovie(@PathVariable Integer id, @RequestBody MovieDTO dto) {
        if (dto == null) {
            return ResponseEntity.badRequest().build();
        }
        return movieService.update(id, MovieDTO.toEntity(dto))
                .map(updated -> ResponseEntity.ok(MovieDTO.fromEntity(updated)))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMovie(@PathVariable Integer id) {
        if (movieService.getMovie(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        movieService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
