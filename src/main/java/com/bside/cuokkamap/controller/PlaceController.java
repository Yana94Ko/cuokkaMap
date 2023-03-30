package com.bside.cuokkamap.controller;

import com.bside.cuokkamap.service.PlaceService;
import com.bside.cuokkamap.vo.PlaceVO;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@Controller
@RequestMapping("/api/place/")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
public class PlaceController {

    @Autowired
    PlaceService placeService;

    @PostMapping("placeInsert")
    public ResponseEntity saveCafeInfo(@RequestBody String response) {
        System.out.println("DB 저장하러 옴" + response);
        JsonParser parser = new JsonParser();
        JsonObject jobj = (JsonObject)parser.parse(response);
        PlaceVO placeVO = new PlaceVO();

        placeVO.setUser_num(
                jobj.get("user_num")
                        .getAsInt());
        placeVO.setPlace_info(
                (jobj.get("place_info")
                        .getAsJsonObject())
                        .toString());

        int result = placeService.savePlaceInfo(placeVO);

        if (result == 1){//저장 성공했으면
            // 방금 저장한 장소의 번호 호출
            int savedPlaceNum = placeService.getPlaceNum(placeVO.getUser_num());
            placeVO.setPlace_num(savedPlaceNum);
            placeVO.setFilterList(
                    Arrays.asList((jobj.get("place_filter")
                            .toString().replaceAll("[\\[\\]\"]","")
                            .split(","))));

            if(placeVO.getFilterList()!=null){
                placeService.insertFilterList(placeVO);
            }
            ObjectMapper objectMapper = new ObjectMapper();

            PlaceVO savedPlaceInfo = placeService.selectPlaceByPlaceNum(savedPlaceNum);
            savedPlaceInfo.setFilterList(placeVO.getFilterList());
            return new ResponseEntity(savedPlaceInfo, HttpStatus.OK);
        } else {
            return new ResponseEntity("DB 저장 실패!", HttpStatus.NOT_ACCEPTABLE);
        }
    }

    @PostMapping("/getAllPlaceInfo")
    public ResponseEntity getALLPlaceWithFilterAndKeyword(@RequestBody String res) {
        System.out.println("DB에 저장된 카페 정보 받으러옴");
        JsonParser parser = new JsonParser();
        JsonObject jobj = (JsonObject)parser.parse(res);
        List <String> filters = null;;
        List<String> keywords = null;
        int filterCnt = 0;
        int keywordCnt = 0;

        //filters
        if(jobj.get("place_filter") != null && ! (jobj.get("place_filter").toString()).equals("[]")) {
            filters = Arrays.asList((jobj.get("place_filter")
                                            .toString().replaceAll("[\\[\\]\"]","")
                                            .split(",")));
            filterCnt = filters.size();
        }
        //keyword
        if(jobj.get("keywords") != null && ! jobj.get("keywords").toString().equals("\"\"")) {
            keywords =  Arrays.asList((jobj.get("keywords")
                                .toString().replaceAll("[\\[\\]\"]","")
                                .split(" ")));
            keywordCnt = keywords.size();
        }
        System.out.println(filters + " / " + filterCnt + " / " + keywords + " / " + keywordCnt);
        List<PlaceVO> placeList = placeService.selectALLPlaceWithFilterAndKeyword(filters, filterCnt, keywords, keywordCnt);
        System.out.println(placeList);
        return new ResponseEntity( placeList, HttpStatus.OK);
    }

}
