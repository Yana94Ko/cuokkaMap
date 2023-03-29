package com.bside.cuokkamap.vo;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.HashMap;

@Getter @Setter
public class UserVO {
    //user
    private int user_num;
    private String login_id;
    private String password;
    private int login_type;
    private int role;
    private LocalDateTime signup_date;
    private String email;
    private String login_token;
    private String profile_img;
    private String nickname;
    private int age;
    private String gender;
    private LocalDateTime block_date;

    //favorite_palce
    private int place_num;
    private int favorite_type;
    
    //kakaoInfo
    private int age_range;

    public UserVO () {};
}
