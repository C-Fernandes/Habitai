package com.imd.habitai.service;

import com.imd.habitai.dto.request.ReviewCreateRequest;
import com.imd.habitai.dto.response.ReviewResponse;
import com.imd.habitai.mapper.ReviewMapper;
import com.imd.habitai.model.Property;
import com.imd.habitai.model.Review;
import com.imd.habitai.model.User;
import com.imd.habitai.repository.ContractRepository;
import com.imd.habitai.repository.PropertyRepository;
import com.imd.habitai.repository.ReviewRepository;
import com.imd.habitai.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ContractRepository contractRepository;
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;
    private final ReviewMapper reviewMapper;

    public ReviewService(ReviewRepository reviewRepository,
                         ContractRepository contractRepository,
                         PropertyRepository propertyRepository,
                         UserRepository userRepository,
                         ReviewMapper reviewMapper) {
        this.reviewRepository = reviewRepository;
        this.contractRepository = contractRepository;
        this.propertyRepository = propertyRepository;
        this.userRepository = userRepository;
        this.reviewMapper = reviewMapper;
    }

    @Transactional(readOnly = true)
    public Page<ReviewResponse> getReviewsByProperty(Long propertyId, Pageable pageable) {
        return reviewRepository.findByPropertyId(propertyId, pageable)
                .map(reviewMapper::toDTO);
    }

    @Transactional
    public ReviewResponse createReview(Long userId, ReviewCreateRequest dto) {

        boolean hasContract = contractRepository.existsByTenantIdAndPropertyId(userId, dto.propertyId());
        
        if (!hasContract) {
            throw new IllegalArgumentException("Você só pode avaliar imóveis que já alugou ou tem contrato ativo.");
        }

        if (reviewRepository.existsByAuthorIdAndPropertyId(userId, dto.propertyId())) {
            throw new IllegalArgumentException("Você já enviou uma avaliação para este imóvel.");
        }

        User author = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado."));
        
        Property property = propertyRepository.findById(dto.propertyId())
                .orElseThrow(() -> new EntityNotFoundException("Imóvel não encontrado."));

        Review review = new Review();
        review.setAuthor(author);
        review.setProperty(property);
        review.setRating(dto.rating());
        review.setComment(dto.comment());

        reviewRepository.save(review);

        updatePropertyStats(property);

        return reviewMapper.toDTO(review);
    }

    @Transactional
    public ReviewResponse updateReview(Long userId, Long reviewId, ReviewCreateRequest dto) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new EntityNotFoundException("Avaliação não encontrada."));

        if (!review.getAuthor().getId().equals(userId)) {
            throw new IllegalArgumentException("Você não tem permissão para editar esta avaliação.");
        }

        review.setRating(dto.rating());
        review.setComment(dto.comment());
        
        reviewRepository.save(review);

        updatePropertyStats(review.getProperty());

        return reviewMapper.toDTO(review);
    }

    @Transactional
    public void deleteReview(Long userId, Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new EntityNotFoundException("Avaliação não encontrada."));

        if (!review.getAuthor().getId().equals(userId)) {
            throw new IllegalArgumentException("Você não tem permissão para deletar esta avaliação.");
        }
        
        Property property = review.getProperty();

        reviewRepository.delete(review);

        updatePropertyStats(property);
    }

    private void updatePropertyStats(Property property) {
        List<Review> reviews = reviewRepository.findByPropertyId(property.getId(), Pageable.unpaged()).getContent();

        if (reviews.isEmpty()) {
            property.setAverageRating(0.0);
            property.setReviewCount(0);
        } else {
            double average = reviews.stream()
                    .mapToInt(Review::getRating)
                    .average()
                    .orElse(0.0);
            
            double roundedAverage = Math.round(average * 10.0) / 10.0;

            property.setAverageRating(roundedAverage);
            property.setReviewCount(reviews.size());
        }

        propertyRepository.save(property);
    }
}