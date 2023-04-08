import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import styled from "styled-components";

import {RootState} from "../../modules";
import {Icon} from "../../styles/common";
import Card from "./Card";
import Pagination from "./Pagination";

const Base = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
`;
const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-content: center;
  padding: 2rem;
`;
const PlaceName = styled.p`
  font-size: ${props => props.theme.fontSize.lg};
  font-weight: 700;
  word-break: keep-all;
`;
const DeleteBtn = styled(Icon)`
  color: ${props => props.theme.color.darkGray};
  transition: all 0.2s ease-in-out;

  &:hover {
    color: ${props => props.theme.color.zero};
  }
`;
const Emoji = styled.div`
  width: fit-content;
  cursor: pointer;
  display: flex;
  align-content: center;
  border-radius: 1rem;
  white-space: nowrap;
  border: 1px solid ${props => props.theme.color.darkGray};
  padding: 0.2rem 0.5rem;
  margin-left: 2rem;
`;
const EmojiImg = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 5px;
  z-index: 1;
`;
const EmojiText = styled.p`
  line-height: 20px;
  font-weight: 500;
`;
const ReviewText = styled.p`
  font-weight: 500;
  padding: 2rem;
`;

const Notice = styled.h1`
  text-align: center;
  color: ${props => props.theme.color.darkGray};
`;

const Review = () => {
    const [reviewData, setReviewData] = useState<any[]>([]);
    const [reviewDataLength, setReviewDataLength] = useState<number>();
    //한 페이지에서 보여줄 게시물의 게수
    let limit = 6;
    //page 현재 페이지의 번호
    const [page, setPage] = useState<number>(1);
    //첫 게시물의 인덱스 1페이지일때 0, 2페이지일때 10, 3페이지일 때 20...
    let offset = (page-1) * limit;

    const userId = useSelector((state: RootState) => state.userReducer.userId);

    useEffect(() => {
        fetchMyReview()
    }, []);

    function fetchMyReview() {
        fetch('/api/place/mypageReview', {
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
                setReviewData(JSON.parse(data));
                setReviewDataLength(JSON.parse(data).length);
            })
            .catch(err => console.log("에러", err));
    }

    const emojiContent = [
        {
            id: 1,
            name: "커피",
            imgSrc: process.env.PUBLIC_URL + "/assets/images/emoji/coffee.png"
        },
        {
            id: 2,
            name: "디저트",
            imgSrc: process.env.PUBLIC_URL + "/assets/images/emoji/dessert.png"
        },
        {
            id: 3,
            name: "분위기",
            imgSrc: process.env.PUBLIC_URL + "/assets/images/emoji/vibe.png"
        },
        {
            id: 4,
            name: "친절",
            imgSrc: process.env.PUBLIC_URL + "/assets/images/emoji/smile.png"
        }
    ];

    const onDeleteClick = (
        e: React.MouseEvent<HTMLSpanElement>,
        review: any
    ) => {
        const result = window.confirm("후기를 삭제하시겠습니까?");
        if (result) {
            fetch('/api/place/deletePlaceReview', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "placeReview_num": review.placeReview_num,
                    "user_num": userId,
                })
            })
                .then((res) => console.log(res.text()))
                .then((message) => console.log(message))
                .then(() => fetchMyReview())
                .catch(err => console.log("에러", err));
        }
    }
    return (
        <Base>
            {
                reviewData.length > 0 ? (
                    <>
                    {reviewData.slice(offset, offset+limit).map((review: any, idx: number) => (
                        <Card key={idx}>
                            <ReviewHeader>
                                <PlaceName>{JSON.parse(review.place_info).place_name}</PlaceName>
                                <DeleteBtn className="material-symbols-rounded"
                                           onClick={(e: React.MouseEvent<HTMLSpanElement>) => onDeleteClick(e, review)}>delete</DeleteBtn>
                            </ReviewHeader>
                            {
                                emojiContent.filter(i => i.id === review.placeReview_emoji).map((emoji: any) => (
                                    <Emoji key={emoji.id}>
                                        <EmojiImg src={emoji.imgSrc}/>
                                        <EmojiText>{emoji.name}</EmojiText>
                                    </Emoji>

                                ))
                            }
                            <ReviewText>{review.placeReview}</ReviewText>
                        </Card>
                    ))}
                    <Pagination dataLength={reviewDataLength} limit={limit} page={page} setPage={setPage}/>
                </>

                ) : (
                    <Notice>등록하신 후기가 없습니다.</Notice>
                )
            }
        </Base>
    )
}

export default Review;