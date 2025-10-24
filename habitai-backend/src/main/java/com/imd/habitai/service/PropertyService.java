package com.imd.habitai.service;

import com.imd.habitai.dto.request.PropertyRequest;
import com.imd.habitai.dto.response.PropertyResponse;
import com.imd.habitai.mapper.PropertyMapper;
import com.imd.habitai.model.Amenity;
import com.imd.habitai.model.Property;
import com.imd.habitai.model.User;
import com.imd.habitai.repository.AmenityRepository;
import com.imd.habitai.repository.PropertyRepository;
import com.imd.habitai.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityNotFoundException;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PropertyService {
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;
    private final AmenityRepository amenityRepository;
    private final PropertyMapper propertyMapper;
    private final ImageService imageService;
    private final Path rootUploadLocation = Paths.get("habitai-backend","uploads", "properties");
    private static final List<String> ALLOWED_MIME_TYPES = Arrays.asList(
            "image/jpeg",
            "image/png"
    );

    public PropertyService(
            PropertyRepository propertyRepository,
            UserRepository userRepository,
            PropertyMapper propertyMapper,
            AmenityRepository amenityRepository, ImageService imageService
    ) {
        this.propertyRepository = propertyRepository;
        this.userRepository = userRepository;
        this.propertyMapper = propertyMapper;
        this.amenityRepository = amenityRepository;
        this.imageService = imageService;
    }

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(rootUploadLocation);
        } catch (IOException e) {
            throw new RuntimeException("Não foi possível inicializar o diretório para upload de properties", e);
        }
    }


    public PropertyResponse create(PropertyRequest propertyDTO, List<MultipartFile> images) {
        Property property = propertyMapper.toEntity(propertyDTO);
        User owner = userRepository.findById(property.getOwner().getId())
            .orElseThrow(() -> new EntityNotFoundException("Usuário (proprietário) com ID " + property.getOwner().getId() + " não encontrado."));
        
        property.setOwner(owner);

        List<Amenity> amenities = amenityRepository.findAllById(propertyDTO.amenityIds());
        if (amenities.size() != propertyDTO.amenityIds().size()) {
            throw new EntityNotFoundException("Uma ou mais comodidades não foram encontradas.");
        }
        property.setAmenities(amenities);

        Property finalProperty = propertyRepository.save(property);
        if(!images.isEmpty()) {
            finalProperty.setImages(imageService.addImagesToProperty(finalProperty.getId(), images));
        }
        Property result = propertyRepository.findById(finalProperty.getId())
                .orElseThrow(() -> new EntityNotFoundException("Imóvel com ID " + finalProperty.getId() + " não encontrado ao tentar salvar suas imagens."));

        return propertyMapper.toDTO(result);
    }

    public List<PropertyResponse> getAll() {
        return propertyRepository.findAll().stream()
            .map(propertyMapper::toDTO)
            .collect(Collectors.toList());
    }

    public Optional<PropertyResponse> getById(Long id) {
        Optional<Property> property = propertyRepository.findById(id);
        return property.map(propertyMapper::toDTO);
    }

    public Optional<PropertyResponse> update(Long id, PropertyRequest propertyDTO) {
        return propertyRepository.findById(id).map(existingProperty -> {
            Property updatedProperty = propertyMapper.toEntity(propertyDTO);
            updatedProperty.setId(id);

            User owner = userRepository.findById(propertyDTO.ownerId())
                .orElseThrow(() -> new EntityNotFoundException("Usuário (proprietário) com ID " + propertyDTO.ownerId() + " não encontrado."));
            updatedProperty.setOwner(owner);

            List<Amenity> amenities = amenityRepository.findAllById(propertyDTO.amenityIds());
            if (amenities.size() != propertyDTO.amenityIds().size()) {
                throw new EntityNotFoundException("Uma ou mais comodidades não foram encontradas.");
            }
            updatedProperty.setAmenities(amenities);

            propertyRepository.save(updatedProperty);
            return propertyMapper.toDTO(updatedProperty);
        });
    }

    public boolean delete(Long id) {
        if (propertyRepository.existsById(id)) {
            propertyRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private List<String> saveImages(List<MultipartFile> images, Long ownerId) {
        if (images == null || images.isEmpty()) return new ArrayList<>();

        List<String> savedPaths = new ArrayList<>();

        for (MultipartFile file : images) {
            if (file.isEmpty()) continue;

            String contentType = file.getContentType();
            if (contentType == null || !ALLOWED_MIME_TYPES.contains(contentType)) {
                throw new IllegalArgumentException(
                        "Tipo de arquivo inválido: " + file.getOriginalFilename() +
                                ". Apenas arquivos JPG/PNG são permitidos."
                );
            }

            try {
                String uniqueFilename = file.getOriginalFilename() + "_" + ownerId + "_" + System.currentTimeMillis();
                Path destinationFile = this.rootUploadLocation.resolve(uniqueFilename).toAbsolutePath();
                Files.copy(file.getInputStream(), destinationFile, StandardCopyOption.REPLACE_EXISTING);
                savedPaths.add(this.rootUploadLocation.getFileName().toString() + "/" + uniqueFilename);
            } catch (IOException e) {
                throw new RuntimeException("Falha ao salvar a imagem: " + file.getOriginalFilename(), e);
            }
        }
        return savedPaths;
    }
}