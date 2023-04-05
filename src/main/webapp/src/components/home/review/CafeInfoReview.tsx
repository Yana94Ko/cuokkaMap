import React, {useState} from "react";
import styled, {css} from "styled-components";
import {Button, Icon} from "../../../styles/common";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../modules";
import {setIsOpenedLoginModal} from "../../../modules/userReducer";

const Base = styled.div``;
const ReviewForm = styled.form`
  width: 100%;
  margin-bottom: 2rem;
`;
const ItemWrapper = styled.div`
  margin-bottom: 2rem;
`;
const Label = styled.label`
  display: block;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const ReviewCount = styled.p`
  margin-bottom: 1rem;
  font-weight: 700;
`;

const EmojiPickerWrapper = styled.ul<{ mode: string }>`
  display: flex;
  justify-content: space-between;
  ${props => props.mode === "filter" && css`
    flex-wrap: wrap;
    border-bottom: 1px solid ${props => props.theme.color.darkGray};
    padding-bottom: 1rem;

    & ${Emoji} {
      border: none;
      cursor: default;
    }
  `}
`;


const Emoji = styled.li<{ reviewEmoji: number; mode: string }>`
  width: fit-content;
  cursor: pointer;
  display: flex;
  align-content: center;
  border-radius: 1rem;
  white-space: nowrap;
  border: 1px solid ${props => props.theme.color.darkGray};
  padding: 0.2rem 0.5rem;
  ${props => props.mode === "post" && props.reviewEmoji === parseInt(props.id) && css`
    border: 1px solid ${props.theme.color.primary};
  `}
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
  font-size: ${props => props.theme.fontSize.sm};
`;

const EmojiLength = styled.p`
  line-height: 20px;
  font-size: ${props => props.theme.fontSize.sm};
  margin-left: 5px;
  background-color: ${props => props.theme.color.gray};
  border-radius: 50%;
  width: 20px;
  height: 20px;
  text-align: center;
`;
const ReviewItem = styled.div`
  position: relative;
  padding: 1rem;
  border-bottom: 1px solid ${props => props.theme.color.gray};

  &:last-child {
    border-bottom: none;
  }
`;

const DeleteBtn = styled(Icon)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  color: ${props => props.theme.color.darkGray};

  &:hover {
    color: ${props => props.theme.color.zero};
  }
`;
const ReviewEmojiWrapper = styled.ul`
  margin-bottom: 5px;
`;

const ReviewTexrarea = styled.textarea`
  font-family: 'Noto Sans KR', sans-serif;
  border-radius: 1rem;
  border: 1px solid ${props => props.theme.color.darkGray};
  resize: none;
  width: 100%;
  height: 100px;
  padding: 1rem;

  &:focus {
    border: 1px solid ${props => props.theme.color.primary};

  }

  outline: none;
`;
const ReviewLength = styled.p`
  text-align: right;
  font-size: ${props => props.theme.fontSize.sm};
  margin-top: 5px;
`;
const SubmitReview = styled(Button)`
  width: 100%;
`;
const ReviewWrapper = styled.div``;

const NoReview = styled.p`
  text-align: center;
  font-weight: 300;
  line-height: 1.5rem;
`;

