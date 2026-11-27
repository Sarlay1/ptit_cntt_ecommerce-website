package com.ecom.webbanhang.config;

import com.ecom.webbanhang.entity.Category;
import com.ecom.webbanhang.entity.Product;
import com.ecom.webbanhang.repository.CartItemRepository;
import com.ecom.webbanhang.repository.CategoryRepository;
import com.ecom.webbanhang.repository.OrderRepository;
import com.ecom.webbanhang.repository.ProductRepository;
import com.ecom.webbanhang.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DataSeederTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private CategoryRepository categoryRepository;
    @Mock
    private ProductRepository productRepository;
    @Mock
    private CartItemRepository cartItemRepository;
    @Mock
    private OrderRepository orderRepository;
    @Mock
    private PasswordEncoder passwordEncoder;

    @Test
    void seedsCosmeticsCategoriesAndProductsIntoAnEmptyCatalog() {
        when(userRepository.count()).thenReturn(1L);
        when(categoryRepository.count()).thenReturn(0L);
        when(productRepository.count()).thenReturn(0L);
        when(categoryRepository.save(any(Category.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        seeder().run();

        ArgumentCaptor<Category> categoryCaptor = ArgumentCaptor.forClass(Category.class);
        verify(categoryRepository, times(4)).save(categoryCaptor.capture());
        assertEquals(
                List.of("Chăm sóc da", "Trang điểm", "Chống nắng", "Chăm sóc tóc"),
                categoryCaptor.getAllValues().stream().map(Category::getName).toList()
        );

        ArgumentCaptor<Product> productCaptor = ArgumentCaptor.forClass(Product.class);
        verify(productRepository, times(8)).save(productCaptor.capture());
        assertEquals(Set.of(
                        "Serum cấp ẩm Hyaluronic Acid 30ml",
                        "Sữa rửa mặt dịu nhẹ 150ml",
                        "Kem dưỡng phục hồi Ceramide 50ml",
                        "Kem chống nắng SPF50+ 50ml",
                        "Son tint dưỡng môi 4g",
                        "Cushion mỏng nhẹ 15g",
                        "Nước tẩy trang dịu nhẹ 400ml",
                        "Dầu gội dưỡng ẩm 300ml"
                ),
                productCaptor.getAllValues().stream().map(Product::getName).collect(Collectors.toSet())
        );
        assertTrue(productCaptor.getAllValues().stream()
                .allMatch(product -> product.getCategory() != null));
    }

    @Test
    void preservesLegacyCatalogWhenOrdersAlreadyExist() {
        when(userRepository.count()).thenReturn(1L);
        when(categoryRepository.findAll()).thenReturn(List.of(
                Category.builder().name("Điện thoại").build(),
                Category.builder().name("Laptop").build(),
                Category.builder().name("Phụ kiện").build()
        ));
        when(productRepository.findAll()).thenReturn(List.of(
                product("iPhone 15 Pro Max"),
                product("Samsung Galaxy S24 Ultra"),
                product("MacBook Air M3"),
                product("Tai nghe AirPods Pro 2"),
                product("Sạc nhanh 30W")
        ));
        when(orderRepository.count()).thenReturn(1L);
        when(categoryRepository.count()).thenReturn(3L);

        seeder().run();

        verify(productRepository, never()).deleteAll();
        verify(categoryRepository, never()).deleteAll();
        verify(categoryRepository, never()).save(any(Category.class));
        verify(productRepository, never()).save(any(Product.class));
    }

    private DataSeeder seeder() {
        return new DataSeeder(
                userRepository,
                categoryRepository,
                productRepository,
                cartItemRepository,
                orderRepository,
                passwordEncoder
        );
    }

    private Product product(String name) {
        return Product.builder().name(name).build();
    }
}
