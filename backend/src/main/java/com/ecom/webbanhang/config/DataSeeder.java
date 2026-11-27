package com.ecom.webbanhang.config;

import com.ecom.webbanhang.entity.*;
import com.ecom.webbanhang.repository.CategoryRepository;
import com.ecom.webbanhang.repository.CartItemRepository;
import com.ecom.webbanhang.repository.OrderRepository;
import com.ecom.webbanhang.repository.ProductRepository;
import com.ecom.webbanhang.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Seed dữ liệu mẫu để có thể chạy demo/test ngay sau khi khởi động
 * Tài khoản admin mặc định: admin / admin123
 * Tài khoản khách hàng mẫu: customer / customer123
 */
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private static final Set<String> LEGACY_CATEGORY_NAMES =
            Set.of("Điện thoại", "Laptop", "Phụ kiện");
    private static final Set<String> LEGACY_PRODUCT_NAMES = Set.of(
            "iPhone 15 Pro Max",
            "Samsung Galaxy S24 Ultra",
            "MacBook Air M3",
            "Tai nghe AirPods Pro 2",
            "Sạc nhanh 30W"
    );

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final CartItemRepository cartItemRepository;
    private final OrderRepository orderRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            userRepository.save(User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .email("admin@webbanhang.com")
                    .role(Role.ADMIN)
                    .status("ACTIVE")
                    .build());

            userRepository.save(User.builder()
                    .username("customer")
                    .password(passwordEncoder.encode("customer123"))
                    .email("customer@webbanhang.com")
                    .role(Role.CUSTOMER)
                    .status("ACTIVE")
                    .build());
        }

        if (isLegacyDemoCatalog()
                && orderRepository.count() == 0
                && cartItemRepository.count() == 0) {
            productRepository.deleteAll();
            categoryRepository.deleteAll();
        }

        if (categoryRepository.count() == 0 && productRepository.count() == 0) {
            seedCosmeticsCatalog();
        }
    }

    private boolean isLegacyDemoCatalog() {
        var categories = categoryRepository.findAll();
        var products = productRepository.findAll();
        return categories.size() == LEGACY_CATEGORY_NAMES.size()
                && categories.stream().map(Category::getName).collect(Collectors.toSet())
                .equals(LEGACY_CATEGORY_NAMES)
                && products.size() == LEGACY_PRODUCT_NAMES.size()
                && products.stream().map(Product::getName).collect(Collectors.toSet())
                .equals(LEGACY_PRODUCT_NAMES);
    }

    private void seedCosmeticsCatalog() {
        Category skincare = categoryRepository.save(Category.builder().name("Chăm sóc da").build());
        Category makeup = categoryRepository.save(Category.builder().name("Trang điểm").build());
        Category sunscreen = categoryRepository.save(Category.builder().name("Chống nắng").build());
        Category haircare = categoryRepository.save(Category.builder().name("Chăm sóc tóc").build());

        saveProduct("Serum cấp ẩm Hyaluronic Acid 30ml",
                "Serum cấp ẩm nhẹ, phù hợp cho quy trình chăm sóc da hằng ngày.",
                "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80",
                "329000", 30, skincare);
        saveProduct("Sữa rửa mặt dịu nhẹ 150ml",
                "Làm sạch bụi bẩn và lớp dầu thừa mà không gây cảm giác khô căng.",
                "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80",
                "189000", 40, skincare);
        saveProduct("Kem dưỡng phục hồi Ceramide 50ml",
                "Kem dưỡng ẩm với Ceramide, dùng trong bước khóa ẩm buổi sáng hoặc tối.",
                "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80",
                "359000", 25, skincare);
        saveProduct("Kem chống nắng SPF50+ 50ml",
                "Chất kem mỏng nhẹ, tiện dùng mỗi ngày trước khi ra ngoài.",
                "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=800&q=80",
                "279000", 35, sunscreen);
        saveProduct("Son tint dưỡng môi 4g",
                "Son tint có độ bóng nhẹ, cho đôi môi tươi tắn khi trang điểm hằng ngày.",
                "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80",
                "239000", 32, makeup);
        saveProduct("Cushion mỏng nhẹ 15g",
                "Lớp nền mỏng nhẹ, dễ tán và thuận tiện để dặm lại trong ngày.",
                "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
                "459000", 20, makeup);
        saveProduct("Nước tẩy trang dịu nhẹ 400ml",
                "Hỗ trợ làm sạch lớp trang điểm và bụi bẩn cuối ngày.",
                "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=800&q=80",
                "199000", 40, skincare);
        saveProduct("Dầu gội dưỡng ẩm 300ml",
                "Dầu gội làm sạch tóc và da đầu, hương thơm nhẹ nhàng.",
                "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80",
                "219000", 24, haircare);
    }

    private void saveProduct(
            String name,
            String description,
            String imageUrl,
            String price,
            int quantity,
            Category category
    ) {
        productRepository.save(Product.builder()
                .name(name)
                .description(description)
                .imageUrl(imageUrl)
                .price(new BigDecimal(price))
                .quantity(quantity)
                .category(category)
                .build());
    }
}
