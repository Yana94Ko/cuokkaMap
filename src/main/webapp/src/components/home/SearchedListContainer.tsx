import React, {SetStateAction} from 'react';
import styled from "styled-components";
import {Button, Icon, Input} from "../../styles/common";
import {CloseBtn} from "./PostCafeInfo";

interface listProps {
    setSearchedListCheck: React.Dispatch<SetStateAction<boolean>>;
}

const Base = styled.div`
  position: absolute;
  height: 300px;
  overflow: auto;
  top: 3rem;
  background-color: ${props => props.theme.color.white};
  color: ${props => props.theme.color.text};
  width: 100%;
  padding: 2rem 1rem;
  border-radius: 1rem;
  z-index: 999;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);

  .map_wrap, .map_wrap * {
    font-size: 12px;
  }

  .map_wrap a, .map_wrap a:hover, .map_wrap a:active {
    text-decoration: none;
  }

  .map_wrap {
    position: relative;
    width: 100%;
    height: 500px;
  }

  #menu_wrap {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 250px;
    margin: 10px 0 30px 10px;
    padding: 5px;
    overflow-y: auto;
    z-index: 1;
    border-radius: 10px;
  }


  //#menu_wrap hr {
  //  display: block;
  //  height: 1px;
  //  border: 0;
  //  border-top: 2px solid red;
  //  margin: 3px 0;
  //}

  #menu_wrap .option {
    text-align: center;
  }

  #menu_wrap .option p {
    margin: 10px 0;
  }

  #menu_wrap .option button {
    margin-left: 5px;
  }

  #placesList li {
    list-style: none;
  }

  #placesList .item {
    position: relative;
    border-bottom: 1px solid ${props => props.theme.color.gray};
    overflow: hidden;
    cursor: pointer;
    min-height: 65px;
    margin-top: 1rem;
  }

  #placesList .item span {
    display: block;
    margin-top: 0.5rem;
  }

  #placesList .item h5, #placesList .item .info {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  #placesList .item .info {
    //padding: 10px 0 10px 55px;
  }

  #placesList .info .gray {
    color: #8a8a8a;
  }

  #placesList .info .jibun {
    padding-left: 26px;
    background: url(https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/places_jibun.png) no-repeat;
  }

  #placesList .info .tel {
    color: #009900;
  }

  #placesList .item .markerbg {
    float: left;
    position: absolute;
    width: 36px;
    height: 37px;
    margin: 10px 0 0 10px;
    background: url(https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png) no-repeat;
  }

  #placesList .item .marker_1 {
    background-position: 0 -10px;
  }

  #placesList .item .marker_2 {
    background-position: 0 -56px;
  }

  #placesList .item .marker_3 {
    background-position: 0 -102px
  }

  #placesList .item .marker_4 {
    background-position: 0 -148px;
  }

  #placesList .item .marker_5 {
    background-position: 0 -194px;
  }

  #placesList .item .marker_6 {
    background-position: 0 -240px;
  }

  #placesList .item .marker_7 {
    background-position: 0 -286px;
  }

  #placesList .item .marker_8 {
    background-position: 0 -332px;
  }

  #placesList .item .marker_9 {
    background-position: 0 -378px;
  }

  #placesList .item .marker_10 {
    background-position: 0 -423px;
  }

  #placesList .item .marker_11 {
    background-position: 0 -470px;
  }

  #placesList .item .marker_12 {
    background-position: 0 -516px;
  }

  #placesList .item .marker_13 {
    background-position: 0 -562px;
  }

  #placesList .item .marker_14 {
    background-position: 0 -608px;
  }

  #placesList .item .marker_15 {
    background-position: 0 -654px;
  }

  #pagination {
    margin: 10px auto;
    text-align: center;
  }

  #pagination a {
    display: inline-block;
    margin-right: 10px;
  }

  #pagination .on {
    font-weight: bold;
    cursor: default;
    color: #777;
  }
`;


const SearchedListContainer = ({setSearchedListCheck}: listProps) => {
    const item = document.getElementsByClassName("item");
    const removeValue = (event: React.MouseEvent<HTMLInputElement>) => {
        event.preventDefault();
        setSearchedListCheck(false);
    }

    // 리스트 아이템 클릭 시 리스트 안보이게
    if (item !== undefined) {
        for (let i = 0; i < item.length; i++) {
            item[i].addEventListener("click", () => {
                setSearchedListCheck(false);
            });
        }
    }
    return (<Base id={"search-result"}>
        <CloseBtn className="material-symbols-rounded" onClick={removeValue}>close</CloseBtn>
        <ul id="placesList"></ul>
    </Base>)
}

export default SearchedListContainer;

