package com.wamcalc.wamcalc.data;

import com.fasterxml.jackson.annotation.JsonBackReference;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "SEMESTER")
public class Semester {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @Column(name = "name")
    private String name;

    @Column(name = "current")
    private boolean current = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "STUDENT.username")
    private Student student;

    @OneToMany(mappedBy = "semester", fetch = FetchType.LAZY, orphanRemoval = false)
    private List<UOS> uosList = new ArrayList<>();

    public Semester(){}

    public Semester(String name) {
        this.name = name;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isCurrent() {
        return current;
    }

    public void setCurrent(boolean current) {
        this.current = current;
    }

    public Student getStudent() {
        return student;
    }

    @JsonBackReference
    public void setStudent(Student student) {
        this.student = student;
    }

    public List<UOS> getUosList() {
        return uosList;
    }

    public void setUosList(List<UOS> uosList) {
        this.uosList = uosList;
    }
}
