package com.bside.cuokkamap.controller;

import com.bside.cuokkamap.service.PlaceService;
import com.bside.cuokkamap.vo.PlaceVO;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartRequest;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;

@Controller
@RequestMapping("/api/place/")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
public class PlaceController {

    @Autowired
    PlaceService placeService;

//    @Value("${spring.servlet.multipart.location}")
//    private String uploadPath;

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
        for(PlaceVO place : placeList){
            System.out.println(place.getFilter_type());
        }

        return new ResponseEntity( placeList, HttpStatus.OK);
    }

    @PostMapping("/isThereSamePlaceDB")
    public ResponseEntity cntSamePlace(@RequestBody String res) {
        System.out.println("DB에 해당 좌표의 장소가 이미 등록되어있는지 확인");
        JsonParser parser = new JsonParser();
        JsonObject jobj = (JsonObject)parser.parse(res);
        String x = jobj
                .get("x").toString();
        String y = jobj
                .get("y").toString();
        System.out.println(x + " , " + y);
        int cnt = placeService.cntSamePlace(x,y);
        System.out.println(placeService.cntSamePlace(x,y));
        System.out.println(cnt);
        return new ResponseEntity(cnt, HttpStatus.OK);
    }

    // TODO(BE) : (Create) FE에서 받아온 place_num과 user_num, place_img를 DB에 등록
    // - place_img 를 백엔드로 어떻게.. 받아올 수 있는지 알아보기
    // assignees : Yana94Ko

    @PostMapping("/uploadPlaceImg")
    public ResponseEntity uploadPlaceImg (PlaceVO placeVO, HttpServletRequest request) {
        try {
            //파일 업로드 구현
            // TODO(BE, image_upload) : 가능하면 파일업로드 함수를 외부에 별도로 빼두기(추후 프로필 이미지 업로드 등에 사용)
            // assignees Yana94Ko
            // 1) 파일 받아오기
            MultipartFile file = ((MultipartRequest) request).getFile("place_img");
            // 2) 파일명 수정용 String 생성(현재 DateTime + 100~999까지 랜덤 수)
            String newFileName =
                    System.currentTimeMillis()
                            + ""
                            + (new Random().ints(100, 999).findAny().getAsInt());
            // 3) 파일의 확장자 받아오기
            String ext = file
                    .getOriginalFilename()
                    .substring(
                            file
                                    .getOriginalFilename()
                                    .lastIndexOf(".") + 1);
//            //배포/ 비배포에 따른 path 분리
//            String path;
//            if(System.getenv("isNotDevVer") == "Y"){
//                path = uploadPath;
//            } else {
//                path = request.getServletContext().getRealPath("/public/upload");
//            }
            File f = new File( request.getServletContext().getRealPath("public/upload") + "/" + newFileName + "." + ext);

            try {
                file.transferTo(f);
            } catch (IllegalStateException e) {
                e.printStackTrace();
                return new ResponseEntity("이미지 업로드 실패 IllegalStateException", HttpStatus.EXPECTATION_FAILED);
            } catch (IOException e) {
                e.printStackTrace();
                return new ResponseEntity("이미지 업로드 실패 IOException", HttpStatus.EXPECTATION_FAILED);
            }

            //이미지 업로드 성공 후, DB 저장
            placeVO.setPlaceImg_src("/public/upload/" + newFileName + "." + ext);
            System.out.println("저장할 데이터 : " + placeVO.getPlace_num() +"   "+ placeVO.getUser_num() +"   "+ placeVO.getPlaceImg_src());
            int result = placeService.savePlaceImg(placeVO);
            if (result != 0) {
                PlaceVO savedPlaceImg = placeService.selectResentPlaceImgByUserNum(placeVO.getUser_num());
                System.out.println("저장완료한 데이터 ==> "+ savedPlaceImg.getPlaceImg_num() +"   " + savedPlaceImg.getPlace_num() +"   "+ savedPlaceImg.getUser_num() +"   "+ savedPlaceImg.getPlaceImg_src());
                return new ResponseEntity(savedPlaceImg, HttpStatus.OK);
            } else {
                return new ResponseEntity("DB 저장 실패", HttpStatus.EXPECTATION_FAILED);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity("이미지 업로드 실패", HttpStatus.EXPECTATION_FAILED);
        }
    }
    // TODO(BE) : (Delete) FE에서 받아온 placeImg_num으로 DB에서 삭제
    // - 또한 메모리 공간에서도 삭제 진행
    // assignees : Yana94Ko

    // TODO(BE) : (Create) FE에서 받아온 place_num과 user_num, placeReview, placeReview_emogi를 DB에 등록
    // assignees : Yana94Ko
    @PostMapping("/uploadPlaceReview")
    public ResponseEntity uploadPlaceImg (PlaceVO placeVO) {
        //placeReview 저장
        System.out.println(placeVO.getPlace_num() +"   "+ placeVO.getUser_num() +"   "+ placeVO.getPlaceReview_emoji() +"   "+ placeVO.getPlaceReview());
        int result = placeService.savePlaceReview(placeVO);
        if (result != 0) {
            PlaceVO savedOlaceReview = placeService.selectResentPlaceReviewByUserNum(placeVO.getUser_num());
            return new ResponseEntity(savedOlaceReview, HttpStatus.OK);
        } else {
            return new ResponseEntity("리뷰쓰기 실패", HttpStatus.EXPECTATION_FAILED);
        }
    }

    // TODO(BE) : (Delete) FE에서 받아온 placeReview_num으로 DB에서 삭제
    // assignees : Yana94Ko

    // TODO(BE) : (Read) FE 에서 받아온 place_num의 상세정보(사진, 리뷰 포함) DB에서 열람
    // assignees : Yana94Ko

    // TODO(BE) : (Create) FE 에서 받아온 place_num, user_num 으로 favorite_place DB에 등록
    // assignees : Yana94Ko
    // TODO(BE) : (Delete) FE 에서 받아온 favoritePlace_num으로 으로 favorite_place DB에서 삭제
    // assignees : Yana94Ko

}
