package com.imd.habitai.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.imd.habitai.model.Contract;
import com.imd.habitai.model.Property;
import com.imd.habitai.model.User;

public interface ContractRepository extends JpaRepository<Contract, Long>{
    public List<Contract> findAllByOwner(User owner);
    public List<Contract> findAllByTenant(User tenant);
    public List<Contract> findAllByProperty(Property property);
    public boolean existsByTenantIdAndPropertyId(Long userId, Long propertyId);
}
