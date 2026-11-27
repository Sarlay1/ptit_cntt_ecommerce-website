package com.ecom.webbanhang.service;

import com.ecom.webbanhang.exception.FileStorageException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;

import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class FileStorageServiceTest {

    @TempDir
    Path uploadDirectory;

    private FileStorageService fileStorageService;

    @BeforeEach
    void setUp() {
        fileStorageService = new FileStorageService();
        ReflectionTestUtils.setField(fileStorageService, "uploadDir", uploadDirectory.toString());
        ReflectionTestUtils.setField(fileStorageService, "baseUrl", "/uploads");
        ReflectionTestUtils.setField(fileStorageService, "cloudinaryCloudName", "");
        ReflectionTestUtils.setField(fileStorageService, "cloudinaryApiKey", "");
        ReflectionTestUtils.setField(fileStorageService, "cloudinaryApiSecret", "");
    }

    @Test
    void storesImagesLocallyWhenCloudinaryIsNotConfigured() throws Exception {
        byte[] image = {1, 2, 3};
        MockMultipartFile file = new MockMultipartFile("file", "product.png", "image/png", image);

        String imageUrl = fileStorageService.storeProductImage(file);
        Path savedImage = uploadDirectory.resolve(imageUrl.substring(imageUrl.lastIndexOf('/') + 1));

        assertTrue(imageUrl.startsWith("/uploads/"));
        assertArrayEquals(image, Files.readAllBytes(savedImage));
    }

    @Test
    void rejectsImagesLargerThanFiveMegabytes() {
        byte[] oversizedImage = new byte[5 * 1024 * 1024 + 1];
        MockMultipartFile file = new MockMultipartFile("file", "product.png", "image/png", oversizedImage);

        assertThrows(FileStorageException.class, () -> fileStorageService.storeProductImage(file));
    }

    @Test
    void rejectsPartialCloudinaryCredentials() {
        ReflectionTestUtils.setField(fileStorageService, "cloudinaryCloudName", "example");

        assertThrows(IllegalStateException.class, fileStorageService::validateCloudinaryConfiguration);
    }
}
