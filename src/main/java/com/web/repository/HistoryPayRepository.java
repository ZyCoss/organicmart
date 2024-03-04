package com.web.repository;
import com.web.entity.HistoryPay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
public interface HistoryPayRepository extends JpaRepository<HistoryPay, Long> {

    @Query("select h from HistoryPay h where h.orderId = ?1 and h.requestId = ?2")
    Optional<HistoryPay> findByOrderIdAndRequestId(String orderid, String requestId);
}