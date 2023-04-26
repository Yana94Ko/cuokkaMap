package com.bside.cuokkamap.dao;

import com.bside.cuokkamap.vo.UserVO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserDAO {
    //회원가입
    public int signIn(UserVO vo);
    //로그인아이디로 회원정보 존재 유무 확인
    public UserVO selectUserByLogin_id(String login_id);
    //user_num으로 login_id 조회
    public String getLogin_idByUserNum(int user_num);

    //place의 user_num 교체
    public void updatePlaceUserNum(int new_user_num, int user_num);
    //회원정보 삭제
    public int deleteUser(int user_num);
}
