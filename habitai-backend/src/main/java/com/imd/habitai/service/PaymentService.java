package com.imd.habitai.service;

import java.util.List;

import org.springframework.stereotype.Service;
import com.imd.habitai.dto.request.PaymentCreateRequest;
import com.imd.habitai.dto.request.PaymentUpdateRequest;
import com.imd.habitai.dto.response.PaymentResponse;
import com.imd.habitai.mapper.PaymentMapper;
import com.imd.habitai.model.Contract;
import com.imd.habitai.model.Payment;
import com.imd.habitai.repository.ContractRepository;
import com.imd.habitai.repository.PaymentRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final PaymentMapper paymentMapper;
    private final ContractRepository contractRepository;

    public PaymentService(
        PaymentRepository paymentRepository,
        PaymentMapper paymentMapper,
        ContractRepository contractRepository
    ){
        this.paymentRepository = paymentRepository;
        this.paymentMapper = paymentMapper;
        this.contractRepository = contractRepository;
    }

    public PaymentResponse create(PaymentCreateRequest request){
        Payment payment = paymentMapper.toEntity(request);
        Contract contract = contractRepository.findById(request.idContract())
            .orElseThrow(() -> new EntityNotFoundException("Contrato com ID " + request.idContract() + " não encontrado."));

        payment.setContract(contract);

        Payment savedPayment = paymentRepository.save(payment);
        
        return paymentMapper.toResponse(savedPayment);
    }

    public List<PaymentResponse> findByContract(Long idContract){
        Contract contract = contractRepository.findById(idContract)
            .orElseThrow(()-> new EntityNotFoundException("Contrato com ID ("+idContract+") não encontrado."));

        List<Payment> payments = paymentRepository.findByContract(contract);

        return paymentMapper.toResponseList(payments);
    }

    public PaymentResponse update(Long id, PaymentUpdateRequest request){
        Payment existingPayment = paymentRepository.findById(id)
            .orElseThrow(()-> new EntityNotFoundException("Pagamento com ID (" + id + ") não foi encontrado."));
        
        if (request.dueDate() != null) {
            existingPayment.setDueDate(request.dueDate());
        }

        if (request.paymentDate() != null) {
            existingPayment.setPaymentDate(request.paymentDate());
        }

        if (request.amountDue() != null) {
            existingPayment.setAmountDue(request.amountDue());
        }

        if (request.amountPaid() != null) {
            existingPayment.setAmountPaid(request.amountPaid());
        }

        if (request.status() != null) {
            existingPayment.setStatus(request.status());
        }

        Payment savedPayment = paymentRepository.save(existingPayment);

        return paymentMapper.toResponse(savedPayment);
    }

    public boolean delete(Long id){
        if (paymentRepository.existsById(id)) {
            paymentRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
