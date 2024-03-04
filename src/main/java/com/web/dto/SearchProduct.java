package com.web.dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class SearchProduct {

    private Double smallPrice;

    private Double largePrice;

    private List<Long> listIdCategory = new ArrayList<>();
}
