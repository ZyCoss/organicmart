package com.web.api;

import com.web.entity.Status;
import com.web.repository.StatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class StatusApi {

    @Autowired
    private StatusRepository statusRepository;

    @GetMapping("/admin/all-status")
    public List<Status> doanhThu(){
        List<Status> list = statusRepository.findAll();
        return list;
    }
}
