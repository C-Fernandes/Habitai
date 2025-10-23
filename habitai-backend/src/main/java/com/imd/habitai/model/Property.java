package com.imd.habitai.model;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "properties")
@Data
public class Property {
  
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Lob 
    private String description;

    @Column(nullable = false)
    private BigDecimal rentalPrice;

    private int bedrooms;
    private int bathrooms;
    private int garageSpaces;
    private double totalArea;

    @ElementCollection
    @CollectionTable(name = "property_image_paths",
            joinColumns = @JoinColumn(name = "property_id"))
    @Column(name = "image_path")
    private List<String> imagePaths;


    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "address_id", referencedColumnName = "id", nullable = false)
    private Address address;

    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @ManyToMany
    @JoinTable(
      name = "property_amenity", 
      joinColumns = @JoinColumn(name = "property_id"), 
      inverseJoinColumns = @JoinColumn(name = "amenity_id"))
    private List<Amenity> amenities;

    @OneToMany(mappedBy = "property")
    private List<Contract> contracts;

    @OneToMany(mappedBy = "property")
    private List<Inspection> inspections;
    
    @OneToMany(mappedBy = "property")
    private List<Visit> visits;
}