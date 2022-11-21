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
public class UOSController {

    @Autowired
    AssessmentRepository assessmentRepository;

    @Autowired
    UOSRepository uosRepository;

    @Autowired
    SemesterRepository semesterRepository;

    @GetMapping("/uos/all/{sem_id}")
    public ResponseEntity<List<UOS>> getAllUOS(@PathVariable("sem_id") long id) {
        try {
            List<UOS> allUos = new ArrayList<UOS>();
            uosRepository.findUOSBySemester_Id(id).forEach(allUos::add);
            if (allUos.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(allUos, HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/uos/{id}")
    public ResponseEntity<UOS> getTutorialById(@PathVariable("id") long id) {
        Optional<UOS> uosData = uosRepository.findById(id);
        if (uosData.isPresent()) {
            return new ResponseEntity<>(uosData.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/uos/{sem_id}")
    public ResponseEntity<UOS> createUOS(@RequestBody UOS uos, @PathVariable("sem_id") long id) {
        try {
            UOS t = new UOS(uos.getCode(), uos.getName(), uos.getGoal_mark());
            t.setSemester(semesterRepository.findById(id).get());
            UOS _uos = uosRepository.save(t);
            return new ResponseEntity<>(_uos, HttpStatus.CREATED);

        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/uos/{id}")
    public ResponseEntity<UOS> updateUOS(@PathVariable("id") long id, @RequestBody UOS uos) {
        Optional<UOS> uosData = uosRepository.findById(id);
        if (uosData.isPresent()) {
            UOS _uos = uosData.get();
            _uos.setGoal_mark(uos.getGoal_mark());
            _uos.setOverall_mark(uos.getOverall_mark());
            _uos.setFinal_mark(uos.getFinal_mark());
            return new ResponseEntity<>(uosRepository.save(_uos), HttpStatus.OK);

        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/uos/{id}")
    public ResponseEntity<HttpStatus> deleteUOS(@PathVariable("id") long id) {
        try {
            List<Assessment> allAss = new ArrayList<Assessment>();
            assessmentRepository.findAssessmentsByUos_Id(id).forEach(allAss::add);
            if (!allAss.isEmpty()) {
                for (Assessment a : allAss) {
                    assessmentRepository.delete(assessmentRepository.findById(a.getId()).get());
                }
            }
            uosRepository.delete(uosRepository.findById(id).get());
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
