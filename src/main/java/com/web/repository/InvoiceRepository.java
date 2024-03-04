package com.web.repository;

import com.web.entity.Category;
import com.web.entity.Invoice;
import com.web.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.util.List;

public interface InvoiceRepository extends JpaRepository<Invoice,Long> {

    @Query(value = "select sum(i.total_amount) from invoice i where Month(i.created_date) = ?1 and Year(i.created_date) = ?2 and (i.pay_type = 1 or i.status_id = 4)", nativeQuery = true)
    public Double calDt(Integer month, Integer year);

    @Query("select i from Invoice i where i.user.id = ?1")
    List<Invoice> findByUser(Long id);

    @Query("select i from Invoice i where i.createdDate >= ?1 and i.createdDate <= ?2")
    List<Invoice> findByDate(Date from, Date to);

    @Query("select i from Invoice i where i.createdDate >= ?1 and i.createdDate <= ?2 and i.status.id = ?3")
    List<Invoice> findByDateAndStatus(Date from, Date to, Long statusId);

    @Query("select i from Invoice i where i.createdDate >= ?1 and i.createdDate <= ?2 and i.payType = ?3")
    List<Invoice> findByDateAndPaytype(Date from, Date to, Boolean isMomo);

    @Query("select i from Invoice i where i.createdDate >= ?1 and i.createdDate <= ?2 and i.payType = ?3 and i.status.id = ?4")
    List<Invoice> findByDateAndPaytypeAndStatus(Date from, Date to, Boolean isMomo, Long statusId);

    @Query(value = "select sum(i.total_amount) from invoice i \n" +
            "WHERE (i.status_id = 4 or i.pay_type = 1 ) and i.created_date = ?1", nativeQuery = true)
    public Double revenueByDate(Date ngay);

    @Query(value = "select count(i.id) from invoice i \n" +
            "WHERE i.status_id = 4 and i.created_date = ?1", nativeQuery = true)
    public Double numInvoiceToDay(Date ngay);
}
