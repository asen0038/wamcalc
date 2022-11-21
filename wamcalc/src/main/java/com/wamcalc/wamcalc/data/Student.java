package com.wamcalc.wamcalc.data;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import org.springframework.data.annotation.CreatedDate;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "STUDENT",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "email")
        })
public class Student {
    @Id
    private String username;

    @NotBlank
    @Size(max = 50)
    @Email
    private String email;

    @NotBlank
    @Size(max = 120)
    private String password;

    @Column(name = "created_date", nullable = false, updatable = false)
    @CreatedDate
    private long createdDate;

    @OneToMany(mappedBy = "student", fetch = FetchType.LAZY, orphanRemoval = false)
    private List<WAM> wamList = new ArrayList<>();

    @OneToMany(mappedBy = "student", fetch = FetchType.LAZY, orphanRemoval = false)
    private List<Semester> semList = new ArrayList<>();

    public Student() {
    }
    public Student(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    public String getUsername() {
        return this.username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return this.password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public long getCreatedDate() {
        return this.createdDate;
    }

    public void setCreatedDate(long createdDate) {
        this.createdDate = createdDate;
    }

    public List<WAM> getWamList() {
        return wamList;
    }

    public void setWamList(List<WAM> wamList) {
        this.wamList = wamList;
    }

    public List<Semester> getSemList() {
        return semList;
    }

    public void setSemList(List<Semester> semList) {
        this.semList = semList;
    }
}
