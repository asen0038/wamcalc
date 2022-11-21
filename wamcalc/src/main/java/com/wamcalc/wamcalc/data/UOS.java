package com.wamcalc.wamcalc.data;

import com.fasterxml.jackson.annotation.JsonBackReference;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Entity
@Table(name = "UOS")
public class UOS {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @Column(name = "code")
    private String code;

    @Column(name = "name")
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "SEMESTER.id")
    private Semester semester;

    @Column(name = "goal_mark")
    private long goal_mark;

    @Column(name = "overall_mark")
    private long overall_mark;

    @Column(name = "final_mark")
    private long final_mark;

    @OneToMany(mappedBy = "uos", fetch = FetchType.LAZY, orphanRemoval = false)
    private List<Assessment> assessmentList = new ArrayList<>();

    public UOS() {
    }

    public UOS(String code, String name, long goal_mark) {
        this.code = code;
        this.name = name;
        this.goal_mark = goal_mark;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Semester getSemester() {
        return semester;
    }

    @JsonBackReference
    public void setSemester(Semester semester) {
        this.semester = semester;
    }

    public List<Assessment> getAssessmentList() {
        return assessmentList;
    }

    public void setAssessmentList(List<Assessment> assessmentList) {
        this.assessmentList = assessmentList;
    }

    public long getGoal_mark() {
        return goal_mark;
    }

    public void setGoal_mark(long goal_mark) {
        this.goal_mark = goal_mark;
    }

    public long getOverall_mark() {
        return overall_mark;
    }

    public void setOverall_mark(long overall_mark) {
        this.overall_mark = overall_mark;
    }

    public long getFinal_mark() {
        return final_mark;
    }

    public void setFinal_mark(long final_mark) {
        this.final_mark = final_mark;
    }

    @Override
    public String toString() {
        return "UOS{" +
                "id=" + id +
                ", code='" + code + '\'' +
                ", name='" + name + '\'' +
                ", student=" + semester +
                ", goal_mark=" + goal_mark +
                ", overall_mark=" + overall_mark +
                ", final_mark=" + final_mark +
                '}';
    }
}
