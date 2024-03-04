package com.web.entity;


import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "statuses")
@Getter
@Setter
public class Status {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    private String name;

}
