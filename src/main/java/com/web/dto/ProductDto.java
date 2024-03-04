package com.web.dto;

import com.web.entity.Product;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class ProductDto {

    private Product product;

    private List<String> linkImage = new ArrayList<>();
}
