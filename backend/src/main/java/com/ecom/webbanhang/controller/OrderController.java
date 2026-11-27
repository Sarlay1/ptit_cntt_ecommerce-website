package com.ecom.webbanhang.controller;

import com.ecom.webbanhang.dto.order.OrderRequest;
import com.ecom.webbanhang.dto.order.OrderResponse;
import com.ecom.webbanhang.security.SecurityUtils;
import com.ecom.webbanhang.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // UC-01 Checkout (mục 3.1 SRS)
    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<OrderResponse> createOrder(@Valid @RequestBody OrderRequest request) {
        OrderResponse response = orderService.checkout(SecurityUtils.getCurrentUserId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<OrderResponse>> getMyOrders() {
        return ResponseEntity.ok(orderService.getMyOrders(SecurityUtils.getCurrentUserId()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<OrderResponse> getMyOrder(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getMyOrderById(SecurityUtils.getCurrentUserId(), id));
    }

    // UC-03 Cancel Order (mục 4.2.2.2 SRS)
    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<OrderResponse> cancelOrder(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.cancelOrder(SecurityUtils.getCurrentUserId(), id));
    }
}
