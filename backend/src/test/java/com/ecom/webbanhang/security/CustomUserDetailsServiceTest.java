package com.ecom.webbanhang.security;

import com.ecom.webbanhang.entity.Role;
import com.ecom.webbanhang.entity.User;
import com.ecom.webbanhang.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CustomUserDetailsServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CustomUserDetailsService userDetailsService;

    @Test
    void loadsAccountByTrimmedEmailIgnoringCase() {
        User user = User.builder()
                .id(7L)
                .username("buyer")
                .email("buyer@example.com")
                .password("encoded-password")
                .role(Role.CUSTOMER)
                .status("ACTIVE")
                .build();
        when(userRepository.findByUsernameOrEmailIgnoreCase("BUYER@EXAMPLE.COM"))
                .thenReturn(Optional.of(user));

        CustomUserDetails details = (CustomUserDetails)
                userDetailsService.loadUserByUsername(" BUYER@EXAMPLE.COM ");

        assertEquals("buyer", details.getUsername());
        assertEquals("buyer@example.com", details.getEmail());
        verify(userRepository).findByUsernameOrEmailIgnoreCase("BUYER@EXAMPLE.COM");
    }

    @Test
    void loadsAccountByUsername() {
        User user = User.builder()
                .username("buyer")
                .email("buyer@example.com")
                .password("encoded-password")
                .role(Role.CUSTOMER)
                .status("ACTIVE")
                .build();
        when(userRepository.findByUsernameOrEmailIgnoreCase("buyer"))
                .thenReturn(Optional.of(user));

        CustomUserDetails details = (CustomUserDetails)
                userDetailsService.loadUserByUsername("buyer");

        assertEquals("buyer", details.getUsername());
        verify(userRepository).findByUsernameOrEmailIgnoreCase("buyer");
    }
}
