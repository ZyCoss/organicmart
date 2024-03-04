package com.web.api;

import com.web.entity.Invoice;
import com.web.entity.InvoiceDetail;
import com.web.repository.InvoiceDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class InvoiceDetailApi {

    @Autowired
    private InvoiceDetailRepository InvoiceDetail;

    @GetMapping("/user/invoiceDetail-by-invoice")
    public List<InvoiceDetail> findByInvoice(@RequestParam("id") Long id){
        List<InvoiceDetail> list = InvoiceDetail.findByInvoice(id);
        return list;
    }
}
