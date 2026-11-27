package com.ecom.webbanhang.dto.order;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private Long id;
    private BigDecimal totalPrice;
    private String status;
    private String receiverName;
    private String phoneNumber;
    private String shippingAddress;
    private LocalDateTime createdDate;
    private List<OrderDetailResponse> orderDetails;
}
