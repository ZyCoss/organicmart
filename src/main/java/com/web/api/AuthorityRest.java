package com.web.api;

import com.web.entity.Authority;
import com.web.repository.AuthorityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class AuthorityRest {

    @Autowired
    private AuthorityRepository authorityRepository;

    @GetMapping("/admin/authority")
    public List<Authority> findAll(){
        return authorityRepository.findAll();
    }


}
