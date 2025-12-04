package com.example.controllers;

import com.example.dto.MovieDTO;
import com.example.entities.Movie;
import com.example.entities.MovieGenre;
import com.example.jpa.MovieService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/movies")
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
        return ResponseEntity.ok(movies);
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

    @DeleteMapping("/deleteByUsaBoxOffice/{value}")
    public ResponseEntity<Long> deleteByUsaBoxOffice(@PathVariable Double value) {
        long count = movieService.deleteByUsaBoxOffice(value);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/sumGoldenPalm")
    public ResponseEntity<Long> sumGoldenPalm() {
        return ResponseEntity.ok(movieService.sumGoldenPalmCount());
    }

    @GetMapping("/greaterGoldenPalm/{value}")
    public ResponseEntity<List<MovieDTO>> getGreaterGoldenPalm(@PathVariable Long value) {
        List<MovieDTO> result = movieService
                .getMoviesWithGoldenPalmCountGreaterThan(value)
                .stream()
                .map(MovieDTO::fromEntity)
                .toList();

        return ResponseEntity.ok(result);
    }

    @PostMapping("/special/stripOscars/{genre}")
    public ResponseEntity<Long> stripOscarsByGenre(@PathVariable String genre) {
        try {
            long res = movieService.stripOscarsByGenre(MovieGenre.valueOf(genre.toUpperCase()));
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/awardOscars")
    public ResponseEntity<Long> awardOscars(
            @RequestParam int length,
            @RequestParam long extra
    ) {
        long res = movieService.awardOscarsByLength(length, extra);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/import")
    public ResponseEntity<List<MovieDTO>> getHistory(){
        List<MovieDTO> result = movieService
                .history()
                .stream()
                .map(MovieDTO::fromEntity)
                .toList();
        return ResponseEntity.ok(result);
    }
}
