package com.ecom.webbanhang.controller;

import com.ecom.webbanhang.dto.banner.HeroSlideDto;
import com.ecom.webbanhang.service.HeroSlideService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/banners")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminHeroSlideController {

    private final HeroSlideService heroSlideService;

    @GetMapping
    public ResponseEntity<List<HeroSlideDto>> getAllSlides() {
        return ResponseEntity.ok(heroSlideService.getAllSlides());
    }

    @PostMapping
    public ResponseEntity<HeroSlideDto> create(@Valid @RequestBody HeroSlideDto request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(heroSlideService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HeroSlideDto> update(
            @PathVariable Long id,
            @Valid @RequestBody HeroSlideDto request
    ) {
        return ResponseEntity.ok(heroSlideService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        heroSlideService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
