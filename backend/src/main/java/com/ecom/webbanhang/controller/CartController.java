package com.ecom.webbanhang.controller;

import com.ecom.webbanhang.dto.cart.CartItemRequest;
import com.ecom.webbanhang.dto.cart.CartItemResponse;
import com.ecom.webbanhang.security.SecurityUtils;
import com.ecom.webbanhang.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CUSTOMER')")
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<List<CartItemResponse>> getCart() {
        return ResponseEntity.ok(cartService.getCart(SecurityUtils.getCurrentUserId()));
    }

    // UC-05 Add to Cart (mục 4.2.2.3 SRS) -> trả 200 OK khi thành công
    @PostMapping
    public ResponseEntity<CartItemResponse> addToCart(@Valid @RequestBody CartItemRequest request) {
        return ResponseEntity.ok(cartService.addToCart(SecurityUtils.getCurrentUserId(), request));
    }

    @PutMapping("/{itemId}")
    public ResponseEntity<CartItemResponse> updateQuantity(@PathVariable Long itemId, @RequestBody Map<String, Integer> body) {
        Integer quantity = body.get("quantity");
        return ResponseEntity.ok(cartService.updateQuantity(SecurityUtils.getCurrentUserId(), itemId, quantity));
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<Void> removeItem(@PathVariable Long itemId) {
        cartService.removeItem(SecurityUtils.getCurrentUserId(), itemId);
        return ResponseEntity.noContent().build();
    }
}
