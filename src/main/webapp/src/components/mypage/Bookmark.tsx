import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import styled from "styled-components";
import {Icon} from "../../styles/common";
import Card from "./Card";
import {RootState} from "../../modules";
import Pagination from "./Pagination";

const Base = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;
const CardWrapper = styled.div`

`;

const BookmarkHeader = styled.div`
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
`;

const ReviewImg = styled.img`
  width: 110%;
`;

const Notice = styled.h1`
  text-align: center;
  color: ${props => props.theme.color.darkGray};
`;
// TODO(FE): 마이페이지 내 북마크 컴포넌트 완료하기
// 북마크 기능, DB 완성되면 카드형태로 북마크 위치들 렌더
// 후기, 사진, 북마크 셋다 카드 형식 Card컴포넌트로 맞추고
// 삭제버튼도 동일한 위치에 두기
// assignees: hwanyb, SeongSilver
const Bookmark = () => {
    const [bookmarkData, setBookmarkData] = useState<any[]>([]);
    const [bookmarkLength, setBookmarkLength] = useState<number>();
    //한 페이지에서 보여줄 게시물의 게수
    let limit = 3;
    //page 현재 페이지의 번호
    const [page, setPage] = useState<number>(1);
    //첫 게시물의 인덱스 1페이지일때 0, 2페이지일때 10, 3페이지일 때 20...
    let offset = (page-1) * limit;

    const userId = useSelector((state: RootState) => state.userReducer.userId);

    useEffect(() => {
        fetchMyBookmark()
    }, []);

    function fetchMyBookmark() {
        fetch('/api/place/mypageFavoritePlace', {
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
                setBookmarkData(JSON.parse(data));
                setBookmarkLength(JSON.parse(data).length);
            })
            .catch(err => console.log("에러", err));
    }

    const onDeleteClick = (e:React.MouseEvent<HTMLSpanElement>) => {
        if (!(e.target instanceof Element)) {
            return
        }
        if(window.confirm("북마크를 삭제하시겠습니까?")) {
            fetch('/api/place/deleteFavoritePlace', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "favoritePlace_num" : e.target.id,
                    "user_num": userId,
                })
            })
                .then((res) => console.log(res.text()))
                .then((message) => console.log(message))
                .then(() => fetchMyBookmark())
                .catch(err => console.log("에러", err));
        }else{
            return;
        }
    }

    return(
        <Base>
            {
                bookmarkData.length > 0 ? (
                    <>
                    {bookmarkData.slice(offset, offset+limit).map((bookmarkData: any, idx: number) => (
                            <CardWrapper key={idx}>
                                <Card>
                                    <ReviewImg src="#" alt="카페지도?"/>
                                </Card>
                                <BookmarkHeader>
                                    <PlaceName>{JSON.parse(bookmarkData.place_info).place_name}</PlaceName>
                                    <DeleteBtn className="material-symbols-rounded"
                                               id={bookmarkData.place_num}
                                               onClick={onDeleteClick}
                                    >delete</DeleteBtn>
                                </BookmarkHeader>
                            </CardWrapper>

                        ))}
                        <Pagination dataLength={bookmarkLength} limit={limit} page={page} setPage={setPage}/>
                    </>
                ) : (
                    <Notice>등록하신 북마크가 없습니다.</Notice>
                )
            }
        </Base>
    )
}

export default Bookmark;