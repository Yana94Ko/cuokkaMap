package com.bside.cuokkamap.controller;

import com.bside.cuokkamap.service.PlaceService;
import com.bside.cuokkamap.vo.PlaceVO;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartRequest;

import javax.servlet.ServletContext;
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
//        for(PlaceVO place : placeList){
//            System.out.println(place.getFilter_type());
//        }

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
//        System.out.println(placeService.cntSamePlace(x,y));
//        System.out.println(cnt);
        return new ResponseEntity(cnt, HttpStatus.OK);
    }

    // TODO(BE) : 사진등록 관련 프론트 연동후 재확인 필요
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
            placeVO.setPlaceImg_src(newFileName + "." + ext);
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
    @PostMapping("/deletePlaceImg")
    public ResponseEntity deletePlaceImg (@RequestBody String response, HttpServletRequest request) {
        JsonParser parser = new JsonParser();
        JsonObject jobj = (JsonObject) parser.parse(response);
        PlaceVO placeVO = new PlaceVO();
        placeVO.setPlaceImg_num(jobj.get("placeImg_num")
                .getAsInt());
        placeVO.setUser_num(jobj.get("user_num")
                .getAsInt());
        placeVO.setPlaceImg_src(jobj.get("placeImg_src")
                .toString().replaceAll("\"", ""));
        System.out.println("이미지 삭제하러 옴 : " + placeVO.getPlaceImg_num() + " / " + placeVO.getUser_num() + " / " + placeVO.getPlaceImg_src());
        try {
            File file = new File( request.getServletContext().getRealPath("public/upload/") + placeVO.getPlaceImg_src());

            int result = placeService.deletePlaceImg(placeVO);

            if(result != 0) {
                if( file.exists() ){
                    if(file.delete()){

                        return new ResponseEntity("이미지 삭제 성공", HttpStatus.OK);
                    }else{
                        return new ResponseEntity("이미지 파일 삭제 실페", HttpStatus.EXPECTATION_FAILED);
                    }
                }else{
                    return new ResponseEntity("이미지 파일이 존재하지 않습니다", HttpStatus.EXPECTATION_FAILED);
                }
            } else {
                return new ResponseEntity("파일 삭제중 에러발생", HttpStatus.EXPECTATION_FAILED);
            }
        }catch (Exception e) {
            return new ResponseEntity("이미지 삭제 전 에러 발생", HttpStatus.EXPECTATION_FAILED);
        }
    }

    // TODO(BE) : 리뷰등록 관련 프론트 연동후 제확인 필요
    // assignees : Yana94Ko
    @PostMapping("/uploadPlaceReview")
    public ResponseEntity uploadPlaceIReview (PlaceVO placeVO) {
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
    @PostMapping("/deletePlaceReview")
    public ResponseEntity deletePlaceReview (@RequestBody String response) {
        JsonParser parser = new JsonParser();
        JsonObject jobj = (JsonObject) parser.parse(response);
        PlaceVO placeVO = new PlaceVO();
        placeVO.setPlaceReview_num( jobj.get("placeReview_num")
                .getAsInt()) ;
        placeVO.setUser_num( jobj.get("user_num")
                .getAsInt());
        System.out.println("리뷰 삭제하러 옴 : " + placeVO.getPlaceReview_num() + " / " + placeVO.getUser_num() );
        try {
            int result = placeService.deletePlaceReview(placeVO);
            if( result != 0 ) {
                return new ResponseEntity("리뷰 삭제 성공", HttpStatus.OK);
            } else {
                return new ResponseEntity("리뷰 DB 삭제 실패", HttpStatus.EXPECTATION_FAILED);
            }
        }catch (Exception e) {
            return new ResponseEntity("리뷰 삭제 중 에러 발생", HttpStatus.EXPECTATION_FAILED);
        }
    }


    // TODO(BE) : 장소정보 열람(사진, 리뷰 포함)관련 프론트 연동후 제확인 필요
    // assignees : Yana94Ko
    @PostMapping("/selectDetailPlaceInfo")
    public ResponseEntity selectDetailPlaceInfo (@RequestBody String response) {
        try {
            JsonParser parser = new JsonParser();
            JsonObject jobj = (JsonObject)parser.parse(response);
            int place_num = jobj.get("place_num")
                    .getAsInt();
            System.out.println("장소 상세정보 확인하러 옴  " + place_num);
            //값을 담아 보내줄 json 객체 생성
            JSONObject placeDetailInfo = new JSONObject();
            JSONObject jsonObject = new JSONObject();

            //place_num으로 place의 filter_type 리스트 열람
            placeDetailInfo.put("filterList", placeService.selectPlaceFilterByPlaceNum(place_num).split(", "));
            //place_num으로 place 의 기본정보 열람
            PlaceVO selectedPlaceInfo = placeService.selectPlaceByPlaceNum(place_num);
            jsonObject.put("place_num", selectedPlaceInfo.getPlace_num());
            jsonObject.put("place_info", selectedPlaceInfo.getPlace_info());
            jsonObject.put("user_num", selectedPlaceInfo.getUser_num());
            placeDetailInfo.put("selectedPlaceInfo",jsonObject.toString());
            //place_num으로 place의 place_img 리스트 열람
            placeDetailInfo.put("placeImgList",placeService.selectPlaceImgByPlaceNum(place_num));
            //place_num으로 place의 place_review 리스트 열람
            placeDetailInfo.put("placeReviewList", placeService.selectPlaceReviewByPlaceNum(place_num));

            return new ResponseEntity(placeDetailInfo.toString(), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity("장소정보 열람 실패", HttpStatus.NOT_ACCEPTABLE);
        }
    }

    // TODO(BE) : (Create) FE 에서 받아온 place_num, user_num 으로 favorite_place DB에 등록
    // assignees : Yana94Ko
    @PostMapping("/uploadFavoritePlace")
    public ResponseEntity uploadFavoritePlace (@RequestBody String response) {
        JsonParser parser = new JsonParser();
        JsonObject jobj = (JsonObject)parser.parse(response);
        PlaceVO placeVO = new PlaceVO();
        placeVO.setPlace_num(jobj.get("place_num")
                                    .getAsInt());
        placeVO.setUser_num(jobj.get("user_num")
                                    .getAsInt());
        System.out.println("즐겨찾기 추가하러 옴 : 유저 - " + placeVO.getUser_num() + ", 장소 번호 - " + placeVO.getPlace_num());
        try {
            int result = placeService.saveFavoritePlace(placeVO);
            if(result == 1){
                PlaceVO favoriteInfo = placeService.selectResentFavoritePlaceByUserNum(placeVO.getUser_num());
                //System.out.println(favoriteInfo.getFavoritePlace_num()+"/"+favoriteInfo.getPlace_num()+"/"+favoriteInfo.getUser_num());
                return new ResponseEntity(favoriteInfo, HttpStatus.OK);
            }else {
                return new ResponseEntity("기존에 추가되어있는 즐겨찾기 입니다", HttpStatus.NOT_ACCEPTABLE);
            }
        }catch (Exception e) {
            return new ResponseEntity("즐겨찾기 추가 실패", HttpStatus.NOT_ACCEPTABLE);
        }
    }
    // TODO(BE) : (Delete) FE 에서 받아온 favoritePlace_num으로 으로 favorite_place DB에서 삭제
    // assignees : Yana94Ko


    // TODO(BE, favoritePlce) : user_num 을 통해 favoritePlce 목록 돌려주기(with favorite_type, x,y좌표)
    // assignees : Yana94Ko

}
