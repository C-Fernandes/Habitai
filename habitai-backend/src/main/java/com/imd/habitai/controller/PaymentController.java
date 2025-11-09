package com.imd.habitai.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.imd.habitai.dto.request.PaymentCreateRequest;
import com.imd.habitai.dto.request.PaymentUpdateRequest;
import com.imd.habitai.dto.response.PaymentResponse;
import com.imd.habitai.service.PaymentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/payments")
public class PaymentController {
    private final PaymentService paymentService;

    public PaymentController(
        PaymentService paymentService
    ) {
        this.paymentService = paymentService;
    }


    @PostMapping
    public ResponseEntity<PaymentResponse> createPayment(
        @Valid @RequestBody
        PaymentCreateRequest paymentRequest
    ){
        PaymentResponse newPayment = paymentService.create(paymentRequest);
        return new ResponseEntity<>(newPayment, HttpStatus.CREATED);
    }

    @GetMapping("/byContract/{id}")
    public ResponseEntity<List<PaymentResponse>> getAllPaymentsByContract(@PathVariable Long id){
        List<PaymentResponse> paymentResponses = paymentService.findByContract(id);
        
        return new ResponseEntity<List<PaymentResponse>>(paymentResponses, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PaymentResponse> updatePayment(
        @PathVariable Long id,
        @Valid @RequestBody PaymentUpdateRequest request
    ){
        PaymentResponse paymentResponses = paymentService.update(id, request);
        return new ResponseEntity<PaymentResponse>(paymentResponses, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable Long id){
        if(paymentService.delete(id)){
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
