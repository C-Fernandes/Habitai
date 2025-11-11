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

import com.imd.habitai.dto.request.ContractCreateRequest;
import com.imd.habitai.dto.request.ContractUpdateRequest;
import com.imd.habitai.dto.response.ContractResponse;
import com.imd.habitai.service.ContractService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/contracts")
public class ContractController {
    
    private final ContractService contractService;

    public ContractController(
        ContractService contractService
    ){
        this.contractService = contractService;
    }


    @PostMapping
    public ResponseEntity<ContractResponse> createContract(
        @Valid @RequestBody ContractCreateRequest contractRequest
    ){
        ContractResponse newContract = contractService.create(contractRequest);
        return new ResponseEntity<>(newContract, HttpStatus.CREATED);
    }
    

    @GetMapping("/{id}")
    public ResponseEntity<ContractResponse> getContractsById(@PathVariable Long id){
        ContractResponse contractsResponse = contractService.findById(id);
        return new ResponseEntity<>(contractsResponse, HttpStatus.OK);
    }

    @GetMapping("/byOwner/{id}")
    public ResponseEntity<List<ContractResponse>> getAllContractsByOwner(@PathVariable Long id){
        List<ContractResponse> contractsResponse = contractService.findAllByOwner(id);
        return new ResponseEntity<>(contractsResponse, HttpStatus.OK);
    }

    @GetMapping("/byTenant/{id}")
    public ResponseEntity<List<ContractResponse>> getAllContractsByTenant(@PathVariable Long id){
        List<ContractResponse> contractsResponse = contractService.findAllByTenant(id);
        return new ResponseEntity<>(contractsResponse, HttpStatus.OK);
    }

     @GetMapping("/byProperty/{id}")
    public ResponseEntity<List<ContractResponse>> getAllContractsByProperty(@PathVariable Long id){
        List<ContractResponse> contractsResponse = contractService.findAllByProperty(id);
        return new ResponseEntity<>(contractsResponse, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ContractResponse> updateContract(
        @PathVariable Long id,
        @Valid @RequestBody ContractUpdateRequest contractRequest
    ){
        ContractResponse contractResponse = contractService.update(id, contractRequest);
        return new ResponseEntity<>(contractResponse, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContract(@PathVariable Long id){
        if (contractService.delete(id)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
