package com.ecom.webbanhang.service;

import com.ecom.webbanhang.dto.banner.HeroSlideDto;
import com.ecom.webbanhang.entity.HeroSlide;
import com.ecom.webbanhang.exception.BadRequestException;
import com.ecom.webbanhang.exception.ResourceNotFoundException;
import com.ecom.webbanhang.repository.HeroSlideRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HeroSlideService {

    private final HeroSlideRepository heroSlideRepository;

    public List<HeroSlideDto> getActiveSlides() {
        return heroSlideRepository.findAllByActiveTrueOrderByDisplayOrderAscIdAsc().stream()
                .map(this::toDto)
                .toList();
    }

    public List<HeroSlideDto> getAllSlides() {
        return heroSlideRepository.findAllByOrderByDisplayOrderAscIdAsc().stream()
                .map(this::toDto)
                .toList();
    }

    public HeroSlideDto create(HeroSlideDto request) {
        return toDto(heroSlideRepository.save(toEntity(request)));
    }

    public HeroSlideDto update(Long id, HeroSlideDto request) {
        HeroSlide slide = heroSlideRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy banner với id: " + id));
        apply(request, slide);
        return toDto(heroSlideRepository.save(slide));
    }

    public void delete(Long id) {
        if (!heroSlideRepository.existsById(id)) {
            throw new ResourceNotFoundException("Không tìm thấy banner với id: " + id);
        }
        heroSlideRepository.deleteById(id);
    }

    private HeroSlide toEntity(HeroSlideDto dto) {
        HeroSlide slide = new HeroSlide();
        apply(dto, slide);
        return slide;
    }

    private void apply(HeroSlideDto dto, HeroSlide slide) {
        slide.setTitle(dto.getTitle().trim());
        slide.setSubtitle(dto.getSubtitle().trim());
        slide.setImageUrl(dto.getImageUrl().trim());
        slide.setImageAlt(dto.getImageAlt().trim());
        slide.setCaption(dto.getCaption() == null ? "" : dto.getCaption().trim());
        slide.setCtaLabel(dto.getCtaLabel().trim());
        slide.setCtaLink(validateCtaLink(dto.getCtaLink()));
        slide.setDisplayOrder(dto.getDisplayOrder() == null ? 0 : dto.getDisplayOrder());
        slide.setActive(dto.isActive());
    }

    private String validateCtaLink(String value) {
        String link = value.trim();
        if (link.startsWith("/") && !link.startsWith("//")) {
            return link;
        }

        try {
            URI uri = URI.create(link);
            if ("https".equalsIgnoreCase(uri.getScheme()) && uri.getHost() != null) {
                return link;
            }
        } catch (IllegalArgumentException exception) {
            throw new BadRequestException("Liên kết banner phải là đường dẫn nội bộ hoặc URL HTTPS hợp lệ");
        }

        throw new BadRequestException("Liên kết banner phải là đường dẫn nội bộ hoặc URL HTTPS hợp lệ");
    }

    private HeroSlideDto toDto(HeroSlide slide) {
        return HeroSlideDto.builder()
                .id(slide.getId())
                .title(slide.getTitle())
                .subtitle(slide.getSubtitle())
                .imageUrl(slide.getImageUrl())
                .imageAlt(slide.getImageAlt())
                .caption(slide.getCaption())
                .ctaLabel(slide.getCtaLabel())
                .ctaLink(slide.getCtaLink())
                .displayOrder(slide.getDisplayOrder())
                .active(slide.isActive())
                .build();
    }
}
