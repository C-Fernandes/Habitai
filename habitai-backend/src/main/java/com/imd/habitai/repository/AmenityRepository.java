package com.imd.habitai.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.imd.habitai.model.Amenity;

public interface AmenityRepository extends JpaRepository<Amenity, Long>{}
