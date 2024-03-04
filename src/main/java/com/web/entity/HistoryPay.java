package com.web.entity;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.sql.Date;
import java.sql.Time;

@Entity
@Table(name = "HistoryPay")
@Getter
@Setter
public class HistoryPay {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    private Double totalAmount;

    private Date createdDate;

    private Time createdTime;

    private String requestId;

    private String orderId;

    @ManyToOne
    @JoinColumn(name = "invoice_id")
    private Invoice invoice;
}
