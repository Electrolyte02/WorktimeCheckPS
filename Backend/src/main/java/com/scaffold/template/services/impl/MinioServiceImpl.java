package com.scaffold.template.services.impl;

import com.scaffold.template.services.MinioService;
import io.minio.*;
import io.minio.errors.*;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.text.Normalizer;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.regex.Pattern;

@Service
public class MinioServiceImpl implements MinioService {

    private final MinioClient minioClient;
    private String bucketName = "worktimecheck";

    // Allowed file extensions for security
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of(
            ".pdf", ".doc", ".docx", ".txt", ".jpg", ".jpeg", ".png"
    );

    @Autowired
    public MinioServiceImpl(MinioClient minioClientParam) {
        this.minioClient = minioClientParam;
    }

    @Override
    public GetObjectResponse getFile(String fileName) throws ServerException,
            InsufficientDataException, ErrorResponseException, IOException, NoSuchAlgorithmException,
            InvalidKeyException, InvalidResponseException, XmlParserException, InternalException
    {
        GetObjectArgs getObjectArgs = GetObjectArgs.builder()
                .bucket(bucketName)
                .object(fileName)
                .build();

        return minioClient.getObject(getObjectArgs);
    }

    // New method to get file as Base64 string with metadata
    public Map<String, Object> getFileForFrontend(String fileName) throws ServerException,
            InsufficientDataException, ErrorResponseException, IOException, NoSuchAlgorithmException,
            InvalidKeyException, InvalidResponseException, XmlParserException, InternalException {

        GetObjectArgs getObjectArgs = GetObjectArgs.builder()
                .bucket(bucketName)
                .object(fileName)
                .build();

        try (GetObjectResponse response = minioClient.getObject(getObjectArgs)) {
            // Convert InputStream to byte array
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            byte[] buffer = new byte[1024];
            int bytesRead;
            while ((bytesRead = response.read(buffer)) != -1) {
                outputStream.write(buffer, 0, bytesRead);
            }
            byte[] fileBytes = outputStream.toByteArray();

            // Convert to Base64
            String base64Content = Base64.getEncoder().encodeToString(fileBytes);

            // Get file metadata
            StatObjectArgs statArgs = StatObjectArgs.builder()
                    .bucket(bucketName)
                    .object(fileName)
                    .build();
            StatObjectResponse stat = minioClient.statObject(statArgs);

            // Extract original filename from metadata or path
            String originalFileName = extractOriginalFileName(fileName, stat);

            // Prepare response map
            Map<String, Object> fileData = new HashMap<>();
            fileData.put("content", base64Content);
            fileData.put("fileName", originalFileName);
            fileData.put("contentType", stat.contentType());
            fileData.put("size", stat.size());

            return fileData;
        }
    }

    // Alternative method to get file as byte array
    public byte[] getFileAsBytes(String fileName) throws ServerException,
            InsufficientDataException, ErrorResponseException, IOException, NoSuchAlgorithmException,
            InvalidKeyException, InvalidResponseException, XmlParserException, InternalException {

        GetObjectArgs getObjectArgs = GetObjectArgs.builder()
                .bucket(bucketName)
                .object(fileName)
                .build();

        try (GetObjectResponse response = minioClient.getObject(getObjectArgs)) {
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            byte[] buffer = new byte[1024];
            int bytesRead;
            while ((bytesRead = response.read(buffer)) != -1) {
                outputStream.write(buffer, 0, bytesRead);
            }
            return outputStream.toByteArray();
        }
    }

    @Override
    public String saveFile(String fileName, String filePrefix, MultipartFile file) throws IOException,
            ServerException, InsufficientDataException, ErrorResponseException, NoSuchAlgorithmException,
            InvalidKeyException, InvalidResponseException, XmlParserException, InternalException
    {
        // Validate file
        validateFile(file);

        // Generate unique file name
        String uniqueFileName = generateUniqueFileName(fileName, filePrefix);

        // Create metadata to store original filename
        Map<String, String> metadata = new HashMap<>();
        metadata.put("original-filename", fileName);
        metadata.put("upload-timestamp", LocalDateTime.now().toString());

        PutObjectArgs putObjectArgs = PutObjectArgs.builder()
                .bucket(bucketName)
                .object(uniqueFileName)
                .contentType(file.getContentType())
                .stream(file.getInputStream(), file.getSize(), -1)
                .userMetadata(metadata) // Store original filename in metadata
                .build();

        minioClient.putObject(putObjectArgs);
        return uniqueFileName; // Return the unique path for database storage
    }

