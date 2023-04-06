import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import styled from "styled-components";

import {RootState} from "../../modules";
import Card from "./Card";
import {Icon} from "../../styles/common";

const Base = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const ReviewHeader = styled.div`
  position: absolute;
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

const ReviewImg = styled.img`
  width: 100%;
`;

// TODO(FE): 마이페이지 내 사진후기 컴포넌트 완료하기
// 사진후기 기능, 사진후기DB 완성되면 카드형태로 북마크 위치들 렌더
// 후기, 사진, 북마크 셋다 카드 형식 Card컴포넌트로 맞추고
// 삭제버튼도 동일한 위치에 두기
// assignees: hwanyb, SeongSilver
const PhotoReview = () => {
    const [reviewImgData, setReviewImgData] = useState<any[]>([]);

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
            .then((data: any) => setReviewImgData(JSON.parse(data)))
            .catch(err => console.log("에러", err));
    }

    return(
        <Base>
            {
                reviewImgData.length > 0 && (
                    reviewImgData.map((reviewImg: any, idx: number) => (
                        <Card key={idx}>
                            <ReviewHeader>
                                <PlaceName>라운드 브릭</PlaceName>
                                <DeleteBtn className="material-symbols-rounded">delete</DeleteBtn>
                            </ReviewHeader>
                            <ReviewImg />
                        </Card>
                    ))
                )
            }
        </Base>
    )
}

export default PhotoReview;