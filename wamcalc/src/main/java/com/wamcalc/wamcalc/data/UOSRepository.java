package com.wamcalc.wamcalc.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UOSRepository extends JpaRepository<UOS, String> {

    Optional<UOS> findByCode(String code);

    List<UOS> findUOSBySemester_Id(long id);

    Optional<UOS> findById(long id);

}
