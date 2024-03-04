package com.web.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "product_image")
@Getter
@Setter
public class ProductImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    private String linkImage;

    @ManyToOne
    @JoinColumn(name = "product_id")
    @JsonBackReference
    private Product product;
}
