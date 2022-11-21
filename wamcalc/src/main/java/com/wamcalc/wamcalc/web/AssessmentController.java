package com.wamcalc.wamcalc.web;

import com.wamcalc.wamcalc.data.Assessment;
import com.wamcalc.wamcalc.data.AssessmentRepository;
import com.wamcalc.wamcalc.data.UOSRepository;
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
public class AssessmentController {

    @Autowired
    AssessmentRepository assessmentRepository;

    @Autowired
    UOSRepository uosRepository;

    @GetMapping("/assessment/all/{uos_id}")
    public ResponseEntity<List<Assessment>> getAllAssessments(@PathVariable("uos_id")long uos_id) {
        try {
            List<Assessment> allAss = new ArrayList<Assessment>();
            assessmentRepository.findAssessmentsByUos_Id(uos_id).forEach(allAss::add);
            if (allAss.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(allAss, HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping("/assessment/{id}")
    public ResponseEntity<Assessment> getAssessmentById(@PathVariable("id") long id) {
        Optional<Assessment> assData = assessmentRepository.findById(id);
        if (assData.isPresent()) {
            return new ResponseEntity<>(assData.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/assessment/{uos_id}")
    public ResponseEntity<Assessment> createAssessment(@RequestBody Assessment data, @PathVariable("uos_id")long uos_id) {
        try {
            Assessment t = new Assessment(data.getName(), data.getWeight(), data.getIsFinal());
            t.setUos(uosRepository.findById(uos_id).get());
            Assessment _t = assessmentRepository.save(t);
            return new ResponseEntity<>(_t, HttpStatus.CREATED);

        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/assessment/mark/{uos_id}")
    public ResponseEntity<Assessment> createAssessmentWithMark(@RequestBody Assessment data, @PathVariable("uos_id")long uos_id) {
        try {
            Assessment t = new Assessment(data.getName(), data.getWeight(), data.getMark());
            t.setUos(uosRepository.findById(uos_id).get());
            Assessment _t = assessmentRepository.save(t);
            return new ResponseEntity<>(_t, HttpStatus.CREATED);

        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/assessment/{id}")
    public ResponseEntity<Assessment> updateAssessment(@PathVariable("id") long id, @RequestBody Assessment data) {
        Optional<Assessment> assData = assessmentRepository.findById(id);
        if (assData.isPresent()) {
            Assessment _assessment = assData.get();
            _assessment.setName(data.getName());
            _assessment.setWeight(data.getWeight());
            _assessment.setMark(data.getMark());
            _assessment.setIsFinal(data.getIsFinal());
            return new ResponseEntity<>(assessmentRepository.save(_assessment), HttpStatus.OK);

        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/assessment/{id}")
    public ResponseEntity<HttpStatus> deleteAssessment(@PathVariable("id") long id) {
        try {
            assessmentRepository.delete(assessmentRepository.findById(id).get());
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
