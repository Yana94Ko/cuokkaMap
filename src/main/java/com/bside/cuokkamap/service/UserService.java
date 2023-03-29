package com.bside.cuokkamap.service;

import com.bside.cuokkamap.vo.UserVO;

public interface UserService {
    //회원가입
    public int signIn(UserVO vo);
    //로그인아이디로 회원정보 존재 유무 확인
    public UserVO selectUserByLogin_id(String login_id);
}
