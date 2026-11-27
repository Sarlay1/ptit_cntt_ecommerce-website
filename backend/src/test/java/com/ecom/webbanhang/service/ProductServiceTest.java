package com.ecom.webbanhang.service;

import com.ecom.webbanhang.repository.CategoryRepository;
import com.ecom.webbanhang.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;
    @Mock
    private CategoryRepository categoryRepository;

    @Test
    void combinesSearchTextWithTheSelectedCategory() {
        var pageable = PageRequest.of(0, 12);
        when(productRepository.findByNameContainingIgnoreCaseAndCategoryId("serum", 4L, pageable))
                .thenReturn(Page.empty(pageable));

        var result = new ProductService(productRepository, categoryRepository)
                .getProducts("serum", 4L, pageable);

        assertTrue(result.isEmpty());
        verify(productRepository).findByNameContainingIgnoreCaseAndCategoryId("serum", 4L, pageable);
    }
}
