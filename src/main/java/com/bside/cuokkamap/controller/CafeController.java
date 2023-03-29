package com.bside.cuokkamap.controller;

import com.bside.cuokkamap.service.PlaceService;
import com.bside.cuokkamap.vo.PlaceVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/place")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
public class CafeController {

    @Autowired
    PlaceService placeService;

    @GetMapping("/placeInsert")
    public ResponseEntity saveCafeInfo(@RequestBody PlaceVO placeVO) {
        //받아온 정보 DB에 저장
        int result = placeService.savePlaceInfo(placeVO);
        if (result == 1){
            int savedPlaceNum = placeService.getPlaceNum(placeVO.getUser_num());
            PlaceVO retrunPlaceInfo = placeService.selectPlaceByPlaceNum(savedPlaceNum);
            return new ResponseEntity(retrunPlaceInfo, HttpStatus.OK);
        } else {
            System.out.println("DB 저장 실패");
            return new ResponseEntity(HttpStatus.NOT_ACCEPTABLE);
        }
    }

}
