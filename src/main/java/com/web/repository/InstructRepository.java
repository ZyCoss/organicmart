package com.web.repository;

import com.web.entity.ImportProduct;
import com.web.entity.Instruct;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface InstructRepository extends JpaRepository<Instruct,Long> {

    @Query("select i from Instruct i order by i.id desc")
    public List<Instruct> findAllDesc();

    @Query(value = "SELECT i.* from instruct i order by i.id desc limit 1", nativeQuery = true)
    public Optional<Instruct> lastInstruct();

    @Query(value = "SELECT i.* from instruct i where i.id != (select max(it.id) from instruct it) order by i.id desc limit 5", nativeQuery = true)
    public List<Instruct> getInstructIndex();

    @Query("select i from Instruct i where i.title like ?1 or i.description like ?1")
    public Page<Instruct> findByParam(String param, Pageable pageable);
}
