package com.bside.cuokkamap.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicInsert;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity(name="user")
@Getter @Setter
@RequiredArgsConstructor
@DynamicInsert
@MappedSuperclass
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString(of = {"user_num", "login_id", "password"})
public class User {
    @Id @GeneratedValue
    @Column(name = "user_num")
    private Long user_num;

    @Column(name = "login_id", nullable = false)
    private String login_id;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "is_kakao")
    @ColumnDefault("true")
    private boolean is_kakao;

    @Column(name = "role")
    @ColumnDefault("0")
    private int role;

    @CreationTimestamp
    @Column(name = "signup_date")
    private LocalDateTime signup_date;

    @Column(name = "email")
    private String email;

    private String login_token;

    @Column(name = "profile_img")
    private String profile_img;

    private String nickname;
    private int age;
    private String gender;
    private LocalDateTime block_date;

    @OneToMany(mappedBy = "user")//연관관계의 주인이 아님을 알려줌
    private List <Favorite_place> favorite_placeList = new ArrayList<>();



//    public User(Long user_num, String login_id, String password, String email, Boolean is_kakao, int role, LocalDateTime signup_date,
//                String login_token, String profile_img, String nickname, int age, String gender, LocalDateTime block_date) {
//        this.user_num = user_num;
//        this.login_id = login_id;
//        this.password = password;
//        this.email = email;
//        this.is_kakao = is_kakao;
//        this.role = role;
//        this.signup_date = signup_date;
//        this.login_token = login_token;
//        this.profile_img = profile_img;
//        this.nickname = nickname;
//        this.age = age;
//        this.gender = gender;
//        this.block_date = block_date;
//    }
//    public User(String login_id, String password) {
//        this.user_num = user_num;
//        this.login_id = login_id;
//        this.password = password;
//    }
    // TODO(JPA) : DB 모델링 관련 PK, 모델링 사용하지않는 ENTITY 관계설정 시도
    // JPA에 대해서 다시 한 번 알아보고 모델링 수정 혹은
    // ddl-auto값 변경을 통한 DB 자동 모델링 여부 확인하여 ENTITY 설정(~ 10122.03.27)
}
