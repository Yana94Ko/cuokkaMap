package com.bside.cuokkamap.controller;

import com.bside.cuokkamap.service.KakaoAPI;
import com.bside.cuokkamap.service.UserService;
import com.bside.cuokkamap.vo.UserVO;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@Controller
@RequestMapping("/api/user")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:80"}, allowedHeaders = "*")
public class UserController {
    @Autowired
    KakaoAPI kakao;
    @Autowired
    UserService userService;

    @GetMapping("/kakaoLogin")//, HttpSession session, HttpServletResponse res, RedirectAttributes redirect, HttpServletRequest request
    public ResponseEntity kakaoLogin(HttpServletResponse response, String code) throws IOException {
        System.out.println("로그인하러 백서버에 리다이렉트됨");
        // TODO(BE, KAKAO_LOGIN) : 카카오 로그인 관련 사용자 인증 코드 발급 완료, oauth 토큰 발급 필요
        // - 사용자의 인가코드를 숨길 방법이 있나?
        JSONObject tokenJson = kakao.getToken(code);

        String accessToken = tokenJson.getString("access_token");
        String refreshToken = tokenJson.getString("refresh_token");

        // 카카오 로그인에서 받아온 userInfo를 VO에 담기
        UserVO kakaoUserVO = kakao.getUserInfo(accessToken);
        // 해당하는 정보의 유저가 있는지 확인
        UserVO userInfo = userService.selectUserByLogin_id((String) kakaoUserVO.getLogin_id());
        if(userInfo != null) { // 해당하는 유저에 대한 정보가 있다면
            System.out.println("회원정보가 있어서 로그인 하러 달려가는중");
            if(userInfo.getRole() == 9) { //블럭회원 관련
                response.setContentType("text/html; charset=UTF-8");
                PrintWriter out = response.getWriter();
                out.println("<script>alert('정지된 회원입니다. 정지사유는 관리자에게 문의하세요.');location.href='/member/login';</script>");
                out.flush();
            }
        } else { // 회원정보가 앖다면 회원가입 진행
            userService.signIn(kakaoUserVO);
            userInfo = userService.selectUserByLogin_id((String) kakaoUserVO.getLogin_id());
        }
        // TODO(BE, login) : 로그인 유저 정보의 경우 토큰 등으로 암호화해서 전해주도록 추후 스크럼에서 작업할것
        // - 현재 상황으론 의미있는 정보가 없기때문에 그냥 보내주고 다른 작업들을 시작하지만,
        //   개인정보 보호를 위해 모든 유저정보는 토큰으로 전달하고,
        // - Auth 작업도 추가 가능하면 추가하고싶습니다.

        return new ResponseEntity(userInfo, HttpStatus.OK);
    }
}
