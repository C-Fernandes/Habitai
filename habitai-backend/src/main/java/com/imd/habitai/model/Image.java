package com.imd.habitai.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "images")
@Data
public class Image {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String imagePath;

    @Column(nullable = false)
    private String contentType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

}