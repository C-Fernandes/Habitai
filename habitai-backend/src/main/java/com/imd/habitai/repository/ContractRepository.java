package com.imd.habitai.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.imd.habitai.model.Contract;

public interface ContractRepository extends JpaRepository<Contract, Long>{
    
}
