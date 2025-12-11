package com.imd.habitai.controller;

import com.imd.habitai.dto.request.ReviewCreateRequest;
import com.imd.habitai.dto.response.ReviewResponse;
import com.imd.habitai.model.User;
import com.imd.habitai.repository.UserRepository;
import com.imd.habitai.service.ReviewService;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;

import java.security.Principal;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/reviews")
public class ReviewController {

    private final ReviewService reviewService;
    private final UserRepository userRepository;

    ReviewController(ReviewService reviewService, UserRepository userRepository) {
        this.reviewService = reviewService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<ReviewResponse> createReview(
            @Valid @RequestBody ReviewCreateRequest dto,
            Principal principal
    ) {
        String email = principal.getName();
        User user =  userRepository.findByEmail(email).orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));
        ReviewResponse createdReview = reviewService.createReview(user.getId(), dto);
        return new ResponseEntity<>(createdReview, HttpStatus.CREATED);
    }

    @GetMapping("/property/{propertyId}")
    public ResponseEntity<Page<ReviewResponse>> getReviewsByProperty(
            @PathVariable Long propertyId,
            @PageableDefault(size = 5, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<ReviewResponse> reviews = reviewService.getReviewsByProperty(propertyId, pageable);
        return ResponseEntity.ok(reviews);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReviewResponse> updateReview(
            @PathVariable Long id,
            @Valid @RequestBody ReviewCreateRequest dto,
            Principal principal
    ) {
        String email = principal.getName();
        User user =  userRepository.findByEmail(email).orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));
        ReviewResponse updatedReview = reviewService.updateReview(user.getId(), id, dto);
        return ResponseEntity.ok(updatedReview);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(
            @PathVariable Long id,
            Principal principal
    ) {
        String email = principal.getName();
        User user =  userRepository.findByEmail(email).orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));
        reviewService.deleteReview(user.getId(), id);
        return ResponseEntity.noContent().build();
    }
}