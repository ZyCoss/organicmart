package com.web.repository;

import com.web.entity.Category;
import com.web.entity.ImportProduct;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.sql.Timestamp;
import java.util.List;

public interface ImportProductRepository extends JpaRepository<ImportProduct,Long> {

    @Query("select i from ImportProduct i order by i.id desc")
    public List<ImportProduct> findAllDesc();

    @Query("select i from ImportProduct i where i.importDate >= ?1 and i.importDate <= ?2 order by i.id desc")
    public List<ImportProduct> findByDate(Timestamp from, Timestamp to);

    @Query("select i from ImportProduct i where i.importDate >= ?1 and i.importDate <= ?2 and i.product.id = ?3 order by i.id desc")
    public List<ImportProduct> findByDateAndProduct(Timestamp from, Timestamp to, Long productId);
}
