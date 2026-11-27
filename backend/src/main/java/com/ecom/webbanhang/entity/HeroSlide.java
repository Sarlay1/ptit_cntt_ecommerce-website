package com.ecom.webbanhang.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "hero_slides")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HeroSlide {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 180)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String subtitle;

    @Column(name = "image_url", nullable = false, length = 500)
    private String imageUrl;

    @Column(name = "image_alt", nullable = false, length = 255)
    private String imageAlt;

    @Column(length = 255)
    private String caption;

    @Column(name = "cta_label", nullable = false, length = 80)
    private String ctaLabel;

    @Column(name = "cta_link", nullable = false, length = 500)
    private String ctaLink;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder;

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;
}
