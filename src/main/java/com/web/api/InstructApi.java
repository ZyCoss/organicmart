package com.web.api;

import com.web.entity.Category;
import com.web.entity.Instruct;
import com.web.repository.InstructRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class InstructApi {

    @Autowired
    private InstructRepository instructRepository;

    @PostMapping("/admin/addOrUpdateInstruct")
    public void save(@RequestBody Instruct instruct){
        if(instruct.getId() == null){
            instruct.setCreatedDate(new Date(System.currentTimeMillis()));
            instruct.setNumView(0);
        }
        else{
            Instruct b = instructRepository.findById(instruct.getId()).get();
            instruct.setCreatedDate(b.getCreatedDate());
            instruct.setNumView(b.getNumView());
        }
        instructRepository.save(instruct);
    }

    @GetMapping("/public/allInstruct")
    public List<Instruct> findAll(){
        return instructRepository.findAllDesc();
    }

    @GetMapping("/public/instructById")
    public Instruct findById(@RequestParam("id") Long id){
        Instruct instruct = instructRepository.findById(id).get();
        instruct.setNumView(instruct.getNumView()+1);
        instructRepository.save(instruct);
        return instruct;
    }

    @DeleteMapping("/admin/deleteInstruct")
    public void delete(@RequestParam("id") Long id){
        instructRepository.deleteById(id);
    }


    @GetMapping("/public/lastInstruct")
    public Instruct findLastInstruct(){
        Optional<Instruct> instruct = instructRepository.lastInstruct();
        return instruct.get();
    }

    @GetMapping("/public/instructIndex")
    public List<Instruct> instructIndex(){
        return instructRepository.getInstructIndex();
    }

    @GetMapping("/public/find-all-instruct-page")
    public Page<Instruct> instructIndex(@RequestParam(value = "search", required = false) String search,Pageable pageable){
        if(search == null){
            search = "";
        }
        return instructRepository.findByParam("%"+search+"%",pageable);
    }
}
