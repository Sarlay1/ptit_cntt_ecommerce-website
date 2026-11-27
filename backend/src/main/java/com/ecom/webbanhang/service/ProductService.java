package com.ecom.webbanhang.service;

import com.ecom.webbanhang.dto.product.ProductRequest;
import com.ecom.webbanhang.dto.product.ProductResponse;
import com.ecom.webbanhang.entity.Category;
import com.ecom.webbanhang.entity.Product;
import com.ecom.webbanhang.exception.ResourceNotFoundException;
import com.ecom.webbanhang.repository.CategoryRepository;
import com.ecom.webbanhang.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public Page<ProductResponse> getProducts(String keyword, Long categoryId, Pageable pageable) {
        Page<Product> page;
        if (StringUtils.hasText(keyword)) {
            page = categoryId == null
                    ? productRepository.findByNameContainingIgnoreCase(keyword, pageable)
                    : productRepository.findByNameContainingIgnoreCaseAndCategoryId(keyword, categoryId, pageable);
        } else if (categoryId != null) {
            page = productRepository.findByCategoryId(categoryId, pageable);
        } else {
            page = productRepository.findAll(pageable);
        }
        return page.map(this::toResponse);
    }

    public ProductResponse getById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm với id: " + id));
        return toResponse(product);
    }

    @Transactional
    public ProductResponse create(ProductRequest request) {
        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .price(request.getPrice())
                .quantity(request.getQuantity())
                .build();

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục với id: " + request.getCategoryId()));
            product.setCategory(category);
        }

        product = productRepository.save(product);
        return toResponse(product);
    }

    @Transactional
    public ProductResponse update(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm với id: " + id));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setImageUrl(request.getImageUrl());
        product.setPrice(request.getPrice());
        product.setQuantity(request.getQuantity());

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục với id: " + request.getCategoryId()));
            product.setCategory(category);
        } else {
            product.setCategory(null);
        }

        product = productRepository.save(product);
        return toResponse(product);
    }

    @Transactional
    public void delete(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Không tìm thấy sản phẩm với id: " + id);
        }
        productRepository.deleteById(id);
    }

    private ProductResponse toResponse(Product p) {
        return ProductResponse.builder()
                .id(p.getId())
                .name(p.getName())
                .description(p.getDescription())
                .imageUrl(p.getImageUrl())
                .price(p.getPrice())
                .quantity(p.getQuantity())
                .categoryId(p.getCategory() != null ? p.getCategory().getId() : null)
                .categoryName(p.getCategory() != null ? p.getCategory().getName() : null)
                .build();
    }
}
