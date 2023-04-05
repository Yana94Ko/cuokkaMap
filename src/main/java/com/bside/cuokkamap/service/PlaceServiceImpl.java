package com.bside.cuokkamap.service;

import com.bside.cuokkamap.dao.PlaceDAO;
import com.bside.cuokkamap.vo.PlaceVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlaceServiceImpl implements PlaceService{
    @Autowired
    PlaceDAO dao;

    @Override
    public int savePlaceInfo(PlaceVO vo) {return dao.savePlaceInfo(vo);}

    @Override
    public int insertFilterList(PlaceVO vo) {return dao.insertFilterList(vo);}

    @Override
    public int savePlaceImg(PlaceVO vo) {return dao.savePlaceImg(vo);}

    @Override
    public int savePlaceReview(PlaceVO vo) {return dao.savePlaceReview(vo);}

    @Override
    public int saveFavoritePlace(PlaceVO vo) {return dao.saveFavoritePlace(vo);}

    @Override
    public int getPlaceNum(int user_num) {return dao.getPlaceNum(user_num);}

    @Override
    public List<PlaceVO> selectALLPlaceWithFilterAndKeyword(List<String> filters, int filterCnt, List<String> keywords, int keywordCnt) {return dao.selectALLPlaceWithFilterAndKeyword(filters, filterCnt, keywords, keywordCnt);}

    @Override
    public int cntSamePlace(String x, String y) {return dao.cntSamePlace(x, y);}

    @Override
    public PlaceVO selectPlaceByPlaceNum(int place_num) {return dao.selectPlaceByPlaceNum(place_num);}

    @Override
    public List<PlaceVO> selectPlaceByKeyword(String keyword) {return dao.selectPlaceByKeyword(keyword);}

    @Override
    public List<PlaceVO> selectPlaceByFilter(String filter) {return dao.selectPlaceByFilter(filter);}

    @Override
    public PlaceVO selectResentPlaceImgByUserNum(int user_num) {return  dao.selectResentPlaceImgByUserNum(user_num);}

    @Override
    public PlaceVO selectResentPlaceReviewByUserNum(int user_num) {return dao.selectResentPlaceReviewByUserNum(user_num);}

    @Override
    public PlaceVO selectResentFavoritePlaceByUserNum(int user_num) {return dao.selectResentFavoritePlaceByUserNum(user_num);}

    @Override
    public List<PlaceVO> selectPlaceImgByPlaceNum(int place_num) {return dao.selectPlaceImgByPlaceNum(place_num);}

    @Override
    public List<PlaceVO> selectPlaceReviewByPlaceNum(int place_num) {return dao.selectPlaceReviewByPlaceNum(place_num);}

    @Override
    public String selectPlaceFilterByPlaceNum(int place_num) {return dao.selectPlaceFilterByPlaceNum(place_num);}

    @Override
    public int deletePlaceImg(PlaceVO vo) {return dao.deletePlaceImg(vo);}

}
