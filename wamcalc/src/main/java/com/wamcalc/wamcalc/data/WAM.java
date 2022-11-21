package com.wamcalc.wamcalc.data;

import com.fasterxml.jackson.annotation.JsonBackReference;

import javax.persistence.*;

@Entity
@Table(name = "WAM")
public class WAM {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @Column(name = "score")
    private float score;

    @Column(name = "type")
    private String type;

    @Column(name = "name")
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "STUDENT.username")
    private Student student;

    public WAM() {
    }

    public WAM(float score, String type,String name) {
        this.score = score;
        this.type = type;
        this.name = name;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public float getScore() {
        return score;
    }

    public void setScore(float score) {
        this.score = score;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Student getStudent() {
        return student;
    }

    @JsonBackReference
    public void setStudent(Student student) {
        this.student = student;
    }

    @Override
    public String toString() {
        return "WAM{" +
                "id=" + id +
                ", score=" + score +
                ", type='" + type + '\'' +
                ", name='" + name + '\'' +
                ", student=" + student +
                '}';
    }
}
