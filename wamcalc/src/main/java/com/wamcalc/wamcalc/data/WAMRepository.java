package com.wamcalc.wamcalc.data;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WAMRepository extends JpaRepository<WAM, Long> {

    List<WAM> findWAMSByStudent_Username(String student_username);

    Optional<WAM> findById(long id);

}
