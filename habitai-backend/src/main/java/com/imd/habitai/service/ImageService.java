package com.imd.habitai.service;

import com.imd.habitai.model.Image;
import com.imd.habitai.model.Property;
import com.imd.habitai.repository.ImageRepository;
import com.imd.habitai.repository.PropertyRepository;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class ImageService {

    private final Path rootUploadLocation = Paths.get("habitai-backend", "uploads", "properties");
    private static final List<String> ALLOWED_MIME_TYPES = Arrays.asList("image/jpeg", "image/png");

    private final ImageRepository imageRepository;

    private final PropertyRepository propertyRepository;

    public ImageService(ImageRepository imageRepository, PropertyRepository propertyRepository){
        this.imageRepository = imageRepository;
        this.propertyRepository = propertyRepository;
    }

    @PostConstruct
    public void init() throws IOException {
        try {
            Files.createDirectories(rootUploadLocation);
        } catch (IOException e) {
            throw new RuntimeException("Não foi possível inicializar o diretório para upload de properties", e);
        }
    }

    @Transactional
    public List<Image> addImagesToProperty(Long propertyId, List<MultipartFile> files) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new EntityNotFoundException("Imóvel com ID " + propertyId + " não encontrado."));

        List<Image> savedImages = new ArrayList<>();

        for (MultipartFile file : files) {
            if (file.isEmpty()) continue;

            String contentType = file.getContentType();
            if (contentType == null || !ALLOWED_MIME_TYPES.contains(contentType)) {
                throw new IllegalArgumentException("Tipo de arquivo inválido: " + file.getOriginalFilename());
            }

            try {
                String uniqueFilename = UUID.randomUUID().toString() + getExtension(file.getOriginalFilename());
                Path destinationFile = this.rootUploadLocation.resolve(uniqueFilename).toAbsolutePath();
                Files.copy(file.getInputStream(), destinationFile, StandardCopyOption.REPLACE_EXISTING);

                String relativePath = this.rootUploadLocation.toString().replace(File.separator, "/") + "/" + uniqueFilename;

                Image image = new Image();
                image.setImagePath(relativePath);
                image.setContentType(file.getContentType());
                image.setProperty(property);

                savedImages.add(imageRepository.save(image));

            } catch (IOException e) {
                throw new RuntimeException("Falha ao salvar a imagem: " + file.getOriginalFilename(), e);
            }
        }
        return savedImages;
    }

    public void deleteImage(Long imageId) {
        Image image = imageRepository.findById(imageId)
                .orElseThrow(() -> new EntityNotFoundException("Imagem com ID " + imageId + " não encontrada."));

        try {
            Path fullPath = Paths.get(image.getImagePath()).toAbsolutePath();
            Files.deleteIfExists(fullPath);
        } catch (IOException e) {
            throw new RuntimeException("Falha ao deletar arquivo do disco: " + image.getImagePath(), e);
        }

        imageRepository.delete(image);
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "";
        return filename.substring(filename.lastIndexOf("."));
    }
}