package com.bside.cuokkamap.service;

import com.bside.cuokkamap.vo.UserVO;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class KakaoAPI {

    @Value("${kakao.login.rest-api-key}")
    private String KAKAO_LOGIN_REST_API_KEY;

    @Value("${kakao.login.redirect-uri}")
    private String KAKAO_LOGIN_REDIRECT_URI;

    @Value("${kakao.login.admin-key}")
    private String kakaoAdminKey;

    private int TIMEOUT_VALUE = 2000;


    public JSONObject getToken(String authorizeCode) {
        StringBuffer sb = new StringBuffer();
        sb.append("grant_type=authorization_code");
        sb.append("&client_id=" + KAKAO_LOGIN_REST_API_KEY);
        sb.append("&redirect_uri=" + KAKAO_LOGIN_REDIRECT_URI);
        sb.append("&code=" + authorizeCode);

        return getTokenJson(sb);
    }

    public JSONObject getTokenJson(StringBuffer sb) {
        String tokenUrl = "https://kauth.kakao.com/oauth/token";
        String method = "POST";

        JSONObject tokenJson = null;
        try {
            URL url = new URL(tokenUrl);

            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setConnectTimeout(TIMEOUT_VALUE);
            con.setReadTimeout(TIMEOUT_VALUE);
            con.setDoOutput(true);
            con.setRequestMethod(method);
            con.setRequestProperty("Content-Type",
                    "application/x-www-form-urlencoded;charset=utf-8");

            BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(con.getOutputStream()));
            bw.write(sb.toString());
            bw.flush();

            StringBuffer response = getResponse(con);

            tokenJson = new JSONObject(response.toString());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return tokenJson;
    }

    public StringBuffer getResponse(HttpURLConnection con) throws IOException {
        int responseCode = con.getResponseCode();
        BufferedReader br = null;

        if (responseCode == 200) {
            br = new BufferedReader(new InputStreamReader(con.getInputStream()));
        } else {
            br = new BufferedReader(new InputStreamReader(con.getInputStream()));
        }

        StringBuffer response = new StringBuffer();
        while (br.ready()) {
            response.append(br.readLine());
        }

        return response;
    }

    //oauth 통해서 받은 accessToken 으로 사용자 정보 받아오기
    public UserVO getUserInfo(String accessToken) {
        String infoUrl = "https://kapi.kakao.com/v2/user/me?property_keys=[\"id\",\"kakao_account.email\"]";
        String method = "GET";

        UserVO userInfo = new UserVO();
        try {
            URL url = new URL(infoUrl);

            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setConnectTimeout(TIMEOUT_VALUE);
            con.setReadTimeout(TIMEOUT_VALUE);
            con.setUseCaches(false);
            con.setRequestMethod(method);
            con.setRequestProperty("Content-Type",
                    "application/x-www-form-urlencoded;charset=utf-8");
            con.setRequestProperty("Authorization", "Bearer " + accessToken);

            StringBuffer response = getResponse(con);
            JSONObject userJson = new JSONObject(response.toString());
            userInfo.setLogin_id(userJson.get("id").toString());
            userInfo.setLogin_type(0);
            userInfo.setEmail(((JSONObject) userJson.get("kakao_account")).getString("email"));

        } catch (Exception e) {
            e.printStackTrace();
        }

        return userInfo;
    }
    // TODO(BE, KAKAO_LOGIN) kakao logout, Token Refresh 의 경우 추후 스트럼에서 추가할것.
    // - 우선 우리 DB, 우리 서버에서 로그아웃 하는 기능을 구현한 후 추후에 disconnKakao, getTokenRefresh 구현

    public String unlinkUser(String login_id) {
        System.out.println("카카오 링크 해제하러 옴");

        StringBuffer sb = new StringBuffer();
        sb.append("target_id_type=user_id&");
        sb.append("target_id=" + login_id);

        System.out.println(sb.toString());

        String unLinkUser = "";
        try {
            String unLinkUrl = "https://kapi.kakao.com/v1/user/unlink";
            String method = "POST";

            URL url = new URL(unLinkUrl);

            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setConnectTimeout(TIMEOUT_VALUE);
            con.setReadTimeout(TIMEOUT_VALUE);
            con.setDoOutput(true);
            con.setRequestMethod(method);
            con.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
            con.setRequestProperty("Authorization", "KakaoAK " + kakaoAdminKey);

            BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(con.getOutputStream()));
            bw.write(sb.toString());
            bw.flush();

            StringBuffer response = getResponse(con);
            JSONObject userJson = new JSONObject(response.toString());
            unLinkUser = userJson.get("id").toString();

        } catch (Exception e) {
            System.out.println("카카오 링크 해제중 에러 발생");
            e.printStackTrace();
        }

        return unLinkUser;
    }

}
