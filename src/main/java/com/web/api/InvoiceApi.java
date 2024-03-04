package com.web.api;

import com.web.config.Environment;
import com.web.dto.InvoiceDto;
import com.web.dto.ProductPayment;
import com.web.entity.*;
import com.web.exception.MessageException;
import com.web.models.QueryStatusTransactionResponse;
import com.web.processor.QueryTransactionStatus;
import com.web.repository.*;
import com.web.utils.StatusUtils;
import com.web.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.sql.Time;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class InvoiceApi {

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private InvoiceDetailRepository invoiceDetailRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private HistoryPayRepository historyPayRepository;

    @Autowired
    private UserUtils userUtils;

    @Autowired
    private StatusRepository statusRepository;


    @PostMapping("/user/create-invoice")
    public ResponseEntity<?> createInvoice(@RequestBody InvoiceDto invoiceDto) throws Exception{
        Double totalAmount = 0D;
        for(ProductPayment p : invoiceDto.getProductPayments()){
            Optional<Product> product = productRepository.findById(p.getIdproduct());
            if(product.isEmpty()){
                throw new MessageException("Sản phẩm không tồn tại");
            }
            if(product.get().getQuantity() < p.getQuantity()){
                throw new MessageException("Số lượng sản phẩm "+product.get().getName()+" không được vượt quá: "+product.get().getQuantity());
            }
            totalAmount += product.get().getPrice() * p.getQuantity();
        }
        totalAmount += 30000;
        if(invoiceDto.getIsMomo() == true){
            if(historyPayRepository.findByOrderIdAndRequestId(invoiceDto.getOrderId(), invoiceDto.getRequestId()).isPresent()){
                // đơn hàng đã được đặt trước đó
                return new ResponseEntity<>(1, HttpStatus.OK);
            }
            Environment environment = Environment.selectEnv("dev");
            QueryStatusTransactionResponse queryStatusTransactionResponse = QueryTransactionStatus.process(environment, invoiceDto.getOrderId(), invoiceDto.getRequestId());
            System.out.println("qqqq-----------------------------------------------------------"+queryStatusTransactionResponse.getMessage());
            if(queryStatusTransactionResponse.getResultCode() != 0){
                // chưa thanh toán
                return new ResponseEntity<>(2, HttpStatus.OK);
            }
        }
        Invoice invoice = new Invoice();
        invoice.setNote(invoiceDto.getNote());
        invoice.setReceiverName(invoiceDto.getFullname());
        invoice.setPhone(invoiceDto.getPhone());
        invoice.setAddress(invoiceDto.getAddress());
        invoice.setCreatedDate(new Date(System.currentTimeMillis()));
        invoice.setCreatedTime(new Time(System.currentTimeMillis()));
        invoice.setUser(userUtils.getUserWithAuthority());
        invoice.setTotalAmount(totalAmount);
        invoice.setPayType(invoiceDto.getIsMomo());
        invoice.setStatus(statusRepository.findById(StatusUtils.DANG_CHO_XAC_NHAN).get());
        Invoice result = invoiceRepository.save(invoice);

        for(ProductPayment p : invoiceDto.getProductPayments()){
            Optional<Product> product = productRepository.findById(p.getIdproduct());
            InvoiceDetail detail = new InvoiceDetail();
            detail.setInvoice(result);
            detail.setPrice(product.get().getPrice());
            detail.setQuantity(p.getQuantity());
            detail.setInvoice(result);
            detail.setProduct(product.get());
            invoiceDetailRepository.save(detail);

            product.get().setQuantity(product.get().getQuantity() - p.getQuantity());
            product.get().setQuantitySold(product.get().getQuantitySold() + p.getQuantity());
            productRepository.save(product.get());
        }

        if(invoiceDto.getIsMomo()){
            HistoryPay historyPay = new HistoryPay();
            historyPay.setInvoice(result);
            historyPay.setCreatedDate(new Date(System.currentTimeMillis()));
            historyPay.setOrderId(invoiceDto.getOrderId());
            historyPay.setRequestId(invoiceDto.getRequestId());
            historyPay.setTotalAmount(totalAmount);
            historyPayRepository.save(historyPay);
        }
        return new ResponseEntity<>(0, HttpStatus.CREATED);
    }


    @GetMapping("/user/my-invoice")
    public List<Invoice> myInvoice(){
        List<Invoice> list = invoiceRepository.findByUser(userUtils.getUserWithAuthority().getId());
        return list;
    }

    @GetMapping("/user/find-invoice-by-id")
    public Invoice invoidById(@RequestParam("id") Long id){
        Invoice invoice = invoiceRepository.findById(id).get();
        return invoice;
    }


    @GetMapping("/user/cancel-invoice")
    public void cancelInvoice(@RequestParam("id") Long id){
        Invoice invoice = invoiceRepository.findById(id).get();
        if(invoice.getPayType() == true){
            throw new MessageException("Đơn hàng đã thanh toán, không thể hủy");
        }
        if(invoice.getStatus().getId() == StatusUtils.DA_GUI || invoice.getStatus().getId() == StatusUtils.DA_HUY
        ||invoice.getStatus().getId() == StatusUtils.DA_NHAN || invoice.getStatus().getId() == StatusUtils.KHONG_NHAN_HANG){
            throw new MessageException("Không thể hủy");
        }
        if(invoice.getUser().getId() != userUtils.getUserWithAuthority().getId()){
            throw new MessageException(("KhÔng đủ quyền"));
        }
        invoice.setStatus(statusRepository.findById(StatusUtils.DA_HUY).get());
        invoiceRepository.save(invoice);
        List<InvoiceDetail> list = invoiceDetailRepository.findByInvoice(id);
        for(InvoiceDetail i : list){
            Product product = i.getProduct();
            product.setQuantity(product.getQuantity() + i.getQuantity());
            productRepository.save(product);
        }
    }

    @GetMapping("/admin/all-invoice")
    public List<Invoice> findAllFull(@RequestParam(required = false) Date from,
                                     @RequestParam(required = false) Date to,
                                     @RequestParam(required = false) Boolean isMomo,
                                     @RequestParam(required = false) Long statusId) {
        if(from == null || to == null){
            from = Date.valueOf("2000-01-01");
            to = Date.valueOf("2200-01-01");
        }
        List<Invoice> list = null;
        if(isMomo == null && statusId == null){
            list = invoiceRepository.findByDate(from, to);
        }
        if(isMomo == null && statusId != null){
            list = invoiceRepository.findByDateAndStatus(from, to, statusId);
        }
        if(isMomo != null && statusId == null){
            list = invoiceRepository.findByDateAndPaytype(from, to,isMomo);
        }
        if(isMomo != null && statusId != null){
            list = invoiceRepository.findByDateAndPaytypeAndStatus(from, to,isMomo,statusId);
        }
        return list;
    }

    @PostMapping("/admin/update-status-invoice")
    public void updateStatus(@RequestParam Long invoiceId,@RequestParam Long statusId) {
        Optional<Status> status = statusRepository.findById(statusId);
        Long idSt = status.get().getId();
        if(idSt == StatusUtils.DA_HUY){
            throw new MessageException("không thể cập nhật trạng thái này");
        }
        Optional<Invoice> invoice = invoiceRepository.findById(invoiceId);
        if(invoice.get().getStatus().getId() == StatusUtils.DA_HUY){
            throw new MessageException("Đơn hàng đã bị hủy, không thẻ cập nhật trạng thái");
        }
        invoice.get().setStatus(status.get());
        invoiceRepository.save(invoice.get());
    }

}
