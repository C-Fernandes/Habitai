package com.imd.habitai.repository;

import com.imd.habitai.model.Image;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImageRepository extends JpaRepository<Image, Long> {}
