package com.bside.cuokkamap.controller;

import com.bside.cuokkamap.service.CuokkaService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController //bean으로 생성
public class CuokkaMapController {

    @GetMapping("/api/hello")
    public String getCuokka() {
        String msg = "/img/cuokkaMap_img.png";
        return msg;
    }

}

