package com.ecom.webbanhang.service;

import com.ecom.webbanhang.exception.FileStorageException;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.HexFormat;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FileStorageService {

    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("jpg", "jpeg", "png", "webp", "gif");
    private static final long MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
    private final RestClient cloudinaryClient = RestClient.create();

    @Value("${app.upload.dir}")
    private String uploadDir;

    @Value("${app.upload.base-url}")
    private String baseUrl;

    @Value("${app.cloudinary.cloud-name:}")
    private String cloudinaryCloudName;

    @Value("${app.cloudinary.api-key:}")
    private String cloudinaryApiKey;

    @Value("${app.cloudinary.api-secret:}")
    private String cloudinaryApiSecret;

    @Value("${app.cloudinary.folder:lumi-beauty/products}")
    private String cloudinaryFolder;

    @PostConstruct
    void validateCloudinaryConfiguration() {
        boolean hasAnyCredential = StringUtils.hasText(cloudinaryCloudName)
                || StringUtils.hasText(cloudinaryApiKey)
                || StringUtils.hasText(cloudinaryApiSecret);
        boolean hasAllCredentials = StringUtils.hasText(cloudinaryCloudName)
                && StringUtils.hasText(cloudinaryApiKey)
                && StringUtils.hasText(cloudinaryApiSecret);

        if (hasAnyCredential && !hasAllCredentials) {
            throw new IllegalStateException(
                    "Cloudinary configuration requires CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."
            );
        }
    }

    /**
     * Uploads to Cloudinary when configured; otherwise stores the image locally.
     */
    public String storeProductImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new FileStorageException("Vui lòng chọn file ảnh để upload");
        }
        if (file.getSize() > MAX_IMAGE_SIZE_BYTES) {
            throw new FileStorageException("Ảnh sản phẩm không được vượt quá 5 MB");
        }

        String originalName = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "");
        String extension = getExtension(originalName);

        if (!ALLOWED_EXTENSIONS.contains(extension.toLowerCase())) {
            throw new FileStorageException("Chỉ chấp nhận file ảnh định dạng: " + String.join(", ", ALLOWED_EXTENSIONS));
        }

        if (StringUtils.hasText(cloudinaryCloudName)) {
            return uploadToCloudinary(file, extension.toLowerCase());
        }

        return storeLocally(file, extension.toLowerCase());
    }

    private String storeLocally(MultipartFile file, String extension) {
        try {
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);

            String fileName = UUID.randomUUID() + "." + extension;
            Path targetLocation = uploadPath.resolve(fileName);

            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return baseUrl + "/" + fileName;
        } catch (IOException e) {
            throw new FileStorageException("Không thể lưu ảnh cục bộ, vui lòng thử lại.");
        }
    }

    private String uploadToCloudinary(MultipartFile file, String extension) {
        long timestamp = Instant.now().getEpochSecond();
        String timestampValue = Long.toString(timestamp);
        Map<String, String> signedParameters = Map.of(
                "folder", cloudinaryFolder,
                "timestamp", timestampValue
        );
        String signature = createSignature(signedParameters);
        String filename = UUID.randomUUID() + "." + extension;

        try {
            byte[] imageBytes = file.getBytes();
            ByteArrayResource imageResource = new ByteArrayResource(imageBytes) {
                @Override
                public String getFilename() {
                    return filename;
                }
            };
            MultiValueMap<String, Object> request = new LinkedMultiValueMap<>();
            request.add("file", imageResource);
            request.add("api_key", cloudinaryApiKey);
            request.add("timestamp", timestampValue);
            request.add("folder", cloudinaryFolder);
            request.add("signature", signature);

            Map<String, Object> response = cloudinaryClient.post()
                    .uri("https://api.cloudinary.com/v1_1/{cloudName}/image/upload", cloudinaryCloudName)
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(request)
                    .retrieve()
                    .body(new ParameterizedTypeReference<>() {});

            Object secureUrl = response == null ? null : response.get("secure_url");
            if (secureUrl instanceof String url && StringUtils.hasText(url)) {
                return url;
            }
            throw new FileStorageException("Cloudinary không trả về URL ảnh hợp lệ.");
        } catch (RestClientResponseException e) {
            throw new FileStorageException("Cloudinary từ chối tải ảnh (HTTP " + e.getStatusCode().value() + ").");
        } catch (RestClientException e) {
            throw new FileStorageException("Không thể kết nối Cloudinary để tải ảnh.");
        } catch (IOException e) {
            throw new FileStorageException("Không thể đọc file ảnh để tải lên.");
        }
    }

    private String createSignature(Map<String, String> parameters) {
        String parameterString = parameters.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(entry -> entry.getKey() + "=" + entry.getValue())
                .collect(Collectors.joining("&"));
        try {
            byte[] digest = MessageDigest.getInstance("SHA-1")
                    .digest((parameterString + cloudinaryApiSecret).getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-1 is not available for Cloudinary signing.", e);
        }
    }

    private String getExtension(String fileName) {
        List<String> parts = List.of(fileName.split("\\."));
        if (parts.size() < 2) {
            throw new FileStorageException("File không hợp lệ, thiếu phần đuôi mở rộng");
        }
        return parts.get(parts.size() - 1);
    }
}