package com.imd.habitai.model;

import jakarta.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "images")
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



    public Image() {
    }

    public Image(Long id, String imagePath, String contentType, Property property) {
        this.id = id;
        this.imagePath = imagePath;
        this.contentType = contentType;
        this.property = property;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getImagePath() {
        return this.imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    public String getContentType() {
        return this.contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public Property getProperty() {
        return this.property;
    }

    public void setProperty(Property property) {
        this.property = property;
    }

    public Image id(Long id) {
        setId(id);
        return this;
    }

    public Image imagePath(String imagePath) {
        setImagePath(imagePath);
        return this;
    }

    public Image contentType(String contentType) {
        setContentType(contentType);
        return this;
    }

    public Image property(Property property) {
        setProperty(property);
        return this;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this)
            return true;
        if (!(o instanceof Image)) {
            return false;
        }
        Image image = (Image) o;
        return Objects.equals(id, image.id) && Objects.equals(imagePath, image.imagePath) && Objects.equals(contentType, image.contentType) && Objects.equals(property, image.property);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, imagePath, contentType, property);
    }

    @Override
    public String toString() {
        return "{" +
            " id='" + getId() + "'" +
            ", imagePath='" + getImagePath() + "'" +
            ", contentType='" + getContentType() + "'" +
            ", property='" + getProperty() + "'" +
            "}";
    }
    

}