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
const CafeInfoPhotoReview = ({cafeInfoContainer}: PhotoReview) => {
    const sessionId = sessionStorage.getItem("id");
    let cafeInfoImageData:string[], cafeInfoUserNum:number[];
    if(cafeInfoContainer !== undefined){
        cafeInfoImageData = Object.values(cafeInfoContainer)[3].map((data:dataType) => (data.placeImg_src));
        cafeInfoUserNum = Object.values(cafeInfoContainer)[3].map((data:dataType) => (data.user_num));
    }
    console.log(cafeInfoImageData);
    console.log(cafeInfoUserNum);

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

        // // 폼 객체 values 값을 순회.
        // for (const pair of formData.values()) {
        //     console.log(pair);
        // }

        fetch('/api/place/uploadPlaceImg',{
            method:'POST',
            body: formData,
        })
            .then(response => response.text())
            .catch(err => console.log(JSON.parse(err)));
        target.value = "";
    }

    return (
        <>
            <Button>
                <label htmlFor="file" style={{cursor: "pointer"}}>
                    <div className="btn-upload">파일 업로드하기</div>
                </label>
                <input type="file" name="file" id="file" style={{display: "none"}} onChange={uploadFileReview}/>
            </Button>
                {/*<input type="button" onClick={submit} value="등록"/>*/}
            <div style={{height: "100%"}}>
                <ul style={{marginTop:"20px", display:"flex", flexWrap:"wrap"}}>
                {
                    cafeInfoImageData && cafeInfoImageData.map((image:string, i:number) => (
                        <li key={i} style={{width:"150px", margin:"5px"}}>
                            <img src={process.env.PUBLIC_URL+"/upload/" + image} width="150px" alt="image"/>
                            <>
                            {Number(sessionId) === cafeInfoUserNum[i] ? (<span style={{position:"absolute", right:"10px", color:"white"}}>x</span>) : null}
                            </>
                        </li>
                    ))
                }
                </ul>
            </div>
        </>
    )
}

export default CafeInfoPhotoReview;