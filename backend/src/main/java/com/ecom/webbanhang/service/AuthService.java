package com.ecom.webbanhang.service;

import com.ecom.webbanhang.dto.auth.JwtResponse;
import com.ecom.webbanhang.dto.auth.LoginRequest;
import com.ecom.webbanhang.dto.auth.RegisterRequest;
import com.ecom.webbanhang.entity.Role;
import com.ecom.webbanhang.entity.User;
import com.ecom.webbanhang.exception.DuplicateResourceException;
import com.ecom.webbanhang.repository.UserRepository;
import com.ecom.webbanhang.security.CustomUserDetails;
import com.ecom.webbanhang.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @Transactional
    public JwtResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateResourceException("Username đã tồn tại");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email đã tồn tại");
        }

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .role(Role.CUSTOMER)
                .status("ACTIVE")
                .build();

        user = userRepository.save(user);

        String token = jwtUtil.generateToken(new CustomUserDetails(user));

        return JwtResponse.builder()
                .token(token)
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }

    public JwtResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        String token = jwtUtil.generateToken(userDetails);

        return JwtResponse.builder()
                .token(token)
                .id(userDetails.getId())
                .username(userDetails.getUsername())
                .email(userDetails.getEmail())
                .role(userDetails.getRole())
                .build();
    }
}
