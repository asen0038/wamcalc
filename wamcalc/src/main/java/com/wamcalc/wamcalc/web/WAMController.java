package com.wamcalc.wamcalc.web;

import com.wamcalc.wamcalc.data.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
public class WAMController {

    @Autowired
    WAMRepository wamRepository;

    @Autowired
    StudentRepository studentRepository;

    @GetMapping("/wam/all/{username}")
    public ResponseEntity<List<WAM>> getAllWAMs(@PathVariable("username")String username) {
        try {
            List<WAM> allWAM = new ArrayList<WAM>();
            wamRepository.findWAMSByStudent_Username(username).forEach(allWAM::add);
            if (allWAM.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(allWAM, HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @PostMapping("/wam/{username}")
    public ResponseEntity<WAM> createWAMs(WAM wam, String username) {
        try {
            WAM w = new WAM(wam.getScore(),wam.getType(),wam.getName());
            w.setStudent(studentRepository.findByUsername(username).get());
            WAM _w = wamRepository.save(w);
            return new ResponseEntity<>(_w, HttpStatus.CREATED);

        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/wam/{id}")
    public ResponseEntity<HttpStatus> deleteWAM(@PathVariable("id") long id) {
        try {
            wamRepository.delete(wamRepository.findById(id).get());
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}