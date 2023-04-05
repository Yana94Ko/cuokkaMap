package com.bside.cuokkamap.dao;

import com.bside.cuokkamap.vo.PlaceVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface PlaceDAO {
    //장소정보 등록
    public int savePlaceInfo(PlaceVO vo);
    //장소 필터 등록
    public int insertFilterList(PlaceVO vo);
    //장소 이미지 등록
    public int savePlaceImg(PlaceVO vo);
    //장소 리뷰 등록
    public int savePlaceReview(PlaceVO vo);
    //즐겨찾기 등록
    public int saveFavoritePlace(PlaceVO vo);

    //방금 등록한 장소 번호 가져오기
    public int getPlaceNum(int user_num);

    //모든 장소 정보 전달
    public List<PlaceVO> selectALLPlaceWithFilterAndKeyword(List<String> filters, int filterCnt, List<String> keywords, int keywordCnt);
    //해당 좌표의 장소가 DB에 존재하는지 확인
    public int cntSamePlace(String x, String y);
    //장소 번호로 장소 검색
    public PlaceVO selectPlaceByPlaceNum(int place_num);
    //키워드로 장소 검색
    public List<PlaceVO> selectPlaceByKeyword(String Keyword);
    //필터로 장소 검색
    public List<PlaceVO> selectPlaceByFilter(String Filter);
    //user_num으로 최근에 등록한 place_img 검색
    public PlaceVO selectResentPlaceImgByUserNum(int user_num);
    //user_num으로 최근에 등록한 Place_review 검색
    public PlaceVO selectResentPlaceReviewByUserNum(int user_num);
    //user_num으로 최근에 등록한 favorite_place 검색
    public PlaceVO selectResentFavoritePlaceByUserNum(int user_num);
    //place_num으로 해당하는 place의 img 조회
    public List<PlaceVO> selectPlaceImgByPlaceNum(int place_num);
    //place_num으로 해당하는 place의 review 조회
    public List<PlaceVO> selectPlaceReviewByPlaceNum(int place_num);
    //place_num으로 해당하는 filter_type들 조회
    public String selectPlaceFilterByPlaceNum(int place_num);
}
