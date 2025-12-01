package com.imd.habitai.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.imd.habitai.model.Contract;
import com.imd.habitai.model.Property;
import com.imd.habitai.model.User;

public interface ContractRepository extends JpaRepository<Contract, Long>{
    public List<Contract> findAllByOwner(User owner);
    public List<Contract> findAllByTenant(User tenant);
    public List<Contract> findAllByProperty(Property property);

    @Query(value = """
    SELECT EXISTS (
        SELECT 1 
        FROM contracts 
        WHERE tenant_id = :userId 
          AND property_id = :propertyId
    )
    """, nativeQuery = true)
    boolean existsByTenantIdAndPropertyId(@Param("userId") Long userId, @Param("propertyId") Long propertyId);
}
