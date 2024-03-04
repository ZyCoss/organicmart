package com.web.controller.user;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class AllViewUser {

    @RequestMapping(value = {"/accounts"}, method = RequestMethod.GET)
    public String account() {
        return "user/accounts";
    }

    @RequestMapping(value = {"/cart"}, method = RequestMethod.GET)
    public String cart() {
        return "user/cart";
    }

    @RequestMapping(value = {"/checkout"}, method = RequestMethod.GET)
    public String checkout() {
        return "user/checkout";
    }

    @RequestMapping(value = {"/confirm"}, method = RequestMethod.GET)
    public String comfirm() {
        return "user/confirm";
    }

    @RequestMapping(value = {"/detail"}, method = RequestMethod.GET)
    public String detail() {
        return "user/detail";
    }

    @RequestMapping(value = {"/forgot"}, method = RequestMethod.GET)
    public String forgot() {
        return "user/forgot";
    }

    @RequestMapping(value = {"/index","/"}, method = RequestMethod.GET)
    public String index() {
        return "user/index";
    }

    @RequestMapping(value = {"/instruction"}, method = RequestMethod.GET)
    public String instruction() {
        return "user/instruction";
    }

    @RequestMapping(value = {"/instruction-detail"}, method = RequestMethod.GET)
    public String instructionDetail() {
        return "user/instruction-detail";
    }

    @RequestMapping(value = {"/login"}, method = RequestMethod.GET)
    public String login() {
        return "user/login.html";
    }

    @RequestMapping(value = {"/payment"}, method = RequestMethod.GET)
    public String payment() {
        return "user/payment.html";
    }

    @RequestMapping(value = {"/product"}, method = RequestMethod.GET)
    public String product() {
        return "user/product.html";
    }

    @RequestMapping(value = {"/regis"}, method = RequestMethod.GET)
    public String regis() {
        return "user/regis.html";
    }

}
