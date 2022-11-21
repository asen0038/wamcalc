package com.wamcalc.wamcalc.data;

import com.fasterxml.jackson.annotation.JsonBackReference;

import javax.persistence.*;

@Entity
@Table(name = "ASSESSMENT")
public class Assessment {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @Column(name = "name")
    private String name;

    @Column(name = "mark")
    private long mark = -1;

    @Column(name = "weight")
    private long weight;

    @Column(name = "is_final")
    private boolean isFinal = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "UOS.id")
    private UOS uos;

    public Assessment() {}

    public Assessment(String name, long weight, boolean isFinal) {
        this.name = name;
        this.weight = weight;
        this.isFinal = isFinal;
    }

    public Assessment(String name, long weight, long mark) {
        this.name = name;
        this.weight = weight;
        this.mark = mark;
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

    public long getMark() {
        return mark;
    }

    public void setMark(long mark) {
        this.mark = mark;
    }

    public long getWeight() {
        return weight;
    }

    public void setWeight(long weight) {
        this.weight = weight;
    }

    public boolean getIsFinal() {
        return this.isFinal;
    }

    public void setIsFinal(boolean isFinal) {
        this.isFinal = isFinal;
    }

    public UOS getUos() {
        return uos;
    }

    @JsonBackReference
    public void setUos(UOS uos) {
        this.uos = uos;
    }

    @Override
    public String toString() {
        return "Assessment{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", mark=" + mark +
                ", weight=" + weight +
                ", uos=" + uos +
                '}';
    }
}
