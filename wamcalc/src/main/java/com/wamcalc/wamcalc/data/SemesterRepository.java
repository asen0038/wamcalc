package com.wamcalc.wamcalc.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SemesterRepository extends JpaRepository<Semester, String> {

    List<Semester> findSemestersByStudent_Username(String username);

    Optional<Semester> findById(long id);

}
