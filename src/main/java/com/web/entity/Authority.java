package com.web.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;

@Entity
@Table(name = "authority")
@Getter
@Setter
@ToString
public class Authority {

    @Id
    private String name;

}
