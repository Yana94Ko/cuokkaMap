import React, {SetStateAction} from "react";
import styled from "styled-components";

import {Button, Icon} from "../../../styles/common";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../modules";
import {setIsOpenedLoginModal} from "../../../modules/userReducer";

const UploadButton = styled(Button)`
  width: 100%;
  padding: 0;
  display: flex;
  justify-content: center;

  & label div {
    width: 100%;
    padding: 1rem;
  }
`;
const PhotoContainer = styled.div`
  width: 100%;
`;
const PhotoUl = styled.ul`
  width: 100%;
  margin-top: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;
const PhotoLi = styled.li`
  overflow: hidden;
  position: relative;
  border-radius: 1rem;

`;
const PhotoImg = styled.img`
  width: 120%;
  height: 130px;
  border-radius: 1rem;
  object-fit: cover;
  z-index: 100;
  position: relative;
`;
const DeleteBtn = styled(Button)`
  position: absolute;
  bottom: 0.5rem;
  z-index: 101;
  right: 0.5rem;
  padding: 0.2rem;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;

  & span {
    color: ${props => props.theme.color.darkGray};

    &:hover {
      color: ${props => props.theme.color.zero};
    }
  }
`;

const NoReview = styled.p`
  width: 100%;
  text-align: center;
  font-weight: 300;
  line-height: 1.5rem;
  margin-top: 2rem;
`;

type PhotoReview = {
    cafeInfoContainer: object;
    setCafeInfoContainer: React.Dispatch<SetStateAction<object>>;
}
type dataType = {
    placeImg_num: number;
    placeImg_src: string;
    placeImg_writedate: string;
    place_num: number;
    user_num: number;
}
const CafeInfoPhotoReview = ({cafeInfoContainer, setCafeInfoContainer}: PhotoReview) => {
    const dispatch = useDispatch();

    const {isLoggedin} = useSelector((state: RootState) => state.userReducer)

    const sessionId = sessionStorage.getItem("id");
    let cafeInfoImageData: string[], cafeInfoUserNum: number[], cafeInfoPlaceNum: string | null;
    if (cafeInfoContainer !== undefined) {
        cafeInfoImageData = Object.values(cafeInfoContainer)[3].map((data: dataType) => ([data.placeImg_src, data.placeImg_num]));
        cafeInfoUserNum = Object.values(cafeInfoContainer)[3].map((data: dataType) => (data.user_num));
        cafeInfoPlaceNum = Object.values(cafeInfoContainer)[2]
    }
    // 허용가능한 확장자 목록!
    const ALLOW_FILE_EXTENSION = "jpg,jpeg,png";
    const FILE_SIZE_MAX_LIMIT = 10 * 1024 * 1024;  // 10MB

    //확장자 검사 함수
    const fileExtensionValid = ({name}: { name: string }): boolean => {
        //파일 확장자
        const extension = removeFileName(name);
        //주어진 확장자가 ALLOW_FILE)EXTENSION에 포함이 안되었거나 빈값일경우는 false
        if (!ALLOW_FILE_EXTENSION.includes(extension) || extension === "") {
            return false;
        }
        return true;
    }

    //파의 확장자를 추출하는 함수
    const removeFileName = (originalFileName: string): string => {
        //마지막 .의 위치
        const lastIndex = originalFileName.lastIndexOf(".");
        //없을경우 확장자가 존재하지 않는경우
        if (lastIndex < 0) return "";
        //lastIndex 다음위치부터 문자열 잘라줌 = 확장자
        return originalFileName.substring(lastIndex + 1).toLowerCase();
    }
    const uploadFileReview = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (isLoggedin) {
            const target = event.currentTarget;
            const files = (target.files as FileList)[0];

            if (files === undefined) {
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
            if (!fileExtensionValid(files)) {
                target.value = '';
                alert('업로드 가능한 확장자가 아닙니다');
                return;
            }
            //파일 용량 체크
            if (files.size > FILE_SIZE_MAX_LIMIT) {
                target.value = "";
                alert('업로드 가능한 최대 용량은 10MB 입니다');
                return;
            }

            // setPhotoData(files);
            const formData = new FormData();

            formData.append('place_img', files);
            formData.append('place_num', Object.values(cafeInfoContainer)[2]);
            formData.append('user_num', sessionId);

            fetch('/api/place/uploadPlaceImg', {
                method: 'POST',
                body: formData,
            })
                .then(response => console.log(response.text()))
                .then(() => fetchCafeInfo())
                .catch(err => console.log(JSON.parse(err)));
            target.value = "";
        }
    }
    const removePhotoReview = (
        event: React.MouseEvent<HTMLButtonElement>,
        image: any
    ) => {
        if (window.confirm('사진을 삭제하시겠습니까?')) {
            fetch('/api/place/deletePlaceImg', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "placeImg_num": image[1],
                    "user_num": sessionId,
                    "placeImg_src": image[0]
                })
            })
                .then(response => response.text())
                .then((message) => console.log(message))
                .then(() => fetchCafeInfo())
                .catch(err => console.log("에러", err));
        } else {
            return;
        }
    }

    function fetchCafeInfo() {
        fetch('/api/place/selectDetailPlaceInfo', {
            method: 'POST',
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                place_num: cafeInfoPlaceNum
            }),
        })
            .then(response => response.text())
            .then((message) => {
                const data = JSON.parse(message);
                setCafeInfoContainer({
                    data: JSON.parse(JSON.parse(data.selectedPlaceInfo).place_info),
                    filter: data.filterList,
                    placeNum: cafeInfoPlaceNum,
                    imageList: data.placeImgList,
                    reviewList: data.placeReviewList
                });
            })
    }

    const onUploadBtnClick = () => {
        if (!isLoggedin) {
            dispatch(setIsOpenedLoginModal(true));
        }
    }

    return (
        <>
            <UploadButton onClick={onUploadBtnClick}>
                <label htmlFor="file">
                    <div className="btn-upload" style={{cursor: "pointer"}}>사진 올리기</div>
                </label>
                <input type="file" name="file" id="file" disabled={!isLoggedin} style={{display: "none"}}
                       onChange={uploadFileReview}/>
            </UploadButton>
            {/*<input type="button" onClick={submit} value="등록"/>*/}
            <PhotoContainer>
                {
                    cafeInfoImageData?.length === 0 ? (
                        <NoReview>아직 등록된 후기가 없습니다!<br/>카페에 방문하셨다면 첫 후기를 올려주세요 :)</NoReview>
                    ) : (
                        <PhotoUl>
                            {cafeInfoImageData?.map((image: string, i: number) => (
                                <PhotoLi key={i}>
                                    <PhotoImg src={process.env.PUBLIC_URL + "/upload/" + image[0]} alt={image[0]}/>
                                    {Number(sessionId) === cafeInfoUserNum[i] && (
                                        <DeleteBtn
                                            onClick={(e: React.MouseEvent<HTMLButtonElement>) => removePhotoReview(e, image)}>
                                            <Icon className="material-symbols-rounded">delete</Icon>
                                        </DeleteBtn>)}
                                </PhotoLi>
                            ))}
                        </PhotoUl>

                    )
                }
            </PhotoContainer>
        </>
    )
}

export default CafeInfoPhotoReview;