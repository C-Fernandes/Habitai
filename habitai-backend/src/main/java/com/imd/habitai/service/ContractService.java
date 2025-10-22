package com.imd.habitai.service;

import java.util.Optional;

import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.stereotype.Service;

import com.imd.habitai.dto.request.ContractRequest;
import com.imd.habitai.mapper.ContractMapper;
import com.imd.habitai.model.Contract;
import com.imd.habitai.model.User;
import com.imd.habitai.repository.ContractRepository;
import com.imd.habitai.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;


@Service
public class ContractService {
    private final ContractRepository contractRepository;
    private final ContractMapper contractMapper;
    private final UserRepository userRepository;

    public ContractService(
        ContractRepository repository,
        ContractMapper mapper,
        UserRepository userRepository
    ){
        this.contractRepository = repository;
        this.contractMapper = mapper;
        this.userRepository = userRepository;
    }

    public void create(ContractRequest contractDTO) throws NotFoundException{
        Contract contract = contractMapper.toEntity(contractDTO);
        
        User tenant = userRepository.findById(contractDTO.tenantId()).orElseThrow(() -> new EntityNotFoundException("Usuário (inquilino) com ID " + contractDTO.tenantId() + " não encontrado."));
        User agent = userRepository.findById(contractDTO.agentId()).orElseThrow(() -> new EntityNotFoundException("Usuário (agente imobiliário) com ID " + contractDTO.agentId() + " não encontrado."));
        
        contract.setTenant(tenant);
        contract.setAgent(agent);

        // payments

        contractRepository.save(contract);
    }

}
