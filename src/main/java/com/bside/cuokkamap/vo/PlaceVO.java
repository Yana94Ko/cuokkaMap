package com.bside.cuokkamap.vo;

import lombok.Getter;
import lombok.Setter;
import org.json.JSONObject;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter @Setter
public class PlaceVO {
    //place
    private int place_num;
    private String place_info;

    //user
    private int user_num;

    //place_img
    private int placeImg_num;
    private String placeImg_src;
    private LocalDateTime placeImg_writedate;

    //place_review
    private int placeReview_emoji;
    private String placeReview;
    private LocalDateTime placeReview_writedate;

    //filter
    private String filter_type;
    private List<String> filterList;

    //자체 생성자
    public PlaceVO() {};
}
