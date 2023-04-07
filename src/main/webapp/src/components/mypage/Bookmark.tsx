import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import styled from "styled-components";
import {Icon} from "../../styles/common";
import Card from "./Card";
import {RootState} from "../../modules";
import Pagination from "./Pagination";

const Base = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;
const CardWrapper = styled.div``;

const BookmarkHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-content: center;
  margin-top: 1rem;
`;

const PlaceName = styled.p`
  font-size: ${props => props.theme.fontSize.lg};
  font-weight: 700;
  margin-bottom:10px;
`;
const PlaceAdress = styled.p`
  font-size: ${props => props.theme.fontSize.base};
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

declare global {
    interface Window {
        kakao: any;
    }
}

const Bookmark = () => {
    const [bookmarkData, setBookmarkData] = useState<any[]>([]);
    const [bookmarkLength, setBookmarkLength] = useState<number>();
    const [needToSet, setNeedToSet] = useState<boolean>(true);
    //한 페이지에서 보여줄 게시물의 게수
    let limit = 3;
    //page 현재 페이지의 번호
    const [page, setPage] = useState<number>(1);
    //첫 게시물의 인덱스 1페이지일때 0, 2페이지일때 10, 3페이지일 때 20...
    let offset = (page-1) * limit;

    const userId = useSelector((state: RootState) => state.userReducer.userId);
    useEffect( ()=>{
        if(needToSet){
            fetchMyBookmark();
        }
            if(bookmarkData.length>0){
                console.log(offset, "/", bookmarkData.length > offset+limit ? offset+limit : bookmarkData.length)
                for (let i = offset; i < (bookmarkData.length > offset+limit ? offset+limit : bookmarkData.length); i++) {
                    if(document.getElementById("map" + i) !== null){

                    console.log("라랄랄"+i)
                    const y = JSON.parse(bookmarkData[i].place_info).y;
                    const x = JSON.parse(bookmarkData[i].place_info).x;
                    let mapContainer = document.getElementById("map" + i),
                        mapOption = {
                            center: new window.kakao.maps.LatLng(y, x), // 지도의 중심좌표
                            level: 4, // 지도의 확대 레벨
                            mapTypeId: window.kakao.maps.MapTypeId.ROADMAP, // 지도종류
                            // draggable: false,//마우스 드래그, 휠, 모바일 터치를 이용한 시점 변경(이동, 확대, 축소) 가능 여부
                            scrollwheel: false,//마우스 휠, 모바일 터치를 이용한 확대 및 축소 가능 여부
                            disableDoubleClick: false,//더블클릭 이벤트 및 더블클릭 확대 가능 여부
                            keyboardShortcuts: false
                        }
                    let map = new window.kakao.maps.Map(mapContainer, mapOption);
                    // 지도에 확대 축소 컨트롤을 생성한다
                    let zoomControl = new window.kakao.maps.ZoomControl();

                    // 지도의 우측에 확대 축소 컨트롤을 추가한다
                    map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);
                    let markerPosition  = new window.kakao.maps.LatLng(y,x);

                    let marker = new window.kakao.maps.Marker({
                        position: markerPosition
                    });

                    marker.setMap(map);

                    }
                }
            }

    }, [needToSet, offset])

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
                setNeedToSet(false);
            })
            .catch(err => console.log("에러", err));
    }

    function makeMap(){

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
                    "place_num" : e.target.id,
                    "user_num": userId,
                })
            })
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
                            <CardWrapper id="mapCard" key={idx}>
                                    <PlaceName>{JSON.parse(bookmarkData.place_info).place_name}</PlaceName>
                                <Card>
                                    <div id={`map${offset + idx}`} style={{width:"100%", height:"200px",margin:"auto"}}></div>
                                </Card>
                                <BookmarkHeader>
                                    <PlaceAdress>{JSON.parse(bookmarkData.place_info).road_address_name}</PlaceAdress>
                                    <DeleteBtn className="material-symbols-rounded"
                                               id={bookmarkData.place_num}
                                               onClick={onDeleteClick}
                                    >delete</DeleteBtn>
                                </BookmarkHeader>
                            </CardWrapper>
                        ))}
                        <Pagination dataLength={bookmarkLength} limit={limit} page={page} setPage={setPage} />
                    </>
                ) : (
                    <Notice>등록하신 북마크가 없습니다.</Notice>
                )
            }
        </Base>
    )
}

export default Bookmark;