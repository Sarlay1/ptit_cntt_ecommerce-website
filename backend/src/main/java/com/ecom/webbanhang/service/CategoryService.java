package com.ecom.webbanhang.service;

import com.ecom.webbanhang.dto.category.CategoryDto;
import com.ecom.webbanhang.entity.Category;
import com.ecom.webbanhang.exception.ResourceNotFoundException;
import com.ecom.webbanhang.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<CategoryDto> getAll() {
        return categoryRepository.findAll().stream()
                .map(c -> CategoryDto.builder().id(c.getId()).name(c.getName()).build())
                .toList();
    }

    public CategoryDto create(CategoryDto dto) {
        Category category = Category.builder().name(dto.getName()).build();
        category = categoryRepository.save(category);
        return CategoryDto.builder().id(category.getId()).name(category.getName()).build();
    }

    public void delete(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Không tìm thấy danh mục với id: " + id);
        }
        categoryRepository.deleteById(id);
    }
}
