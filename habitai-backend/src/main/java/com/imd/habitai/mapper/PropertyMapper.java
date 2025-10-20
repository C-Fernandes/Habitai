package com.imd.habitai.mapper;

import com.imd.habitai.dto.PropertyRequestDTO;
import com.imd.habitai.dto.PropertyResponseDTO;
import com.imd.habitai.model.Address;
import com.imd.habitai.model.Amenity;
import com.imd.habitai.model.Property;
import com.imd.habitai.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface PropertyMapper {

    @Mapping(source = "ownerId", target = "owner", qualifiedByName = "mapOwnerIdToUser")
    @Mapping(source = "amenityIds", target = "amenities", qualifiedByName = "mapAmenityIdsToAmenities")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "contracts", ignore = true)
    @Mapping(target = "inspections", ignore = true)
    @Mapping(target = "visits", ignore = true)
    Property toEntity(PropertyRequestDTO dto);

    PropertyResponseDTO toDTO(Property property);

    PropertyResponseDTO.OwnerDTO toOwnerDTO(User owner);

    PropertyResponseDTO.AddressDTO toAddressDTO(Address address);

    @Named("mapOwnerIdToUser")
    default User mapOwnerIdToUser(Long ownerId) {
        if (ownerId == null) {
            return null;
        }
        User user = new User();
        user.setId(ownerId);
        return user;
    }

    @Named("mapAmenityIdsToAmenities")
    default List<Amenity> mapAmenityIdsToAmenities(List<Long> amenityIds) {
        if (amenityIds == null || amenityIds.isEmpty()) {
            return null;
        }
        return amenityIds.stream()
            .map(id -> {
                Amenity amenity = new Amenity();
                amenity.setId(id);
                return amenity;
            })
            .collect(Collectors.toList());
    }
}