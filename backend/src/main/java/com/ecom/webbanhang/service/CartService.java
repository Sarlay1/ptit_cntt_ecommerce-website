package com.ecom.webbanhang.service;

import com.ecom.webbanhang.dto.cart.CartItemRequest;
import com.ecom.webbanhang.dto.cart.CartItemResponse;
import com.ecom.webbanhang.entity.CartItem;
import com.ecom.webbanhang.entity.Product;
import com.ecom.webbanhang.entity.User;
import com.ecom.webbanhang.exception.ForbiddenException;
import com.ecom.webbanhang.exception.InsufficientStockException;
import com.ecom.webbanhang.exception.ResourceNotFoundException;
import com.ecom.webbanhang.repository.CartItemRepository;
import com.ecom.webbanhang.repository.ProductRepository;
import com.ecom.webbanhang.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public List<CartItemResponse> getCart(Long userId) {
        return cartItemRepository.findByUserId(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public CartItemResponse addToCart(Long userId, CartItemRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm với id: " + request.getProductId()));

        CartItem item = cartItemRepository.findByUserIdAndProductId(userId, product.getId())
                .orElse(null);

        int newQuantity = (item != null ? item.getQuantity() : 0) + request.getQuantity();

        if (newQuantity > product.getQuantity()) {
            throw new InsufficientStockException("Sản phẩm \"" + product.getName() + "\" chỉ còn " + product.getQuantity() + " trong kho!");
        }

        if (item == null) {
            User userRef = userRepository.getReferenceById(userId);
            item = CartItem.builder()
                    .user(userRef)
                    .product(product)
                    .quantity(request.getQuantity())
                    .build();
        } else {
            item.setQuantity(newQuantity);
        }

        item = cartItemRepository.save(item);
        return toResponse(item);
    }

    @Transactional
    public CartItemResponse updateQuantity(Long userId, Long cartItemId, Integer quantity) {
        CartItem item = cartItemRepository.findByIdAndUserId(cartItemId, userId)
                .orElseThrow(() -> new ForbiddenException("Bạn không có quyền thao tác trên giỏ hàng này"));

        if (quantity > item.getProduct().getQuantity()) {
            throw new InsufficientStockException("Sản phẩm \"" + item.getProduct().getName() + "\" chỉ còn " + item.getProduct().getQuantity() + " trong kho!");
        }

        item.setQuantity(quantity);
        item = cartItemRepository.save(item);
        return toResponse(item);
    }

    @Transactional
    public void removeItem(Long userId, Long cartItemId) {
        // Data isolation: chỉ xóa nếu item thuộc về đúng user (chống IDOR - mục 2.5.2 SRS)
        CartItem item = cartItemRepository.findByIdAndUserId(cartItemId, userId)
                .orElseThrow(() -> new ForbiddenException("Bạn không có quyền thao tác trên giỏ hàng này"));
        cartItemRepository.delete(item);
    }

    @Transactional
    public void clearCart(Long userId) {
        cartItemRepository.deleteByUserId(userId);
    }

    private CartItemResponse toResponse(CartItem item) {
        BigDecimal subTotal = item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
        return CartItemResponse.builder()
                .id(item.getId())
                .productId(item.getProduct().getId())
                .productName(item.getProduct().getName())
                .imageUrl(item.getProduct().getImageUrl())
                .price(item.getProduct().getPrice())
                .quantity(item.getQuantity())
                .subTotal(subTotal)
                .availableStock(item.getProduct().getQuantity())
                .build();
    }
}
