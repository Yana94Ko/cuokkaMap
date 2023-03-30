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
}
