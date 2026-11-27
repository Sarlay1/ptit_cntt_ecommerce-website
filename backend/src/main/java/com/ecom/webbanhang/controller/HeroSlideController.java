package com.ecom.webbanhang.controller;

import com.ecom.webbanhang.dto.banner.HeroSlideDto;
import com.ecom.webbanhang.service.HeroSlideService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/banners")
@RequiredArgsConstructor
public class HeroSlideController {

    private final HeroSlideService heroSlideService;

    @GetMapping
    public ResponseEntity<List<HeroSlideDto>> getActiveSlides() {
        return ResponseEntity.ok(heroSlideService.getActiveSlides());
    }
}
