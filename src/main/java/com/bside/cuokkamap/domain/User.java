package com.bside.cuokkamap.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
@Entity
@Getter @Setter
@RequiredArgsConstructor
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int user_num;
    @Column(name = "name")
    private String login_id;
    private String password;
    private boolean is_kakao;
    private int role;
    private LocalDateTime signup_date;
    private String login_token;
    private String profile_img;
    private String nickname;
    private int age;
    private String gender;
    private LocalDateTime block_date;

    // TODO(JPA) : DB 모델링 관련 PK, 모델링 사용하지않는 ENTITY 관계설정 시도
    // JPA에 대해서 다시 한 번 알아보고 모델링 수정 혹은
    // ddl-auto값 변경을 통한 DB 자동 모델링 여부 확인하여 ENTITY 설정(~ 10122.03.27)
}
