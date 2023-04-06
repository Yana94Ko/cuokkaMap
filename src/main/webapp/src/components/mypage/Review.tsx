import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import styled from "styled-components";

import {RootState} from "../../modules";
import {Icon} from "../../styles/common";
import Card from "./Card";

const Base = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;
const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-content: center;
  padding: 1rem;
`;
const PlaceName = styled.p`
  font-size: ${props => props.theme.fontSize.lg};
  font-weight: 700;
`;
const DeleteBtn = styled(Icon)``;
const Emoji = styled.div`
  width: fit-content;
  cursor: pointer;
  display: flex;
  align-content: center;
  border-radius: 1rem;
  white-space: nowrap;
  border: 1px solid ${props => props.theme.color.darkGray};
  padding: 0.2rem 0.5rem;
  margin-left: 1rem;
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
  padding: 1rem;
`;

const Review = () => {
    const [reviewData, setReviewData] = useState<any[]>([]);

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
            .then((data: any) => setReviewData(JSON.parse(data)))
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
    // TODO(FE): 후기 페이징 기능 구현하기
    // assignees: SeongSilver
    return (
        <Base>
            {
                reviewData.length > 0 && (
                    reviewData.map((review: any, idx: number) => (
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
                    ))
                )
            }
        </Base>
    )
}

export default Review;