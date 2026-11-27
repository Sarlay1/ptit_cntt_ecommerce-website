package com.ecom.webbanhang.dto.order;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
public class UpdateOrderStatusRequest {

    @NotBlank(message = "status không được để trống")
    private String status; // PENDING, CONFIRMED, SHIPPING, DELIVERED, CANCELLED
}
