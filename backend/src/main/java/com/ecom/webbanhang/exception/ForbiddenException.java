package com.ecom.webbanhang.exception;

// Dùng khi user cố truy cập tài nguyên không thuộc về mình (IDOR) -> 403
public class ForbiddenException extends RuntimeException {
    public ForbiddenException(String message) {
        super(message);
    }
}
