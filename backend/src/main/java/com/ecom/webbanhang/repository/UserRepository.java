package com.ecom.webbanhang.repository;

import com.ecom.webbanhang.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    @Query("""
            SELECT user FROM User user
            WHERE LOWER(user.username) = LOWER(:identifier)
               OR LOWER(user.email) = LOWER(:identifier)
            """)
    Optional<User> findByUsernameOrEmailIgnoreCase(@Param("identifier") String identifier);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
