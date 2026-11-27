package com.ecom.webbanhang.dto.banner;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HeroSlideDto {

    private Long id;

    @NotBlank(message = "Tiêu đề banner không được để trống")
    @Size(max = 180)
    private String title;

    @NotBlank(message = "Mô tả banner không được để trống")
    private String subtitle;

    @NotBlank(message = "Ảnh banner không được để trống")
    @Size(max = 500)
    private String imageUrl;

    @NotBlank(message = "Văn bản thay thế ảnh không được để trống")
    @Size(max = 255)
    private String imageAlt;

    @Size(max = 255)
    private String caption;

    @NotBlank(message = "Nhãn nút không được để trống")
    @Size(max = 80)
    private String ctaLabel;

    @NotBlank(message = "Liên kết nút không được để trống")
    @Size(max = 500)
    private String ctaLink;

    @Min(value = 0, message = "Thứ tự hiển thị phải từ 0 trở lên")
    private Integer displayOrder;

    private boolean active;
}
