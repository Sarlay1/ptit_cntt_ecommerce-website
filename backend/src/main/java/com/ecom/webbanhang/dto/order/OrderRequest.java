package com.ecom.webbanhang.dto.order;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
public class OrderRequest {

    @NotBlank(message = "Họ tên người nhận không được để trống")
    private String receiverName;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(regexp = "^[0-9]{9,15}$", message = "Số điện thoại không hợp lệ")
    private String phoneNumber;

    @NotBlank(message = "Địa chỉ giao hàng không được để trống")
    private String shippingAddress;
}
