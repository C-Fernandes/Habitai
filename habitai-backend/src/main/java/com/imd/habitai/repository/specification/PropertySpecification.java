package com.imd.habitai.repository.specification;

import com.imd.habitai.model.Address;
import com.imd.habitai.model.Property;
import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;

public class PropertySpecification {

    public static Specification<Property> filterBy(
        String city, 
        String neighborhood, 
        BigDecimal maxPrice,
        BigDecimal minPrice
    ){
        Specification<Property> spec = (root, query, cb) -> cb.conjunction();

        if (StringUtils.hasText(city)) spec = spec.and(hasCity(city));
        if (StringUtils.hasText(neighborhood)) spec = spec.and(hasNeighborhood(neighborhood));
        if (maxPrice != null) spec = spec.and(hasMaxPrice(maxPrice));
        if (minPrice != null) spec = spec.and(hasMinPrice(minPrice));

        return spec;
    }

    private static Specification<Property> hasCity(String city) {
        return (root, query, cb) -> {
            Join<Property, Address> addressJoin = root.join("address");
            return cb.like(
                cb.lower(addressJoin.get("city")),
                "%" + city.toLowerCase() + "%");
        };
    }

    private static Specification<Property> hasNeighborhood(String neighborhood) {
        return (root, query, cb) -> {
            Join<Property, Address> addressJoin = root.join("address");
            return cb.like(
                cb.lower(addressJoin.get("neighborhood")),
                "%" + neighborhood.toLowerCase() + "%");
        };
    }

    private static Specification<Property> hasMaxPrice(BigDecimal maxPrice) {
        return (root, query, cb) -> {
            return cb.lessThanOrEqualTo(root.get("rentalPrice"), maxPrice);
        };
    }

    private static Specification<Property> hasMinPrice(BigDecimal minPrice) {
        return (root, query, cb) -> {
            return cb.greaterThanOrEqualTo(root.get("rentalPrice"), minPrice);
        };
    }
}