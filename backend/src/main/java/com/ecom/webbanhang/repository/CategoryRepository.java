package com.ecom.webbanhang.repository;

import com.ecom.webbanhang.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
