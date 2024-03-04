package com.web.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.parameters.P;

import javax.persistence.*;
import java.sql.Date;
import java.sql.Time;
import java.util.List;

@Entity
@Table(name = "product_comment")
@Getter
@Setter
public class ProductComment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    private String content;

    private Date createdDate;

    private Time createdTime;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Transient
    private Boolean myComment = false;
}
