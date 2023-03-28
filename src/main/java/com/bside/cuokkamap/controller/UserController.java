package com.bside.cuokkamap.controller;

import com.bside.cuokkamap.service.KakaoAPI;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.io.IOException;

@Controller
@RequestMapping("/user")
public class UserController {

    @Autowired
    KakaoAPI kakao;

    @GetMapping("/kakaoLogin")
    public void kakaoLogin(HttpServletResponse response, String code, HttpSession session, HttpServletResponse res, RedirectAttributes redirect, HttpServletRequest request) throws IOException {
        // TODO(BE, KAKAO_LOGIN) : 카카오 로그인 관련 사용자 인증 코드 발급 완료, oauth 토큰 발급 필요
        // - 사용자의 인가코드를 숨길 방법이 있나?
        JSONObject tokenJson = kakao.getToken(code);
        String acceseToken = tokenJson.getString("access_token");
        String refreshToken = tokenJson.getString("refresh_token");

        // 카카오 로그인에서 받아온 userInfo를 VO에 담기
        //UserVO kakaoUserVO = new UserVo(kakao.getUserInfo());
    }
}
