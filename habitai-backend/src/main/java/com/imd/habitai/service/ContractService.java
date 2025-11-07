package com.imd.habitai.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.stereotype.Service;

import com.imd.habitai.dto.request.ContractCreateRequest;
import com.imd.habitai.dto.response.ContractResponse;
import com.imd.habitai.mapper.ContractMapper;
import com.imd.habitai.mapper.PaymentMapper;
import com.imd.habitai.model.Contract;
import com.imd.habitai.model.Payment;
import com.imd.habitai.model.User;
import com.imd.habitai.repository.ContractRepository;
import com.imd.habitai.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;


@Service
public class ContractService {
    private final ContractRepository contractRepository;
    private final ContractMapper contractMapper;
    private final PaymentMapper paymentMapper;
    private final UserRepository userRepository;

    public ContractService(
        ContractRepository repository,
        ContractMapper contractMapper,
        UserRepository userRepository,
        PaymentMapper paymentMapper
    ){
        this.contractRepository = repository;
        this.contractMapper = contractMapper;
        this.userRepository = userRepository;
        this.paymentMapper = paymentMapper;
    }

    public ContractResponse create(ContractCreateRequest contractDTO) throws NotFoundException{
        Contract contract = contractMapper.toEntity(contractDTO);
        List<Payment> payments = paymentMapper.toEntityList(contractDTO.payments());
        
        User tenant = userRepository.findById(contractDTO.tenantId()).orElseThrow(() -> new EntityNotFoundException("Usuário (inquilino) com ID " + contractDTO.tenantId() + " não encontrado."));
        User owner = userRepository.findById(contractDTO.ownerId()).orElseThrow(() -> new EntityNotFoundException("Usuário (dono do contrato) com ID " + contractDTO.ownerId() + " não encontrado."));
        
        contract.setPayments(payments);
        contract.setTenant(tenant);
        contract.setOwner(owner);

        Contract savedContract = contractRepository.save(contract);
        return contractMapper.toDTO(savedContract);
    }

}
