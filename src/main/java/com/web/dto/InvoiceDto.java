package com.web.dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class InvoiceDto {

    private String fullname;

    private String phone;

    private String address;

    private String note;

    private Boolean isMomo;

    private String orderId;

    private String requestId;

    private List<ProductPayment> productPayments = new ArrayList<>();
}
