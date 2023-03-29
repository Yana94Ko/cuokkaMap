package com.bside.cuokkamap.service;

import com.bside.cuokkamap.dao.UserDAO;
import com.bside.cuokkamap.vo.UserVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService{
    @Autowired
    UserDAO dao;

    @Override
    public int signIn(UserVO vo) {return dao.signIn(vo);}

    @Override
    public UserVO selectUserByLogin_id(String login_id) {return dao.selectUserByLogin_id(login_id);}

}
