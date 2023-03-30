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
}
