package com.web.api;
import com.web.config.Environment;
import com.web.constants.LogUtils;
import com.web.constants.RequestType;
import com.web.dto.PaymentDto;
import com.web.dto.ProductPayment;
import com.web.dto.ResponsePayment;
import com.web.entity.Product;
import com.web.exception.MessageException;
import com.web.models.PaymentResponse;
import com.web.models.QueryStatusTransactionResponse;
import com.web.processor.CreateOrderMoMo;
import com.web.processor.QueryTransactionStatus;
import com.web.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class MomoApi {

    @Autowired
    private ProductRepository productRepository;

    @PostMapping("/urlpayment")
    public ResponsePayment getUrlPayment(@RequestBody PaymentDto paymentDto){
        LogUtils.init();
        Double totalAmount = 0D;
        for(ProductPayment p : paymentDto.getProductPayments()){
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
        Long td = Math.round(totalAmount);
        String orderId = String.valueOf(System.currentTimeMillis());
        String requestId = String.valueOf(System.currentTimeMillis());
        Environment environment = Environment.selectEnv("dev");
        PaymentResponse captureATMMoMoResponse = null;
        try {
            captureATMMoMoResponse = CreateOrderMoMo.process(environment, orderId, requestId, Long.toString(td), paymentDto.getContent(), paymentDto.getReturnUrl(), paymentDto.getNotifyUrl(), "", RequestType.PAY_WITH_ATM, null);
        } catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println("url ====: "+captureATMMoMoResponse.getPayUrl());
        ResponsePayment responsePayment = new ResponsePayment(captureATMMoMoResponse.getPayUrl(),orderId,requestId);
        return responsePayment;
    }


    @GetMapping("/checkPayment")
    public Integer checkPayment(@RequestParam("orderId") String orderId, @RequestParam("requestId") String requestId) throws Exception {
        Environment environment = Environment.selectEnv("dev");
        QueryStatusTransactionResponse queryStatusTransactionResponse = QueryTransactionStatus.process(environment, orderId, requestId);
        System.out.println("qqqq-----------------------------------------------------------"+queryStatusTransactionResponse.getMessage());
        if(queryStatusTransactionResponse.getResultCode() == 0){
            return 0;
        }
        return 1;
    }
}
