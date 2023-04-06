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
`;
const PlaceName = styled.p`
  font-size: ${props => props.theme.fontSize.lg};
  font-weight: 700;
`;
const DeleteBtn = styled(Icon)`
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
`;

// TODO(FE): 마이페이지 내 후기 컴포넌트 완료하기
// 후기 기능, 후기DB 완성되면 카드형태로 북마크 위치들 렌더
// 후기, 사진, 북마크 셋다 카드 형식 Card컴포넌트로 맞추고
// 삭제버튼도 동일한 위치에 두기
// assignees: hwanyb, SeongSilver
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

    return (
        <Base>
            {
                reviewData.length > 0 && (
                    reviewData.map((review: any, idx: number) => (
                        <Card key={idx}>
                            <ReviewHeader>
                                <PlaceName>라운드 브릭</PlaceName>
                                <DeleteBtn className="material-symbols-rounded">delete</DeleteBtn>
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