type Props = {
    cafeInfoContainer: any
}
const CafeInfoReview = ({cafeInfoContainer}: Props) => {
    const [copiedData, setCopiedData] = useState<any>({...cafeInfoContainer})

    const [reviewText, setReviewText] = useState<string>("");
    const [reviewEmoji, setReviewEmoji] = useState<number>(0);

    const dispatch = useDispatch();

    const {userId, isLoggedin} = useSelector((state: RootState) => state.userReducer);

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

    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setReviewText(e.target.value)
    }

    const onEmojiClick = (e: React.MouseEvent<HTMLLIElement>) => {
        if (reviewEmoji === parseInt(e.currentTarget.id)) {
            setReviewEmoji(0);
        } else {
            setReviewEmoji(parseInt(e.currentTarget.id));
        }
        // TODO(FE): BE 이모지 부분 배열로 바꾸어 달라고 요청한 뒤 이모지 중복선택할 수 있도록..
        // assignees: hwanyb
    }

    const onFilterClick = (e: React.MouseEvent<HTMLLIElement>) => {
        setCopiedData({
            ...copiedData,
            reviewList: copiedData.reviewList.filter((i: any) => i.placeReview_emoji === parseInt(e.currentTarget.id)
            )
        })
    }

    const onSubmit = (e: React.FormEvent) => {
        const formData = new FormData();

        e.preventDefault()

        formData.append('place_num', copiedData.placeNum);
        formData.append('user_num', userId);
        formData.append('placeReview', reviewText);
        formData.append('placeReview_emoji', JSON.stringify(reviewEmoji));

        if (!isLoggedin) {
            dispatch(setIsOpenedLoginModal(true));
        } else {
            fetch('/api/place/uploadPlaceReview', {
                method: 'POST',
                body: formData,
            }).then(res => console.log(res.text()))
                .then(() => {
                    setReviewText("");
                    setReviewEmoji(0);
                })
                // TODO(FE): 댓글 작성/ 삭제 후 다시 값을 받아와야 함
                // assignees: hwanyb
                .catch(err => console.log(err));
        }
    }
    const onDeleteClick = (
        e: React.MouseEvent<HTMLSpanElement>,
        review: any
    ) => {
        // TODO(FE): 리뷰 삭제 api 로직 작성
        // placeReview_num 에 해당하는 값이 없음 BE 확인해야함
        // assignees: hwanyb

        console.log(review)

        // fetch('/api/place/deletePlaceReview', {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json"
        //     },
        //     body: {
        //         "placeReview_num" : JSON.stringify(review.placeReview_num), //해당 값 없음
        //         "user_num" : userId
        //     },
        // });
    }
    return (
        <Base>
            <ReviewForm onSubmit={onSubmit}>
                <ItemWrapper>
                    <Label>이 카페 추천 키워드</Label>
                    <EmojiPickerWrapper mode="post">
                        {
                            emojiContent.map(item => (
                                <Emoji mode="post" onClick={onEmojiClick} key={item.id} id={item.id.toString()}
                                       reviewEmoji={reviewEmoji}>
                                    <EmojiImg src={item.imgSrc} alt={item.name}/>
                                    <EmojiText>{item.name}</EmojiText>
                                </Emoji>
                            ))
                        }
                    </EmojiPickerWrapper>
                </ItemWrapper>
                <ItemWrapper>
                    <Label>후기</Label>
                    <ReviewTexrarea minLength={5} maxLength={50} placeholder="간략한 후기를 남겨주세요 (5자 이상)" value={reviewText}
                                    onChange={onChange}/>
                    <ReviewLength>{reviewText.length}/50</ReviewLength>
                </ItemWrapper>
                <SubmitReview disabled={reviewText.length < 5} type="submit">후기 올리기</SubmitReview>
            </ReviewForm>
            <ReviewWrapper>
                {
                    cafeInfoContainer?.reviewList.length === 0 ? (
                        <>
                            <NoReview>아직 등록된 후기가 없습니다!</NoReview>
                            <NoReview>카페에 방문하셨다면 첫 후기를 올려주세요 :)</NoReview>
                        </>
                    ) : (
                        <>
                            <ReviewCount>{cafeInfoContainer.reviewList.length}개 후기</ReviewCount>
                            <EmojiPickerWrapper mode="filter">
                                {
                                    emojiContent.map(item => (
                                        <Emoji mode="filter" onClick={onFilterClick} key={item.id}
                                               id={item.id.toString()}
                                               reviewEmoji={reviewEmoji}>
                                            <EmojiImg src={item.imgSrc} alt={item.name}/>
                                            <EmojiText>{item.name}</EmojiText>
                                            <EmojiLength>{copiedData.reviewList.filter((i: any) => i.placeReview_emoji
                                                === item.id).length}</EmojiLength>
                                        </Emoji>
                                    ))
                                }
                            </EmojiPickerWrapper>
                            {
                                copiedData.reviewList.map((review: any, idx: number) => (
                                    <ReviewItem key={idx}>
                                        {
                                            review.user_num === parseInt(userId) &&
                                            <DeleteBtn className="material-symbols-rounded"
                                                       onClick={(e: React.MouseEvent<HTMLSpanElement>) => onDeleteClick(e, review)}>delete</DeleteBtn>
                                        }
                                        <ReviewEmojiWrapper>
                                            {
                                                emojiContent.filter(i => i.id === review.placeReview_emoji).map((emoji: any) => (
                                                    <Emoji mode="review" key={emoji.id} reviewEmoji={reviewEmoji}>
                                                        <EmojiImg src={emoji.imgSrc}/>
                                                        <EmojiText>{emoji.name}</EmojiText>
                                                    </Emoji>

                                                ))
                                            }
                                        </ReviewEmojiWrapper>
                                        <p>{review.placeReview}</p>

                                    </ReviewItem>
                                ))
                            }
                        </>
                    )
                }
            </ReviewWrapper>
        </Base>
    )
}

export default CafeInfoReview;