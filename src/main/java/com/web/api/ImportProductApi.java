package com.web.api;

import com.web.entity.ImportProduct;
import com.web.entity.Product;
import com.web.exception.MessageException;
import com.web.repository.ImportProductRepository;
import com.web.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.sql.Time;
import java.sql.Timestamp;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class ImportProductApi {

    @Autowired
    private ImportProductRepository importProductRepository;

    @Autowired
    private ProductRepository productRepository;

    @PostMapping("/admin/createImportProduct")
    public ResponseEntity<?> create(@RequestBody ImportProduct importProduct){
        ImportProduct result = null;
        Product product = productRepository.findById(importProduct.getProduct().getId()).get();
        if(importProduct.getId() == null){
            importProduct.setImportDate(new Timestamp(System.currentTimeMillis()));
            product.setQuantity(product.getQuantity() + importProduct.getQuantity());
            result = importProductRepository.save(importProduct);
            productRepository.save(product);
        }
        else{
            ImportProduct imp = importProductRepository.findById(importProduct.getId()).get();
            product.setQuantity(product.getQuantity() - imp.getQuantity());
            product.setQuantity(product.getQuantity() + importProduct.getQuantity());
            productRepository.save(product);
            importProduct.setImportDate(imp.getImportDate());
            result = importProductRepository.save(importProduct);
        }
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @DeleteMapping("/admin/deleteImportProduct")
    public ResponseEntity<?> update(@RequestParam("id") Long id){
        ImportProduct imp = importProductRepository.findById(id).get();
        Product product = imp.getProduct();
        product.setQuantity(product.getQuantity() - imp.getQuantity());
        if(product.getQuantity() < 0){
            throw new MessageException("Số lượng sản phẩm không thể nhỏ hơn 0");
        }
        productRepository.save(product);
        importProductRepository.delete(imp);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/admin/findAllImportProduct")
    public ResponseEntity<?> findAll(){
        List<ImportProduct> importProducts = importProductRepository.findAllDesc();
        return new ResponseEntity<>(importProducts,HttpStatus.OK);
    }

    @GetMapping("/admin/findImportProductByProductAndDate")
    public ResponseEntity<?> findAll(@RequestParam(value = "idproduct", required = false) Long idProduct,
                                     @RequestParam(value = "from", required = false) Date fromDate,
                                     @RequestParam(value = "to", required = false) Date toDate){
        Timestamp from = null;
        Timestamp to = null;
        List<ImportProduct> list = null;
        if(fromDate == null || toDate == null){
            from = new Timestamp(Date.valueOf("2000-01-01").getTime());
            to = new Timestamp(Date.valueOf("2100-01-01").getTime());
        }
        else{
            from = new Timestamp(fromDate.getTime());
            to = new Timestamp(toDate.getTime());
        }
        if(idProduct == null){
            list = importProductRepository.findByDate(from, to);
        }
        else{
            list = importProductRepository.findByDateAndProduct(from, to, idProduct);
        }
        return new ResponseEntity<>(list,HttpStatus.OK);
    }

    @GetMapping("/admin/findImportProductById")
    public ResponseEntity<?> findById(@RequestParam("id") Long id){
        ImportProduct result = importProductRepository.findById(id).get();
        return new ResponseEntity<>(result,HttpStatus.OK);
    }
}
