package com.imd.habitai.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.imd.habitai.model.User;
import com.imd.habitai.model.Visit;

public interface VisitRepository extends JpaRepository<Visit, Long> {

    List<Visit> findAllByPropertyOwner(User owner);
}