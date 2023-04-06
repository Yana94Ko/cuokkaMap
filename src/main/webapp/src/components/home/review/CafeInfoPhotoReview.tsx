import React, {useState, useEffect} from "react";
import styled from "styled-components";
import {Button} from "../../../styles/common";
import cafeInfo from "../CafeInfo";


type PhotoReview = {
    cafeInfoContainer: object
}
type dataType = {
    placeImg_num:number;
    placeImg_src:string;
    placeImg_writedate:string;
    place_num:number;
    user_num:number;

}
const PhotoContainer = styled.div`
  height:100%;
`;
const PhotoUl = styled.ul`
  margin-top:20px;
  display:flex;
  flex-wrap:wrap;
  text-align: center;
`;
const PhotoLi = styled.li`
  width:160px;
  margin:5px;
`;
const PhotoImg = styled.img`
  width:160px;
  height:120px;
  object-fit:cover;
  border-radius:10px;
  z-index:100;
  position:relative;
`;
const DeleteBtn = styled.span`
  width:10px;
  z-index:101;
  position:absolute;
  cursor:pointer;
`;

const CafeInfoPhotoReview = ({cafeInfoContainer}: PhotoReview) => {
    const sessionId = sessionStorage.getItem("id");
    let cafeInfoImageData:string[], cafeInfoUserNum:number[];
    if(cafeInfoContainer !== undefined){
        cafeInfoImageData = Object.values(cafeInfoContainer)[3].map((data:dataType) => ([data.placeImg_src, data.placeImg_num]));
        cafeInfoUserNum = Object.values(cafeInfoContainer)[3].map((data:dataType) => (data.user_num));
    }
    console.log(cafeInfoImageData);
    // 허용가능한 확장자 목록!
    const ALLOW_FILE_EXTENSION = "jpg,jpeg,png";
    const FILE_SIZE_MAX_LIMIT = 10 * 1024 * 1024;  // 10MB

    //확장자 검사 함수
    const fileExtensionValid = ({name}:{name:string}):boolean => {
        //파일 확장자
        const extension = removeFileName(name);
        //주어진 확장자가 ALLOW_FILE)EXTENSION에 포함이 안되었거나 빈값일경우는 false
        if(!ALLOW_FILE_EXTENSION.includes(extension) || extension === ""){
            return false;
        }
        return true;
    }

    //파의 확장자를 추출하는 함수
    const removeFileName = (originalFileName:string):string => {
        //마지막 .의 위치
        const lastIndex = originalFileName.lastIndexOf(".");
        //없을경우 확장자가 존재하지 않는경우
        if (lastIndex < 0) return "";
        //lastIndex 다음위치부터 문자열 잘라줌 = 확장자
        return originalFileName.substring(lastIndex + 1).toLowerCase();
    }

    const uploadFileReview = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(Number(sessionId) === 0 ){
            alert('로그인 후 이용하세요');
            return;
        }
        const target = event.currentTarget;
        const files = (target.files as FileList)[0];

        if (files === undefined){
            return;
        }
        //
        // //파일 개수 체크
        // if(files.size > 1){
        //     target.value='';
        //     alert('사진은 1개만 업로드 가능합니다');
        //     return;
        // }

        //확장자 체크
        if(!fileExtensionValid(files)){
            target.value='';
            alert('업로드 가능한 확장자가 아닙니다');
            return;
        }
        //파일 용량 체크
        if(files.size > FILE_SIZE_MAX_LIMIT){
            target.value = "";
            alert('업로드 가능한 최대 용량은 10MB 입니다');
            return;
        }

        // setPhotoData(files);
        const formData = new FormData();

        formData.append('place_img', files);
        formData.append('place_num', Object.values(cafeInfoContainer)[2]);
        formData.append('user_num', sessionId);

        fetch('/api/place/uploadPlaceImg',{
            method:'POST',
            body: formData,
        })
            .then(response => console.log(response.text()))
            .catch(err => console.log(JSON.parse(err)));
        target.value = "";
    }

    const removePhotoReview = (event: React.MouseEvent<HTMLSpanElement>) => {
        if (!(event.target instanceof HTMLSpanElement)) {
            return;
        }
        const [imageSrc, imageNum] = event.target.id.split(',');

        if(window.confirm('사진을 삭제하시겠습니까?')){
            fetch('/api/place/deletePlaceImg',{
                method:'POST',
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({
                    "placeImg_num":imageNum,
                    "user_num": sessionId,
                    "placeImg_src":imageSrc
                })
            })
                .then(response => response.text())
                .then(function (message) {
                }).catch(err => console.log("에러", err));
        }else {
            return;
        }
    }

    return (
        <>
            <Button>
                <label htmlFor="file">
                    <div className="btn-upload" style={{cursor: "pointer"}}>파일 업로드하기</div>
                </label>
                <input type="file" name="file" id="file" style={{display: "none"}} onChange={uploadFileReview}/>
            </Button>
                {/*<input type="button" onClick={submit} value="등록"/>*/}
            <PhotoContainer>
                <PhotoUl>
                {
                    cafeInfoImageData && cafeInfoImageData.map((image:string, i:number) => (
                        <PhotoLi key={i}>
                            <PhotoImg src={process.env.PUBLIC_URL+"/upload/" + image[0]} alt={image[0]}/>
                            {Number(sessionId) === cafeInfoUserNum[i] ? (<DeleteBtn className="material-symbols-rounded" onClick={removePhotoReview} id={image}>delete</DeleteBtn>) : null}
                        </PhotoLi>
                    ))
                }
                </PhotoUl>
            </PhotoContainer>
        </>
    )
}

export default CafeInfoPhotoReview;