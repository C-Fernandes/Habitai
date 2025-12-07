package com.imd.habitai.controller;

import com.imd.habitai.dto.request.ReviewCreateRequest;
import com.imd.habitai.dto.response.ReviewResponse;
import com.imd.habitai.service.ReviewService;
import jakarta.validation.Valid;

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

    ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping("/{userId}")
    public ResponseEntity<ReviewResponse> createReview(
            @Valid @RequestBody ReviewCreateRequest dto,
            @PathVariable Long userId
    ) {
        ReviewResponse createdReview = reviewService.createReview(userId, dto);
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

    @PutMapping("/{userId}/{id}")
    public ResponseEntity<ReviewResponse> updateReview(
            @PathVariable Long id,
            @Valid @RequestBody ReviewCreateRequest dto,
            @PathVariable Long userId
    ) {
        ReviewResponse updatedReview = reviewService.updateReview(userId, id, dto);
        return ResponseEntity.ok(updatedReview);
    }

    @DeleteMapping("/{userId}/{id}")
    public ResponseEntity<Void> deleteReview(
            @PathVariable Long id,
            @PathVariable Long userId
    ) {
        reviewService.deleteReview(userId, id);
        return ResponseEntity.noContent().build();
    }
}