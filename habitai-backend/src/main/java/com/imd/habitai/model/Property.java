package com.imd.habitai.model;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;



import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
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