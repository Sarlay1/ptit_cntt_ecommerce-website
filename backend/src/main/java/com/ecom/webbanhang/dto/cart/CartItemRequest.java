package com.ecom.webbanhang.dto.cart;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
public class CartItemRequest {

    @NotNull(message = "productId không được để trống")
    private Long productId;

    @NotNull(message = "quantity không được để trống")
    @Min(value = 1, message = "Số lượng mua phải > 0")
    private Integer quantity;
}
