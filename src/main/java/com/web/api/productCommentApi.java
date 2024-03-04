package com.web.api;

import com.web.entity.ProductComment;
import com.web.entity.User;
import com.web.repository.ProductCommentRepository;
import com.web.repository.ProductRepository;
import com.web.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class productCommentApi {

    @Autowired
    private ProductCommentRepository productCommentRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserUtils userUtils;

    @PostMapping("/user/saveCommnet")
    public void save(@RequestBody ProductComment comment){
        User user = userUtils.getUserWithAuthority();
        comment.setUser(user);
        comment.setCreatedDate(new Date(System.currentTimeMillis()));
        productCommentRepository.save(comment);
    }

    @GetMapping("/public/commentsByProduct")
    public List<ProductComment> findByPro(@RequestParam("id") Long id){
        List<ProductComment> list = productCommentRepository.findByPro(id);
        User user = userUtils.getUserWithAuthority();
        if(user != null){
            for(ProductComment c : list){
                if(c.getUser().getId() == user.getId()){
                    c.setMyComment(true);
                }
            }
        }
        return list;
    }

    @DeleteMapping("/user/deletcomments")
    public void delete(@RequestParam("id") Long id){
        productCommentRepository.deleteById(id);
    }
}
