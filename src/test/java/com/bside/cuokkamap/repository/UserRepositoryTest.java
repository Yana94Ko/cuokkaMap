package com.bside.cuokkamap.repository;

import com.bside.cuokkamap.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;


import static org.assertj.core.api.Assertions.assertThat;


@SpringBootTest
@Transactional //JPA 의 모든 데이터 변경은 트랜젝션 안에서 이루어져야 하기때문에 추가.
// TODO(BE) : JPA test 코드 끝난 이후 DB 한번 밀고 실행할것.
@Rollback(false) //테스트 중 DB에 실제로 값이 들어갔는지 확인하기 위해 임시로 false 처리.
public class UserRepositoryTest {
    @Autowired UserRepository userRepository;

    @Test
    public void testUser () {
        User user =  new User();
        user.setLogin_id("userIdTest001");
        user.setPassword("password");
        User savedUser = userRepository.save(user);

        User findUser = userRepository.findById(savedUser.getUser_num()).get();

        assertThat(findUser.getUser_num()).isEqualTo(user.getUser_num());
        assertThat(findUser.getLogin_id()).isEqualTo(user.getLogin_id());
        assertThat(findUser).isEqualTo(user);
    }
}