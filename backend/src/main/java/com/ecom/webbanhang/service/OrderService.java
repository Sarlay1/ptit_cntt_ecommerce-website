package com.ecom.webbanhang.service;

import com.ecom.webbanhang.dto.order.*;
import com.ecom.webbanhang.entity.*;
import com.ecom.webbanhang.exception.BadRequestException;
import com.ecom.webbanhang.exception.ForbiddenException;
import com.ecom.webbanhang.exception.InsufficientStockException;
import com.ecom.webbanhang.exception.ResourceNotFoundException;
import com.ecom.webbanhang.repository.CartItemRepository;
import com.ecom.webbanhang.repository.OrderRepository;
import com.ecom.webbanhang.repository.ProductRepository;
import com.ecom.webbanhang.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    /**
     * Luồng Checkout (mục 3.1.2 SRS):
     * - Check Auth (đã thực hiện ở Controller/SecurityContext)
     * - Check Stock từng sản phẩm trong DB
     * - Nếu thiếu -> Throw Exception (InsufficientStockException -> 400)
     * - Nếu đủ -> Save Order & OrderDetail, trừ kho, clear Cart
     */
    @Transactional
    public OrderResponse checkout(Long userId, OrderRequest request) {
        List<CartItem> cartItems = cartItemRepository.findByUserId(userId);

        if (cartItems.isEmpty()) {
            throw new BadRequestException("Giỏ hàng đang trống, không thể đặt hàng");
        }

        // Check stock từng sản phẩm
        for (CartItem item : cartItems) {
            Product product = item.getProduct();
            if (item.getQuantity() > product.getQuantity()) {
                throw new InsufficientStockException("Sản phẩm \"" + product.getName() + "\" đã hết hàng trong kho!");
            }
        }

        User user = userRepository.getReferenceById(userId);

        Order order = Order.builder()
                .user(user)
                .receiverName(request.getReceiverName())
                .phoneNumber(request.getPhoneNumber())
                .shippingAddress(request.getShippingAddress())
                .status(OrderStatus.PENDING)
                .totalPrice(BigDecimal.ZERO)
                .build();

        BigDecimal total = BigDecimal.ZERO;

        for (CartItem item : cartItems) {
            Product product = item.getProduct();

            OrderDetail detail = OrderDetail.builder()
                    .product(product)
                    .price(product.getPrice()) // lưu giá tại thời điểm mua
                    .quantity(item.getQuantity())
                    .build();
            order.addDetail(detail);

            total = total.add(product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));

            // trừ kho
            product.setQuantity(product.getQuantity() - item.getQuantity());
            productRepository.save(product);
        }

        order.setTotalPrice(total);
        order = orderRepository.save(order);

        // clear cart
        cartItemRepository.deleteByUserId(userId);

        return toResponse(order);
    }

    public List<OrderResponse> getMyOrders(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedDateDesc(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    public OrderResponse getMyOrderById(Long userId, Long orderId) {
        // Data isolation (mục 2.5.2 SRS): chỉ trả về nếu đơn hàng thuộc về user hiện tại
        Order order = orderRepository.findByIdAndUserId(orderId, userId)
                .orElseThrow(() -> new ForbiddenException("Bạn không có quyền xem đơn hàng này"));
        return toResponse(order);
    }

    @Transactional
    public OrderResponse cancelOrder(Long userId, Long orderId) {
        Order order = orderRepository.findByIdAndUserId(orderId, userId)
                .orElseThrow(() -> new ForbiddenException("Bạn không có quyền hủy đơn hàng này"));

        if (order.getStatus() == OrderStatus.DELIVERED || order.getStatus() == OrderStatus.CANCELLED) {
            throw new BadRequestException("Không thể hủy đơn hàng ở trạng thái " + order.getStatus());
        }

        // hoàn lại kho
        for (OrderDetail detail : order.getOrderDetails()) {
            Product product = detail.getProduct();
            product.setQuantity(product.getQuantity() + detail.getQuantity());
            productRepository.save(product);
        }

        order.setStatus(OrderStatus.CANCELLED);
        order = orderRepository.save(order);
        return toResponse(order);
    }

    // ===== Admin =====

    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public OrderResponse updateStatus(Long orderId, String statusStr) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng với id: " + orderId));

        OrderStatus newStatus;
        try {
            newStatus = OrderStatus.valueOf(statusStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Trạng thái đơn hàng không hợp lệ: " + statusStr);
        }

        order.setStatus(newStatus);
        order = orderRepository.save(order);
        return toResponse(order);
    }

    private OrderResponse toResponse(Order order) {
        List<OrderDetailResponse> details = order.getOrderDetails().stream()
                .map(d -> OrderDetailResponse.builder()
                        .productId(d.getProduct().getId())
                        .productName(d.getProduct().getName())
                        .price(d.getPrice())
                        .quantity(d.getQuantity())
                        .subTotal(d.getPrice().multiply(BigDecimal.valueOf(d.getQuantity())))
                        .build())
                .toList();

        return OrderResponse.builder()
                .id(order.getId())
                .totalPrice(order.getTotalPrice())
                .status(order.getStatus().name())
                .receiverName(order.getReceiverName())
                .phoneNumber(order.getPhoneNumber())
                .shippingAddress(order.getShippingAddress())
                .createdDate(order.getCreatedDate())
                .orderDetails(details)
                .build();
    }
}
