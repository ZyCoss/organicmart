package com.web.repository;

import com.web.entity.Category;
import com.web.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product,Long> {

    @Query(value = "select p from Product p where p.deleted = false order by p.id desc ")
    public List<Product> findAllDesc();

    @Query(value = "select p from Product p where p.deleted = false and p.category.id = ?1 order by p.id desc ")
    public List<Product> findByCategory(Long idCategory);

    @Query(value = "select p from Product p where p.deleted = false and p.category.id = ?1 order by p.id desc ")
    public Page<Product> findByCategory(Long idCategory, Pageable pageable);

    @Query("select p from Product p where p.name like ?1 or p.category.name like ?1 or p.code like ?1")
    public Page<Product> findByParam(String search, Pageable pageable);

    @Query(value = "select (SELECT SUM(i.quantity) from invoice_detail i where i.product_id = p.id) as soluong, p.*\n" +
            "from product p order by soluong desc limit 4",nativeQuery = true)
    public List<Product> productBestSell();
}
