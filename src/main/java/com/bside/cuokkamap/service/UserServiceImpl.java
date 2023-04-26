package com.bside.cuokkamap.service;

import com.bside.cuokkamap.dao.UserDAO;
import com.bside.cuokkamap.vo.UserVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    UserDAO dao;

    @Override
    public int signIn(UserVO vo) {
        return dao.signIn(vo);
    }

    @Override
    public UserVO selectUserByLogin_id(String login_id) {
        return dao.selectUserByLogin_id(login_id);
    }

    @Override
    public String getLogin_idByUserNum(int user_num) {
        return dao.getLogin_idByUserNum(user_num);
    }

    @Override
    public void updatePlaceUserNum(int new_user_num, int user_num) {
        dao.updatePlaceUserNum(new_user_num, user_num);
    }

    @Override
    public int deleteUser(int user_num) {
        return dao.deleteUser(user_num);
    }

}
