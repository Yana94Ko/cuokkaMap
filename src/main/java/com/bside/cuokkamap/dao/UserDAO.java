package com.bside.cuokkamap.dao;

import com.bside.cuokkamap.vo.UserVO;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

@Mapper
public interface UserDAO {
    //회원가입
    public int signIn(UserVO vo);
    //로그인아이디로 회원정보 존재 유무 확인
    public UserVO selectUserByLogin_id(String login_id);

}
