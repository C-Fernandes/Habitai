package com.imd.habitai.controller;

import com.imd.habitai.dto.response.ImageResponse;
import com.imd.habitai.mapper.ImageMapper;
import com.imd.habitai.model.Image;
import com.imd.habitai.service.ImageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/properties")
public class ImageController {

    private final ImageService imageService;
    private final ImageMapper imageMapper;

    public ImageController(ImageService imageService, ImageMapper imageMapper) {
        this.imageService = imageService;
        this.imageMapper = imageMapper;
    }

    @PostMapping(value = "/{id}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<List<ImageResponse>> addImagesToProperty(
            @PathVariable Long id,
            @RequestPart("images") List<MultipartFile> images)
    {

        List<Image> savedImages = imageService.addImagesToProperty(id, images);
        List<ImageResponse> dtos = imageMapper.toDTOList(savedImages);
        return new ResponseEntity<>(dtos, HttpStatus.CREATED);
    }

    @DeleteMapping("/images/{id}")
    public ResponseEntity<Void> deleteImage(@PathVariable Long id) {
        imageService.deleteImage(id);
        return ResponseEntity.noContent().build();
    }
}