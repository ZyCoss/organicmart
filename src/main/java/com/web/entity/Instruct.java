package com.web.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.sql.Date;

@Entity
@Table(name = "instruct")
@Getter
@Setter
public class Instruct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    private Date createdDate;

    private String title;

    private String description;

    private String content;

    private String imageBanner;

    private Integer numView;
}
