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
public class SemesterController {

    @Autowired
    StudentRepository studentRepository;

    @Autowired
    SemesterRepository semesterRepository;

    @Autowired
    AssessmentRepository assessmentRepository;

    @Autowired
    UOSRepository uosRepository;

    @GetMapping("/semester/all/{username}")
    public ResponseEntity<List<Semester>> getAllSemesters(@PathVariable("username")String username) {
        try {
            List<Semester> allSem = new ArrayList<Semester>();
            semesterRepository.findSemestersByStudent_Username(username).forEach(allSem::add);
            if (allSem.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(allSem, HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/semester/{id}")
    public ResponseEntity<Semester> getSemesterById(@PathVariable("id") long id) {
        Optional<Semester> semData = semesterRepository.findById(id);
        if (semData.isPresent()) {
            return new ResponseEntity<>(semData.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/semester/{username}")
    public ResponseEntity<Semester> createSemester(@RequestBody Semester sem, @PathVariable("username")String username) {
        try {
            Semester t = new Semester(sem.getName());
            t.setStudent(studentRepository.findByUsername(username).get());
            Semester _t = semesterRepository.save(t);
            return new ResponseEntity<>(_t, HttpStatus.CREATED);

        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //Either start a semester or end a semester
    @PutMapping("/semester/{id}")
    public ResponseEntity<Semester> updateSemester(@PathVariable("id") long id, @RequestBody Semester sem) {
        Optional<Semester> semData = semesterRepository.findById(id);
        if (semData.isPresent()) {
            Semester _sem = semData.get();
            _sem.setCurrent(sem.isCurrent());
            return new ResponseEntity<>(semesterRepository.save(_sem), HttpStatus.OK);

        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/semester/{id}")
    public ResponseEntity<HttpStatus> deleteSemester(@PathVariable("id") long id) {

        try {
            List<UOS> allUos = new ArrayList<UOS>();
            uosRepository.findUOSBySemester_Id(id).forEach(allUos::add);
            if (!allUos.isEmpty()) {
                List<Assessment> allAss = new ArrayList<Assessment>();
                for (UOS u : allUos){
                    assessmentRepository.findAssessmentsByUos_Id(u.getId()).forEach(allAss::add);
                    if (!allAss.isEmpty()) {
                        for (Assessment a : allAss){
                            assessmentRepository.delete(assessmentRepository.findById(a.getId()).get());
                        }
                    }
                    uosRepository.delete(uosRepository.findById(u.getId()).get());
                }
            }
            semesterRepository.delete(semesterRepository.findById(id).get());
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);

        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
