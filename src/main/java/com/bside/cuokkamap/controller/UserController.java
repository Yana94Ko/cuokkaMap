package com.bside.cuokkamap.controller;

import com.bside.cuokkamap.service.KakaoAPI;
import com.bside.cuokkamap.service.PlaceService;
import com.bside.cuokkamap.service.UserService;
import com.bside.cuokkamap.vo.UserVO;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.http.HttpServletResponse;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/api/user")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:80"}, allowedHeaders = "*")
public class UserController {

    @Autowired
    KakaoAPI kakao;
    @Autowired
    UserService userService;
    @Autowired
    PlaceService placeService;

    @GetMapping("/kakaoLogin")
//, HttpSession session, HttpServletResponse res, RedirectAttributes redirect, HttpServletRequest request
    public ResponseEntity kakaoLogin(HttpServletResponse response, String code) throws IOException {
        System.out.println("로그인하러 백서버에 리다이렉트됨");
        JSONObject tokenJson = kakao.getToken(code);

        String accessToken = tokenJson.getString("access_token");
        String refreshToken = tokenJson.getString("refresh_token");

        // 카카오 로그인에서 받아온 userInfo를 VO에 담기
        UserVO kakaoUserVO = kakao.getUserInfo(accessToken);
        // 해당하는 정보의 유저가 있는지 확인
        UserVO userInfo = userService.selectUserByLogin_id((String) kakaoUserVO.getLogin_id());
        if (userInfo != null) { // 해당하는 유저에 대한 정보가 있다면
            if (userInfo.getRole() == 9) { //블럭회원 관련
                response.setContentType("text/html; charset=UTF-8");
                PrintWriter out = response.getWriter();
                out.println(
                        "<script>alert('정지된 회원입니다. 정지사유는 관리자에게 문의하세요.');location.href='/member/login';</script>");
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

    @PostMapping("/kakaoWithdrawal")
    public ResponseEntity kakaoWithdrawal(@RequestBody String response) {
        JsonParser parser = new JsonParser();
        JsonObject jobj = (JsonObject) parser.parse(response);
        int user_num = jobj.get("user_num").getAsInt();
        System.out.println("회원탈퇴하러 옴" + user_num);

        //카카오 링크 해제
        String login_id = userService.getLogin_idByUserNum(user_num);
        String result = kakao.unlinkUser(login_id);
        System.out.println(login_id + " / " + result);
        if (login_id.equals(result)) {
            try {
                //place 정보 0번 유저로 변경
                userService.updatePlaceUserNum(0, user_num);
                //DB 회원정보 삭제
                userService.deleteUser(user_num);
                return new ResponseEntity("회원 탈퇴 성공", HttpStatus.OK);
            } catch (Exception e) {
                e.printStackTrace();
                return new ResponseEntity("DB 회원정보 삭제중 에러 발생", HttpStatus.BAD_REQUEST);
            }
        } else {
            return new ResponseEntity("kakao에서 삭제한 회원정보와, 입력받은 회원정보가 다릅니다", HttpStatus.BAD_REQUEST);
        }
    }

}
