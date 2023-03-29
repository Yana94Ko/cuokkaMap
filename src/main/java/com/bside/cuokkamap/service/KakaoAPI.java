package com.bside.cuokkamap.service;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;

@Service
public class KakaoAPI {
    @Value("${KAKAO_LOGIN_REST_API_KEY}")
    private String KAKAO_LOGIN_REST_API_KEY;

    @Value("${KAKAO_LOGIN_REDIRECT_URI}")
    private String KAKAO_LOGIN_REDIRECT_URI;

    public JSONObject getToken (String authorizeCode) {
        StringBuffer sb = new StringBuffer();
        sb.append("grant_type=authorization_code");
        sb.append("&client_id="+KAKAO_LOGIN_REST_API_KEY);
        sb.append("&redirect_uri="+KAKAO_LOGIN_REDIRECT_URI);
        sb.append("&code="+authorizeCode);

        return getTokenJson(sb);
    }

    public JSONObject getTokenJson(StringBuffer sb) {
        String tokenUrl = "https://kauth.kakao.com/oauth/token";
        String method = "POST";

        JSONObject tokenJson = null;
        try {
            URL url = new URL(tokenUrl);

            HttpURLConnection con = (HttpURLConnection)url.openConnection();
            con.setDoOutput(true);
            con.setRequestMethod(method);
            con.setRequestProperty("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");

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

    public StringBuffer getResponse (HttpURLConnection con) throws IOException {
        int responseCode = con.getResponseCode();
        BufferedReader br = null;

        if ( responseCode == 200 ) {
            br = new BufferedReader(new InputStreamReader(con.getInputStream()));
        } else {
            br = new BufferedReader(new InputStreamReader(con.getInputStream()));
        }

        StringBuffer response = new StringBuffer();
        while(br.ready()) {
            response.append(br.readLine());
        }

        return response;
    }

    //oauth 통해서 받은 accessToken 으로 사용자 정보 받아오기
    public HashMap<String, String> getUserInfo (String accessToken) {
        String infoUrl = "https://kapi.kakao.com/v2/user/me";
        String method = "GET";

        HashMap <String, String> userInfo = new HashMap<>();
        try {
            URL url = new URL(infoUrl);

            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setUseCaches(false);
            con.setRequestMethod(method);
            con.setRequestProperty("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
            con.setRequestProperty("Authorization", "Bearer " + accessToken);
            // TODO(BE, KAKAOLOGIN) : 필요없는 정보는 아예 서버에서 받아오지 않도록

            StringBuffer response = getResponse(con);
            JSONObject userJson = new JSONObject(response.toString());

            userInfo.put("login_id", userJson.get("id").toString());
            userInfo.put("login_type","0");
            userInfo.put("email",((JSONObject) userJson.get("kakao_account")).getString("email"));

        } catch (Exception e) {
            e.printStackTrace();
        }

        return userInfo;
    }
    // TODO(BE, KAKAO_LOGIN) kakao logout, Token Refresh 의 경우 추후 스트럼에서 추가할것.
    // - 우선 우리 DB, 우리 서버에서 로그아웃 하는 기능을 구현한 후 추후에 disconnKakao, getTokenRefresh 구현


}
