package com.wamcalc.wamcalc.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssessmentRepository extends JpaRepository<Assessment, String> {

    List<Assessment> findAssessmentsByUos_Id(long uos_id);

    Optional<Assessment> findById(long id);

}
