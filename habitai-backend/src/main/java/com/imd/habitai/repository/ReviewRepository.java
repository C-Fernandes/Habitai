package com.imd.habitai.repository;

import com.imd.habitai.model.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    
    Page<Review> findByPropertyId(Long propertyId, Pageable pageable);

    boolean existsByAuthorIdAndPropertyId(Long authorId, Long propertyId);
}