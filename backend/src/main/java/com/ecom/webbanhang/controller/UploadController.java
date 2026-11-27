package com.ecom.webbanhang.controller;

import com.ecom.webbanhang.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/upload")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class UploadController {

    private final FileStorageService fileStorageService;

    // Upload ảnh sản phẩm -> trả về URL để lưu vào field imageUrl khi tạo/sửa sản phẩm
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
        String url = fileStorageService.storeProductImage(file);
        return ResponseEntity.ok(Map.of("url", url));
    }
}