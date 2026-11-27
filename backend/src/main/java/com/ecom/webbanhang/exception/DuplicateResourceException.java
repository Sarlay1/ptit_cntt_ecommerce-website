package com.ecom.webbanhang.exception;

// Dùng khi đăng ký username/email đã tồn tại -> 409
public class DuplicateResourceException extends RuntimeException {
    public DuplicateResourceException(String message) {
        super(message);
    }
}
