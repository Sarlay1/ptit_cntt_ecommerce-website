package com.ecom.webbanhang.repository;

import com.ecom.webbanhang.entity.HeroSlide;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HeroSlideRepository extends JpaRepository<HeroSlide, Long> {
    List<HeroSlide> findAllByActiveTrueOrderByDisplayOrderAscIdAsc();
    List<HeroSlide> findAllByOrderByDisplayOrderAscIdAsc();
}
