import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import styled from "styled-components";

import {RootState} from "../../modules";
import Card from "./Card";
import {Icon} from "../../styles/common";
import Pagination from "./Pagination";

const Base = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
  gap: 2rem;
`;

const CardWrapper = styled.div``;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-content: center;
  margin-top: 1rem;
`;

const PlaceName = styled.p`
  font-size: ${props => props.theme.fontSize.lg};
  font-weight: 700;
`;
const DeleteBtn = styled(Icon)`
  color: ${props => props.theme.color.darkGray};
  transition: all 0.2s ease-in-out;

  &:hover {
    color: ${props => props.theme.color.zero};
  }
`;

const ReviewImg = styled.img`
  width: 110%;
`;

const Notice = styled.h1`
  text-align: center;
  color: ${props => props.theme.color.darkGray};
`;

const PhotoReview = () => {
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
    return (
        reviewImgData.length > 0 ? (
            <Base>
                {
                    reviewImgData.slice(offset, offset + limit).map((reviewImg: any, idx: number) => (
                        <CardWrapper key={idx}>
                            <Card height={200}>
                                <ReviewImg src={process.env.PUBLIC_URL + "/upload/" + reviewImg.placeImg_src}/>
                            </Card>
                            <ReviewHeader>
                                <PlaceName>{JSON.parse(reviewImg.place_info).place_name}</PlaceName>
                                <DeleteBtn className="material-symbols-rounded"
                                           onClick={(e: React.MouseEvent<HTMLSpanElement>) => onDeleteClick(e, reviewImg)}
                                >delete</DeleteBtn>
                            </ReviewHeader>
                        </CardWrapper>
                    ))
                }
                <Pagination dataLength={imgDataLength} limit={limit} page={page} setPage={setPage}/>
            </Base>
        ) : (
            <Notice>등록하신 사진 후기가 없습니다.</Notice>
        )
    )
}

export default PhotoReview;