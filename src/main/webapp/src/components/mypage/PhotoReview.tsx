import React, {SetStateAction, useEffect, useState} from "react";
import {useSelector} from "react-redux";
import styled from "styled-components";

import {RootState} from "../../modules";
import Card from "./Card";
import {Icon} from "../../styles/common";
import Pagination from "./Pagination";
import {ContentCount} from "../../pages/Mypage";

const Base = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
  gap: 2rem;
  @media ${props => props.theme.windowSize.mobile} {
    grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));
  }
`;

const CardWrapper = styled.div``;

const ReviewFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding: 0 0.5rem;
`;

const Left = styled.div`
`;

const PlaceName = styled.p`
  font-size: ${props => props.theme.fontSize.lg};
  font-weight: 700;
  margin-bottom: 5px;
`;

const DeleteBtn = styled(Icon)`
  color: ${props => props.theme.color.darkGray};
  transition: all 0.2s ease-in-out;

  @media (hover: hover) {
    &:hover {
      color: ${props => props.theme.color.zero};
    }
  }
`;

const ReviewDate = styled.p`
  font-size: ${props => props.theme.fontSize.sm};
  font-weight: 300;
`;

const ReviewImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  background-color: ${props => props.theme.color.lightGray};
`;

const Notice = styled.h1`
  text-align: center;
  color: ${props => props.theme.color.darkGray};
`;

type Props = {
    setOpenPhotoModal: React.Dispatch<SetStateAction<boolean>>;
    setModalImgSrc: React.Dispatch<SetStateAction<string>>
}

const PhotoReview = ({setOpenPhotoModal, setModalImgSrc}: Props) => {
    const [reviewImgData, setReviewImgData] = useState<any[]>([]);
    const [imgDataLength, setImgDataLength] = useState<number>();

    //한 페이지에서 보여줄 게시물의 게수
    let limit = 12;
    //page 현재 페이지의 번호
    const [page, setPage] = useState<number>(1);
    //첫 게시물의 인덱스 1페이지일때 0, 2페이지일때 10, 3페이지일 때 20...
    let offset = (page - 1) * limit;

    const userId = useSelector((state: RootState) => state.userReducer.userId);

    useEffect(() => {
        fetchMyImg()
    }, []);

    function fetchMyImg() {
        fetch('/api/place/mypageImg', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "user_num": userId
            }),
        })
            .then(res => res.text())
            .then((data: any) => {
                setReviewImgData(JSON.parse(data))
                setImgDataLength(JSON.parse(data).length)
            })
            .catch(err => console.log("에러", err));
    }

    const onDeleteClick = (
        e: React.MouseEvent<HTMLSpanElement>,
        reviewImg: any
    ) => {
        const result = window.confirm("이미지를 삭제하시겠습니까?");
        if (result) {
            fetch('/api/place/deletePlaceImg', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "placeImg_num": reviewImg.placeImg_num,
                    "user_num": userId,
                    "placeImg_src": reviewImg.placeImg_src
                })
            })
                .then((res) => console.log(res.text()))
                .then((message) => console.log(message))
                .then(() => fetchMyImg())
                .catch(err => console.log("에러", err));
        }
    }

    const openPhotoModalHandler = (e: React.MouseEvent<HTMLImageElement>, reviewImg: string) => {
        if (e.target instanceof Element) {
            setModalImgSrc(process.env.PUBLIC_URL + "/upload/" + reviewImg);
        }
        setOpenPhotoModal(true);
    }

    return (
        reviewImgData.length > 0 ? (
            <>
                <ContentCount>{reviewImgData.length}개 사진</ContentCount>
                <Base>
                    {
                        reviewImgData.slice(offset, offset + limit).map((reviewImg: any, idx: number) => (
                            <CardWrapper key={idx}>
                                <Card height={250}>
                                    <ReviewImg
                                        onClick={(e: React.MouseEvent<HTMLImageElement>) => openPhotoModalHandler(e, reviewImg.placeImg_src)}
                                        src={process.env.PUBLIC_URL + "/upload/" + reviewImg.placeImg_src}/>
                                </Card>
                                <ReviewFooter>
                                    <Left>
                                        <PlaceName>{JSON.parse(reviewImg.place_info).place_name}</PlaceName>
                                        <ReviewDate>{reviewImg.placeImg_writedate.slice(0, 10)} {reviewImg.placeImg_writedate.slice(11)}</ReviewDate>
                                    </Left>
                                    <DeleteBtn className="material-symbols-rounded"
                                               onClick={(e: React.MouseEvent<HTMLSpanElement>) => onDeleteClick(e, reviewImg)}
                                    >delete</DeleteBtn>
                                </ReviewFooter>
                            </CardWrapper>
                        ))
                    }
                    <Pagination dataLength={imgDataLength} limit={limit} page={page} setPage={setPage}/>
                </Base>
            </>

        ) : (
            <Notice>등록하신 사진 후기가 없습니다.</Notice>
        )
    )
}

export default PhotoReview;