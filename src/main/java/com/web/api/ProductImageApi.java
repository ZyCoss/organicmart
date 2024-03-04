package com.web.api;

import com.web.repository.ProductImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class ProductImageApi {

    @Autowired
    private ProductImageRepository productImageRepository;

    @DeleteMapping("/admin/deleteImageProduct")
    public void deleteProduct(@RequestParam("id") Long id){
        productImageRepository.deleteById(id);
    }
}
