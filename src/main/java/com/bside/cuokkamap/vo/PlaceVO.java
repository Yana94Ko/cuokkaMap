package com.bside.cuokkamap.vo;

import lombok.Getter;
import lombok.Setter;
import org.json.JSONObject;

import java.time.LocalDateTime;

@Getter @Setter
public class PlaceVO {
    //place
    private int place_num;
    private String place_info;

    //user
    private int user_num;

    //place_img
    private String placeImg_src;
    private LocalDateTime placeImg_writedate;

    //place_review
    private int plcaeReview_emoji;
    private String placeReview;
    private LocalDateTime placeReview_writedate;

    //filter
    private int filter_num;
    private String filter_type;

    //자체 생성자
    public PlaceVO() {};
}
