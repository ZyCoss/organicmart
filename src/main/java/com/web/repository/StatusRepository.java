package com.web.repository;

import com.web.entity.Category;
import com.web.entity.Status;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StatusRepository extends JpaRepository<Status,Long> {
}
