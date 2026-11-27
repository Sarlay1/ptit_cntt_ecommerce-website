package com.ecom.webbanhang.service;

import com.ecom.webbanhang.dto.banner.HeroSlideDto;
import com.ecom.webbanhang.entity.HeroSlide;
import com.ecom.webbanhang.exception.BadRequestException;
import com.ecom.webbanhang.repository.HeroSlideRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class HeroSlideServiceTest {

    @Mock
    private HeroSlideRepository heroSlideRepository;

    @InjectMocks
    private HeroSlideService heroSlideService;

    @Test
    void acceptsInternalAndHttpsCtaLinks() {
        when(heroSlideRepository.save(any(HeroSlide.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        assertEquals("/#catalog", heroSlideService.create(request("/#catalog")).getCtaLink());
        assertEquals("https://example.com/collection",
                heroSlideService.create(request("https://example.com/collection")).getCtaLink());
    }

    @Test
    void rejectsUnsafeCtaLinksBeforeSaving() {
        assertThrows(BadRequestException.class,
                () -> heroSlideService.create(request("javascript:alert(1)")));
        assertThrows(BadRequestException.class,
                () -> heroSlideService.create(request("//example.com")));
        verify(heroSlideRepository, never()).save(any(HeroSlide.class));
    }

    private HeroSlideDto request(String ctaLink) {
        return HeroSlideDto.builder()
                .title("Title")
                .subtitle("Subtitle")
                .imageUrl("https://example.com/image.jpg")
                .imageAlt("Image")
                .ctaLabel("Shop")
                .ctaLink(ctaLink)
                .displayOrder(0)
                .active(true)
                .build();
    }
}
