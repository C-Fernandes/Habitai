package com.imd.habitai.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.imd.habitai.model.Contract;
import com.imd.habitai.model.Payment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    public List<Payment> findByContract(Contract contract);
}