    // OPTION 1: UUID-based unique naming (Recommended)
    private String generateUniqueFileName(String originalFileName, String filePrefix) {
        // Sanitize original filename
        String sanitizedName = sanitizeFileName(originalFileName);

        // Extract extension
        String extension = getFileExtension(sanitizedName);
        String nameWithoutExtension = removeFileExtension(sanitizedName);

        // Generate unique identifier
        String uniqueId = UUID.randomUUID().toString();

        // Create unique filename: prefix/UUID_originalName.ext
        return filePrefix + "/" + uniqueId + "_" + nameWithoutExtension + extension;
    }

    // Utility methods
    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        String originalFileName = file.getOriginalFilename();
        if (originalFileName == null || originalFileName.trim().isEmpty()) {
            throw new IllegalArgumentException("File name is required");
        }

        // Check file extension
        String extension = getFileExtension(originalFileName).toLowerCase();
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new IllegalArgumentException("File type not allowed: " + extension);
        }

        // Check file size (example: max 10MB)
        if (file.getSize() > 10 * 1024 * 1024) {
            throw new IllegalArgumentException("File size exceeds maximum allowed size (10MB)");
        }
    }

    private String sanitizeFileName(String fileName) {
        if (fileName == null) return "unnamed";

        // Remove path separators and other dangerous characters
        String sanitized = fileName.replaceAll("[/\\\\:*?\"<>|]", "_");

        // Normalize unicode characters
        sanitized = Normalizer.normalize(sanitized, Normalizer.Form.NFD);
        sanitized = Pattern.compile("\\p{InCombiningDiacriticalMarks}+").matcher(sanitized).replaceAll("");

        // Limit length
        if (sanitized.length() > 100) {
            String extension = getFileExtension(sanitized);
            String nameWithoutExt = removeFileExtension(sanitized);
            sanitized = nameWithoutExt.substring(0, 100 - extension.length()) + extension;
        }

        return sanitized;
    }

    private String getFileExtension(String fileName) {
        int lastDotIndex = fileName.lastIndexOf('.');
        return lastDotIndex > 0 ? fileName.substring(lastDotIndex) : "";
    }

    private String removeFileExtension(String fileName) {
        int lastDotIndex = fileName.lastIndexOf('.');
        return lastDotIndex > 0 ? fileName.substring(0, lastDotIndex) : fileName;
    }

    private String extractOriginalFileName(String storedPath, StatObjectResponse stat) {
        // Try to get from metadata first
        if (stat.userMetadata() != null && stat.userMetadata().containsKey("original-filename")) {
            return stat.userMetadata().get("original-filename");
        }

        // Fallback: extract from path (remove UUID prefix if present)
        String fileName = storedPath.substring(storedPath.lastIndexOf('/') + 1);
        if (fileName.contains("_") && fileName.length() > 36) {
            // Remove UUID prefix (36 chars + underscore)
            return fileName.substring(37);
        }

        return fileName;
    }

    private String createMD5Hash(byte[] fileBytes) {
        try {
            java.security.MessageDigest md = java.security.MessageDigest.getInstance("MD5");
            byte[] hashBytes = md.digest(fileBytes);
            StringBuilder sb = new StringBuilder();
            for (byte b : hashBytes) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("MD5 algorithm not available", e);
        }
    }

    @Override
    public void deleteFile(String fileName) throws ServerException,
            InsufficientDataException, ErrorResponseException, IOException, NoSuchAlgorithmException,
            InvalidKeyException, InvalidResponseException, XmlParserException, InternalException
    {
        RemoveObjectArgs removeObjectArgs = RemoveObjectArgs.builder()
                .bucket(bucketName)
                .object(fileName)
                .build();

        minioClient.removeObject(removeObjectArgs);
    }

    @PostConstruct
    public void testConnection() {
        try {
            boolean exists = minioClient.bucketExists(BucketExistsArgs.builder().bucket("worktimecheck").build());
            System.out.println("MinIO is up. Bucket exists: " + exists);
        } catch (Exception e) {
            System.err.println("MinIO connection failed: " + e.getMessage());
        }
    }
}