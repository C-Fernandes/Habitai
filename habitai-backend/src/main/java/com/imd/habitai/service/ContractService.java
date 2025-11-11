package com.imd.habitai.service;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.imd.habitai.dto.request.ContractCreateRequest;
import com.imd.habitai.dto.request.ContractUpdateRequest;
import com.imd.habitai.dto.response.ContractResponse;
import com.imd.habitai.enums.PropertyStatus;
import com.imd.habitai.mapper.ContractMapper;
import com.imd.habitai.mapper.PaymentMapper;
import com.imd.habitai.model.Contract;
import com.imd.habitai.model.Payment;
import com.imd.habitai.model.Property;
import com.imd.habitai.model.User;
import com.imd.habitai.repository.ContractRepository;
import com.imd.habitai.repository.PropertyRepository;
import com.imd.habitai.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;


@Service
public class ContractService {
    private final ContractRepository contractRepository;
    private final ContractMapper contractMapper;
    private final PaymentMapper paymentMapper;
    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;

    public ContractService(
        ContractRepository repository,
        ContractMapper contractMapper,
        UserRepository userRepository,
        PaymentMapper paymentMapper,
        PropertyRepository propertyRepository
    ){
        this.contractRepository = repository;
        this.contractMapper = contractMapper;
        this.userRepository = userRepository;
        this.paymentMapper = paymentMapper;
        this.propertyRepository = propertyRepository;
    }

    public ContractResponse create(ContractCreateRequest contractRequest){
        Contract contract = contractMapper.toEntity(contractRequest);
        List<Payment> payments = paymentMapper.toEntityList(contractRequest.payments());
        
        User tenant = userRepository.findByCpfAndIsActiveTrue(contractRequest.tenantCpf()).orElseThrow(() -> new EntityNotFoundException("Usuário (inquilino) com CPF " + contractRequest.tenantCpf() + " não encontrado."));
        User owner = userRepository.findByCpfAndIsActiveTrue(contractRequest.ownerCpf()).orElseThrow(() -> new EntityNotFoundException("Usuário (dono do contrato) com CPF " + contractRequest.ownerCpf() + " não encontrado."));
        Property property = propertyRepository.findById(contractRequest.propertyId()).orElseThrow(() -> new EntityNotFoundException("Propriedade com ID " + contractRequest.propertyId() + " não encontrada."));

        property.setStatus(PropertyStatus.RENTED);
        
        contract.setPayments(payments);
        contract.setTenant(tenant);
        contract.setOwner(owner);
        contract.setProperty(property);

        Contract savedContract = contractRepository.save(contract);
        return contractMapper.toResponse(savedContract);
    }

    public ContractResponse findById(Long id){
        Contract contract = contractRepository.findById(id)
            .orElseThrow(()-> new EntityNotFoundException("Contrato de ID ("+id+") não encontrado."));

        return contractMapper.toResponse(contract);
    }

    @Transactional(readOnly = true)
    public List<ContractResponse> findAllByOwner(Long ownerId){
        User owner = userRepository.findById(ownerId).orElseThrow(()-> new EntityNotFoundException("Usuário de CPF ("+ownerId+") não encontrado."));
        List<Contract> contracts = contractRepository.findAllByOwner(owner);

        return contractMapper.toListResponses(contracts);
    }

    @Transactional(readOnly = true)
    public List<ContractResponse> findAllByTenant(Long tenantId){
        User tenant = userRepository.findById(tenantId).orElseThrow(()-> new EntityNotFoundException("Usuário de CPF ("+tenantId+") não encontrado."));
        List<Contract> contracts = contractRepository.findAllByTenant(tenant);

        return contractMapper.toListResponses(contracts);
    } 

    public List<ContractResponse> findAllByProperty(Long idProperty){
        Property property = propertyRepository.findById(idProperty).orElseThrow(()-> new EntityNotFoundException("Propriedade de ID ("+idProperty+") não encontrada."));
        List<Contract> contracts = contractRepository.findAllByProperty(property);

        return contractMapper.toListResponses(contracts);
    } 

    public ContractResponse update(Long id, ContractUpdateRequest updateRequest){
        Contract existingContract = contractRepository.findById(id)
            .orElseThrow(()-> new EntityNotFoundException("Contrato com ID ("+id+") não foi encontrado."));
        
        if (updateRequest.startDate() != null) {
            existingContract.setStartDate(updateRequest.startDate());
        }
        
        if (updateRequest.endDate() != null) {
            existingContract.setEndDate(updateRequest.endDate());
        }
        
        if (updateRequest.monthlyPrice() != null) {
            existingContract.setMonthlyPrice(updateRequest.monthlyPrice());
        }

        if (updateRequest.paymentDueDay() != null) { 
            existingContract.setPaymentDueDay(updateRequest.paymentDueDay());
        }
    
        if (updateRequest.propertyId() != null) {
            Property property = propertyRepository.findById(updateRequest.propertyId())
                .orElseThrow(() -> new EntityNotFoundException("Propriedade com ID ("+updateRequest.propertyId()+") não foi encontrada."));
            existingContract.setProperty(property);
        }

        if (updateRequest.tenantCpf() != null) {
            User tenant = userRepository.findByCpfAndIsActiveTrue(updateRequest.tenantCpf())
                .orElseThrow(() -> new EntityNotFoundException("Inquilino com CPF ("+updateRequest.tenantCpf()+") não foi encontrado."));
            existingContract.setTenant(tenant);
        }

        if (updateRequest.ownerCpf() != null) {
            User owner = userRepository.findByCpfAndIsActiveTrue(updateRequest.ownerCpf())
                .orElseThrow(() -> new EntityNotFoundException("Proprietário com CPF ("+updateRequest.ownerCpf()+") não foi encontrado."));
            existingContract.setOwner(owner);
        }

        if (updateRequest.payments() != null && !updateRequest.payments().isEmpty()) {
            existingContract.setPayments(updateRequest.payments());
        }
  
        Contract updatedContract = contractRepository.save(existingContract);

        return contractMapper.toResponse(updatedContract);
    }

    public boolean delete(Long id){
        if (contractRepository.existsById(id)) {
            contractRepository.deleteById(id);
            return true;
        }
        return false;
    }

}
