package com.ecom.webbanhang.dto.auth;

import lombok.*;
import lombok.Builder.Default;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JwtResponse {
    private String token;
    @Default
    private String type = "Bearer";
    private Long id;
    private String username;
    private String email;
    private String role;
}
