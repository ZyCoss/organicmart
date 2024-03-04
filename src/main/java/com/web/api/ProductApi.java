package com.web.api;

import com.web.dto.ProductDto;
import com.web.dto.SearchProduct;
import com.web.entity.Product;
import com.web.entity.ProductImage;
import com.web.exception.MessageException;
import com.web.repository.ProductImageRepository;
import com.web.repository.ProductRepository;
import com.web.utils.CommonPage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.math.BigInteger;
import java.sql.Timestamp;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class ProductApi {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductImageRepository productImageRepository;

    @Autowired
    private CommonPage commonPage;

    @Autowired
    EntityManager em;

    @GetMapping("/public/allproduct")
    public List<Product> findAll(@RequestParam(value = "idCategory", required = false) Long idCategory){
        if(idCategory != null){
            return productRepository.findByCategory(idCategory);
        }
        return productRepository.findAllDesc();
    }

    @GetMapping("/public/productByID")
    public Product findById(@RequestParam("id") Long id){
        return productRepository.findById(id).get();
    }

    @DeleteMapping("/admin/deleteProduct")
    public void deleteProduct(@RequestParam("id") Long id){
        try {
            productRepository.deleteById(id);
        }
        catch (Exception e){
            Product p = productRepository.findById(id).get();
            p.setDeleted(true);
            productRepository.save(p);
        }
    }


    @PostMapping("/admin/addOrUpdateproduct")
    public Product save(@RequestBody ProductDto productDto){
        Product product = productDto.getProduct();
        if(product.getId() == null){
            product.setCreatedDate(new Timestamp(System.currentTimeMillis()));
            product.setDeleted(false);
            product.setQuantity(0);
            product.setQuantitySold(0);
        }
        else{
            Product p = productRepository.findById(product.getId()).get();
            product.setDeleted(p.getDeleted());
            product.setCreatedDate(p.getCreatedDate());
            product.setQuantity(p.getQuantity());
            product.setQuantitySold(p.getQuantitySold());
        }
        Product result = productRepository.save(product);

        for(String link : productDto.getLinkImage()){
            ProductImage productImage = new ProductImage();
            productImage.setLinkImage(link);
            productImage.setProduct(result);
            productImageRepository.save(productImage);
        }
        return result;
    }

    @GetMapping("/public/product-best-sell")
    public List<Product> productBestSell(){
        List<Product> list = productRepository.productBestSell();
        return list;
    }

    @GetMapping("/public/product-by-param")
    public ResponseEntity<?> getProductIndexPage(@RequestParam(value = "search", required = false) String search,Pageable pageable){
        if(search == null){
            search = "";
        }
        Page<Product> page = productRepository.findByParam("%"+search+"%", pageable);
        return new ResponseEntity<>(page, HttpStatus.OK);
    }

    @GetMapping("/public/product-by-category-id")
    public Page<Product> findByCategory(@RequestParam("id") Long categoryid, Pageable pageable){
        Page<Product> page = productRepository.findByCategory(categoryid, pageable);
        return page;
    }

    @PostMapping("/public/search-full-product")
    public Page<Product> searchFull(@RequestBody SearchProduct searchProduct, Pageable pageable){
        Double smallPrice = searchProduct.getSmallPrice();
        Double largePrice = searchProduct.getLargePrice();
        List<Long> listIdCategory = searchProduct.getListIdCategory();
        if(smallPrice == null || largePrice == null){
            smallPrice = 0D;
            largePrice = 1000000000D;
        }
        String sql = "select p.* from Product p where (p.price >= ?1 and p.price <= ?2) ";
        String sqlCount = "select count(*) from Product p where (p.price >= ?1 and p.price <= ?2) ";
        if(listIdCategory.size() > 0){
            sql += " and (";
            sqlCount += " and (";
            for(int i=0; i<listIdCategory.size(); i++){
                var x=i+3;
                sql += " p.category_id = ?"+x;
                sqlCount += " p.category_id = ?"+x;
                if(i < listIdCategory.size() - 1){
                    sql += " or";
                    sqlCount += " or";
                }
            }
            sql += ") ";
            sqlCount += ") ";
        }
        System.out.println("sql count 1"+sqlCount);
        System.out.println("==========> total sql: "+sql);
        Query query = em.createNativeQuery(sql, Product.class);
        Query queryCount = em.createNativeQuery(sqlCount);

        query.setParameter(1,smallPrice);
        query.setParameter(2,largePrice);

        queryCount.setParameter(1,smallPrice);
        queryCount.setParameter(2,largePrice);

        if(listIdCategory != null){
            if(listIdCategory.size() > 0){
                for(int i=0; i<listIdCategory.size(); i++){
                    var x=i+3;
                    query.setParameter(x, listIdCategory.get(i));
                    queryCount.setParameter(x, listIdCategory.get(i));
                }
            }
        }
        query.setMaxResults(pageable.getPageSize());
        query.setFirstResult(pageable.getPageNumber() * pageable.getPageSize());
        List<Product> list = query.getResultList();
        System.out.println("sql count "+sqlCount);
        BigInteger total = (BigInteger) queryCount.getSingleResult();
        System.out.println("==========> total elm: "+total);
        Page<Product> page = new PageImpl<>(list,pageable,total.longValue());

        return page;
    }


}
