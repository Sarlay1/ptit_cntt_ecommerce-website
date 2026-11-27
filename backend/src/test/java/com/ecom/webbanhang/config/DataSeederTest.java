package com.ecom.webbanhang.config;

import com.ecom.webbanhang.entity.Category;
import com.ecom.webbanhang.entity.Product;
import com.ecom.webbanhang.repository.CategoryRepository;
import com.ecom.webbanhang.repository.HeroSlideRepository;
import com.ecom.webbanhang.repository.ProductRepository;
import com.ecom.webbanhang.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;
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
    private HeroSlideRepository heroSlideRepository;
    @Mock
    private PasswordEncoder passwordEncoder;

    @Test
    void seedsCosmeticsCategoriesAndProductsIntoAnEmptyCatalog() {
        when(userRepository.count()).thenReturn(1L);
        when(categoryRepository.save(any(Category.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        seeder().run();

        ArgumentCaptor<Category> categoryCaptor = ArgumentCaptor.forClass(Category.class);
        verify(categoryRepository, times(11)).save(categoryCaptor.capture());
        assertEquals(
                List.of(
                        "Chăm sóc da", "Trang điểm", "Chống nắng", "Chăm sóc tóc",
                        "Chăm sóc cơ thể", "Mặt nạ & treatment", "Nước hoa",
                        "Chăm sóc môi", "Chăm sóc mắt", "Chăm sóc móng", "Bộ quà tặng"
                ),
                categoryCaptor.getAllValues().stream().map(Category::getName).toList()
        );

        ArgumentCaptor<Product> productCaptor = ArgumentCaptor.forClass(Product.class);
        verify(productRepository, times(15)).save(productCaptor.capture());
        assertEquals(Set.of(
                        "Serum cấp ẩm Hyaluronic Acid 30ml",
                        "Sữa rửa mặt dịu nhẹ 150ml",
                        "Kem dưỡng phục hồi Ceramide 50ml",
                        "Kem chống nắng SPF50+ 50ml",
                        "Son tint dưỡng môi 4g",
                        "Cushion mỏng nhẹ 15g",
                        "Nước tẩy trang dịu nhẹ 400ml",
                        "Dầu gội dưỡng ẩm 300ml",
                        "Sữa dưỡng thể hoa trà 250ml",
                        "Mặt nạ ngủ cấp ẩm 75ml",
                        "Nước hoa Eau de Parfum 50ml",
                        "Son dưỡng môi phục hồi 4g",
                        "Kem dưỡng vùng mắt 15ml",
                        "Dầu dưỡng móng và biểu bì 10ml",
                        "Bộ quà tặng chăm sóc da Lumi"
                ),
                productCaptor.getAllValues().stream().map(Product::getName).collect(Collectors.toSet())
        );
        assertTrue(productCaptor.getAllValues().stream()
                .allMatch(product -> product.getCategory() != null));
        verify(heroSlideRepository).saveAll(any());
    }

    @Test
    void addsCosmeticsWithoutDeletingExistingCatalogData() {
        when(userRepository.count()).thenReturn(1L);
        when(categoryRepository.findByNameIgnoreCase("Chăm sóc da"))
                .thenReturn(Optional.of(Category.builder().name("Chăm sóc da").build()));
        when(categoryRepository.save(any(Category.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        when(productRepository.existsByNameIgnoreCase(anyString())).thenReturn(false);
        when(heroSlideRepository.count()).thenReturn(1L);

        seeder().run();

        verify(productRepository, never()).deleteAll();
        verify(categoryRepository, never()).deleteAll();
        verify(productRepository, times(15)).save(any(Product.class));
    }

    private DataSeeder seeder() {
        return new DataSeeder(userRepository, categoryRepository, productRepository,
                heroSlideRepository, passwordEncoder);
    }
}
