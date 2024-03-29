import React, {SetStateAction, useState} from "react";
import styled from "styled-components";

import {Button, Icon} from "../../../styles/common";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../modules";
import {setIsOpenedLoginModal} from "../../../modules/userReducer";
import {setCafeInfoContainer} from "../../../modules/cafeInfoReducer";

const UploadButton = styled(Button)`
  width: 100%;
  padding: 0;
  display: flex;
  justify-content: center;

  & label {
    width: 100%;
    padding: 1rem;
    cursor: pointer;
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
  height: 130px;
  overflow: hidden;
  position: relative;
  border-radius: 1rem;

`;
const PhotoImg = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 1rem;
  object-fit: cover;
  object-position: center;
  z-index: 100;
  position: relative;
  cursor: pointer;
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

    @media (hover: hover) {
      &:hover {
        color: ${props => props.theme.color.zero};
      }
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

type PropsType = {
    openPhotoModal: boolean
    setOpenPhotoModal: React.Dispatch<SetStateAction<boolean>>;
    modalImgSrc: string
    setModalImgSrc: React.Dispatch<SetStateAction<string>>;
}

const CafeInfoPhotoReview = ({openPhotoModal, setOpenPhotoModal, modalImgSrc, setModalImgSrc}: PropsType) => {
    const cafeInfoContainer = useSelector((state: RootState) => state.cafeInfoReducer.cafeInfoContainer);

    const dispatch = useDispatch();
    const {isLoggedin} = useSelector((state: RootState) => state.userReducer)

    const sessionId = sessionStorage.getItem("id");

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
            formData.append('place_num', cafeInfoContainer.placeNum);
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
                    "placeImg_num": image.placeImg_num,
                    "user_num": sessionId,
                    "placeImg_src": image.placeImg_src
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
                place_num: cafeInfoContainer.placeNum
            }),
        })
            .then(response => response.text())
            .then((message) => {
                const data = JSON.parse(message);
                dispatch(setCafeInfoContainer({
                    ...cafeInfoContainer,
                    data: JSON.parse(JSON.parse(data.selectedPlaceInfo).place_info),
                    filter: data.filterList,
                    placeNum: cafeInfoContainer.placeNum,
                    imageList: data.placeImgList,
                    reviewList: data.placeReviewList
                }));
            })
    }

    const onUploadBtnClick = () => {
        if (!isLoggedin) {
            dispatch(setIsOpenedLoginModal(true));
        }
    }

    const openPhotoModalHandler = (e: React.MouseEvent<HTMLImageElement>) => {
        if (e.target instanceof Element) {
            setModalImgSrc(e.target.id);
        }
        setOpenPhotoModal(true);
    }


    return (
        <>
            <UploadButton onClick={onUploadBtnClick}>
                <label htmlFor="file">
                    사진 올리기
                </label>
                <input type="file" name="file" id="file" disabled={!isLoggedin} style={{display: "none"}}
                       onChange={uploadFileReview}/>
            </UploadButton>
            <PhotoContainer>
                {
                    cafeInfoContainer.imageList.length === 0 ? (
                        <NoReview>아직 등록된 사진이 없습니다!<br/>카페에 방문하셨다면 첫 사진을 올려주세요 :)</NoReview>
                    ) : (
                        <PhotoUl>
                            {cafeInfoContainer.imageList.map((image: any, idx: number) => (
                                <PhotoLi key={idx}>
                                    <PhotoImg src={image.placeImg_src}
                                              id={image.placeImg_src}
                                              alt={image.placeImg_src}
                                              onClick={openPhotoModalHandler}
                                    />
                                    {Number(sessionId) === image.user_num && (
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