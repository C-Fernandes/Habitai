package com.imd.habitai.service;

import org.springframework.stereotype.Service;

import com.imd.habitai.model.Contract;
import com.imd.habitai.repository.ContractRepository;


@Service
public class ContractService {
    private final ContractRepository repository;

    public ContractService(
        ContractRepository repository
    ){
        this.repository = repository;
    }


}
