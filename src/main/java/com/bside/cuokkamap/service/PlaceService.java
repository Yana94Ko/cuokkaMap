package com.bside.cuokkamap.service;

import com.bside.cuokkamap.vo.PlaceVO;

import java.util.List;

public interface PlaceService {
    //장소정보 등록
    public int savePlaceInfo(PlaceVO vo);
    //장소 필터 등록
    public int insertFilterList(PlaceVO vo);

    //방금 등록한 장소 번호 가져오기
    public int getPlaceNum(int user_num);

    //장소 번호로 장소 검색
    public PlaceVO selectPlaceByPlaceNum(int place_num);
    //키워드로 장소 검색
    public List<PlaceVO> selectPlaceByKeyword(String keyword);
    //필터로 장소 검색
    public List<PlaceVO> selectPlaceByFilter(String filter);
}
