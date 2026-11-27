package com.ecom.webbanhang.config;

import com.ecom.webbanhang.entity.Category;
import com.ecom.webbanhang.entity.HeroSlide;
import com.ecom.webbanhang.entity.Product;
import com.ecom.webbanhang.entity.Role;
import com.ecom.webbanhang.entity.User;
import com.ecom.webbanhang.repository.CategoryRepository;
import com.ecom.webbanhang.repository.HeroSlideRepository;
import com.ecom.webbanhang.repository.ProductRepository;
import com.ecom.webbanhang.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Seed dữ liệu mẫu để có thể chạy demo/test ngay sau khi khởi động
 * Tài khoản admin mặc định: admin / admin123
 * Tài khoản khách hàng mẫu: customer / customer123
 */
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final HeroSlideRepository heroSlideRepository;
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

        seedCosmeticsCatalog();
        seedHeroSlides();
    }

    private void seedCosmeticsCatalog() {
        Map<String, Category> categories = new HashMap<>();
        List.of(
                "Chăm sóc da", "Trang điểm", "Chống nắng", "Chăm sóc tóc",
                "Chăm sóc cơ thể", "Mặt nạ & treatment", "Nước hoa",
                "Chăm sóc môi", "Chăm sóc mắt", "Chăm sóc móng", "Bộ quà tặng"
        ).forEach(name -> categories.put(name, categoryRepository.findByNameIgnoreCase(name)
                .orElseGet(() -> categoryRepository.save(Category.builder().name(name).build()))));

        List<ProductSeed> products = List.of(
                new ProductSeed("Serum cấp ẩm Hyaluronic Acid 30ml",
                        "Serum cấp ẩm nhẹ, phù hợp cho quy trình chăm sóc da hằng ngày.",
                        "https://images.pexels.com/photos/3735641/pexels-photo-3735641.jpeg?auto=compress&cs=tinysrgb&w=900",
                        "329000", 30, "Chăm sóc da"),
                new ProductSeed("Sữa rửa mặt dịu nhẹ 150ml",
                        "Làm sạch bụi bẩn và lớp dầu thừa mà không gây cảm giác khô căng.",
                        "https://images.pexels.com/photos/3735646/pexels-photo-3735646.jpeg?auto=compress&cs=tinysrgb&w=900",
                        "189000", 40, "Chăm sóc da"),
                new ProductSeed("Kem dưỡng phục hồi Ceramide 50ml",
                        "Kem dưỡng ẩm với Ceramide, dùng trong bước khóa ẩm buổi sáng hoặc tối.",
                        "https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=900",
                        "359000", 25, "Chăm sóc da"),
                new ProductSeed("Kem chống nắng SPF50+ 50ml",
                        "Chất kem mỏng nhẹ, tiện dùng mỗi ngày trước khi ra ngoài.",
                        "https://images.pexels.com/photos/4202325/pexels-photo-4202325.jpeg?auto=compress&cs=tinysrgb&w=900",
                        "279000", 35, "Chống nắng"),
                new ProductSeed("Son tint dưỡng môi 4g",
                        "Son tint có độ bóng nhẹ, cho đôi môi tươi tắn khi trang điểm hằng ngày.",
                        "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=900&q=85",
                        "239000", 32, "Trang điểm"),
                new ProductSeed("Cushion mỏng nhẹ 15g",
                        "Lớp nền mỏng nhẹ, dễ tán và thuận tiện để dặm lại trong ngày.",
                        "https://images.pexels.com/photos/3737594/pexels-photo-3737594.jpeg?auto=compress&cs=tinysrgb&w=900",
                        "459000", 20, "Trang điểm"),
                new ProductSeed("Nước tẩy trang dịu nhẹ 400ml",
                        "Hỗ trợ làm sạch lớp trang điểm và bụi bẩn cuối ngày.",
                        "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=900&q=85",
                        "199000", 40, "Chăm sóc da"),
                new ProductSeed("Dầu gội dưỡng ẩm 300ml",
                        "Dầu gội làm sạch tóc và da đầu, hương thơm nhẹ nhàng.",
                        "https://images.pexels.com/photos/3735646/pexels-photo-3735646.jpeg?auto=compress&cs=tinysrgb&w=900",
                        "219000", 24, "Chăm sóc tóc"),
                new ProductSeed("Sữa dưỡng thể hoa trà 250ml",
                        "Sữa dưỡng thể có kết cấu mỏng nhẹ, giúp làn da mềm mại sau khi tắm.",
                        "https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=900",
                        "389000", 18, "Chăm sóc cơ thể"),
                new ProductSeed("Mặt nạ ngủ cấp ẩm 75ml",
                        "Mặt nạ ngủ chăm sóc da qua đêm với cảm giác ẩm mượt, dễ chịu.",
                        "https://images.pexels.com/photos/3735641/pexels-photo-3735641.jpeg?auto=compress&cs=tinysrgb&w=900",
                        "429000", 16, "Mặt nạ & treatment"),
                new ProductSeed("Nước hoa Eau de Parfum 50ml",
                        "Hương thơm thanh lịch với nốt hương nhẹ nhàng cho ngày thường.",
                        "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=85",
                        "1290000", 12, "Nước hoa"),
                new ProductSeed("Son dưỡng môi phục hồi 4g",
                        "Son dưỡng giúp môi mềm mại, phù hợp dùng trước khi trang điểm.",
                        "https://images.pexels.com/photos/3735641/pexels-photo-3735641.jpeg?auto=compress&cs=tinysrgb&w=900",
                        "219000", 24, "Chăm sóc môi"),
                new ProductSeed("Kem dưỡng vùng mắt 15ml",
                        "Kem dưỡng có kết cấu nhẹ, bổ sung độ ẩm cho vùng da quanh mắt.",
                        "https://images.pexels.com/photos/4202325/pexels-photo-4202325.jpeg?auto=compress&cs=tinysrgb&w=900",
                        "549000", 14, "Chăm sóc mắt"),
                new ProductSeed("Dầu dưỡng móng và biểu bì 10ml",
                        "Dầu dưỡng tiện dụng giúp chăm sóc móng và vùng biểu bì khô.",
                        "https://images.pexels.com/photos/3737594/pexels-photo-3737594.jpeg?auto=compress&cs=tinysrgb&w=900",
                        "179000", 20, "Chăm sóc móng"),
                new ProductSeed("Bộ quà tặng chăm sóc da Lumi",
                        "Bộ sản phẩm chăm sóc cơ bản, phù hợp làm quà tặng tinh tế.",
                        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=85",
                        "890000", 10, "Bộ quà tặng")
        );

        products.stream()
                .filter(product -> !productRepository.existsByNameIgnoreCase(product.name()))
                .forEach(product -> saveProduct(
                        product.name(), product.description(), product.imageUrl(), product.price(),
                        product.quantity(), categories.get(product.categoryName())
                ));
    }

    private void seedHeroSlides() {
        if (heroSlideRepository.count() > 0) {
            return;
        }
        heroSlideRepository.saveAll(List.of(
                heroSlide(
                        "Chăm sóc tốt bắt đầu từ điều làn da cần.",
                        "Những lựa chọn dịu nhẹ, được tuyển chọn để bạn chăm sóc làn da theo nhịp riêng.",
                        "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=1200&q=90",
                        "Bộ sản phẩm chăm sóc da trên nền sáng tối giản",
                        "Lumi Beauty · Chăm sóc da có chọn lọc",
                        "Khám phá sản phẩm", "/#catalog", 0
                ),
                heroSlide(
                        "Một khoảng lặng cho làn da.",
                        "Tìm sản phẩm phù hợp cho chu trình chăm sóc da hằng ngày.",
                        "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=1200&q=90",
                        "Các sản phẩm skincare được sắp đặt tinh tế",
                        "Lumi Edit · Chọn lọc đặc biệt",
                        "Xem bộ sưu tập", "/#luxury", 1
                ),
                heroSlide(
                        "Nâng niu những điều nhỏ bé.",
                        "Từ son dưỡng đến mùi hương yêu thích, khám phá món dành riêng cho bạn.",
                        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=90",
                        "Mỹ phẩm và sản phẩm trang điểm tông màu tự nhiên",
                        "Lumi Beauty · Everyday essentials",
                        "Xem sản phẩm", "/#catalog", 2
                )
        ));
    }

    private HeroSlide heroSlide(
            String title,
            String subtitle,
            String imageUrl,
            String imageAlt,
            String caption,
            String ctaLabel,
            String ctaLink,
            int displayOrder
    ) {
        return HeroSlide.builder()
                .title(title)
                .subtitle(subtitle)
                .imageUrl(imageUrl)
                .imageAlt(imageAlt)
                .caption(caption)
                .ctaLabel(ctaLabel)
                .ctaLink(ctaLink)
                .displayOrder(displayOrder)
                .active(true)
                .build();
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

    private record ProductSeed(
            String name,
            String description,
            String imageUrl,
            String price,
            int quantity,
            String categoryName
    ) {}
}
