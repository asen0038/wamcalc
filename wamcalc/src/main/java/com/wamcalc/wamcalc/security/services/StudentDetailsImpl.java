package com.wamcalc.wamcalc.security.services;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.wamcalc.wamcalc.data.Student;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Objects;

public class StudentDetailsImpl implements UserDetails {
    private static final long serialVersionUID = 1L;
    private String username;
    private String email;
    @JsonIgnore
    private String password;
    public StudentDetailsImpl(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }
    public static StudentDetailsImpl build(Student user) {
        return new StudentDetailsImpl(
                user.getUsername(),
                user.getEmail(),
                user.getPassword());
    }

    public String getEmail() {
        return email;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return null;
    }

    @Override
    public String getPassword() {
        return password;
    }
    @Override
    public String getUsername() {
        return username;
    }
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
    @Override
    public boolean isEnabled() {
        return true;
    }
    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        StudentDetailsImpl user = (StudentDetailsImpl) o;
        return Objects.equals(username, user.username);
    }
}
