package com.web.repository;

import com.web.entity.Category;
import com.web.entity.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

public interface ProductImageRepository extends JpaRepository<ProductImage,Long> {


}
