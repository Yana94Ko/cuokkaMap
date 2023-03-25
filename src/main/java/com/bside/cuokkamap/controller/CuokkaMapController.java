package com.bside.cuokkamap.controller;

import com.bside.cuokkamap.service.CuokkaService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController //bean으로 생성
public class CuokkaMapController {
    // TODO: TODO git 액션 추가 (백엔드 JAVA 언어 환경).
    //
    // 이번 시도는 백엔드 파트에서 TODO의 이슈생성 테스트입니다.
    //
    // - `항목화`
    // - `항목화`

    @GetMapping("/api/hello")
    public String getCuokka() {
        String msg = "/img/cuokkaMap_img.png";
        return msg;
    }
    // TODO: TODO git 액션 추가2 (백엔드 JAVA 언어 환경).
    //
    // 이번 시도는 백엔드 파트에서 TODO의 이슈생성 테스트입니다.

}

