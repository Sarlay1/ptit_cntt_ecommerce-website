package com.ecom.webbanhang.repository;

import com.ecom.webbanhang.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdOrderByCreatedDateDesc(Long userId);
    // Data isolation: chỉ trả về đơn hàng nếu đúng chủ sở hữu (chống IDOR)
    Optional<Order> findByIdAndUserId(Long id, Long userId);
}
