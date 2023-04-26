import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import styled from "styled-components";

import {RootState} from "../../modules";
import {Button, Icon} from "../../styles/common";
import Card from "./Card";
import Pagination from "./Pagination";
import {setIsBookmarkMode} from "../../modules/filterReducer";
import {useNavigate} from "react-router-dom";
import {setCafeInfoContainer} from "../../modules/cafeInfoReducer";
import {setIsOpenedCafeInfo, setNeedToFocus} from "../../modules/viewReducer";
import {ContentCount} from "../../pages/Mypage";

const Base = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;

  @media ${props => props.theme.windowSize.mobile} {
    grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));
  }
`;

const CardWrapper = styled.div``;
const BookmarkHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;
const BookmarkFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-content: center;
  margin-top: 1rem;
  line-height: 20px;
`;

const PlaceName = styled.p`
  font-size: ${props => props.theme.fontSize.lg};
  font-weight: 700;
`;

const MapGuideText = styled.p`
  margin-left: 10rem;
  text-align: right;
  font-size: ${props => props.theme.fontSize.sm};
  color: ${props => props.theme.color.darkGray};
  display: none;
`;

const GoToMapBtn = styled(Button)`
  padding: 0;
  font-size: ${props => props.theme.fontSize.sm};
  background-color: transparent;
  display: flex;
  justify-content: end;

  &::before {
    content: "맵에서 보기";
    color: ${props => props.theme.color.darkGray};
    display: none;
    line-height: 20px;
    margin-right: 10px;
  }

  @media (hover: hover) {
    &:hover {
      &::before {
        display: inline;
      }
    }
  }
`;

const PlaceAdress = styled.p`
  font-size: ${props => props.theme.fontSize.sm};
  font-weight: 500;
`;

const FavoriteMap = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  touch-action: none;
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

const Notice = styled.h1`
  text-align: center;
  color: ${props => props.theme.color.darkGray};
`;

declare global {
    interface Window {
        kakao: any;
    }
}

const Favorite = () => {
    const [bookmarkData, setBookmarkData] = useState<any[]>([]);
    const [bookmarkLength, setBookmarkLength] = useState<number>();
    const [needToSet, setNeedToSet] = useState<boolean>(true);
    //한 페이지에서 보여줄 게시물의 게수
    let limit = 12;
    //page 현재 페이지의 번호
    const [page, setPage] = useState<number>(1);
    //첫 게시물의 인덱스 1페이지일때 0, 2페이지일때 10, 3페이지일 때 20...
    let offset = (page - 1) * limit;

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const userId = useSelector((state: RootState) => state.userReducer.userId);


    useEffect(() => {
        if (needToSet) {
            fetchMyBookmark();
        }
        if (bookmarkData.length > 0) {
            for (let i = offset; i < (bookmarkData.length > offset + limit ? offset + limit : bookmarkData.length); i++) {
                if (document.getElementById("map" + i) !== null) {

                    const y = JSON.parse(bookmarkData[i].place_info).y;
                    const x = JSON.parse(bookmarkData[i].place_info).x;
                    let mapContainer = document.getElementById("map" + i),
                        mapOption = {
                            center: new window.kakao.maps.LatLng(y, x), // 지도의 중심좌표
                            level: 4, // 지도의 확대 레벨
                            mapTypeId: window.kakao.maps.MapTypeId.ROADMAP, // 지도종류
                            draggable: false,//마우스 드래그, 휠, 모바일 터치를 이용한 시점 변경(이동, 확대, 축소) 가능 여부
                            scrollwheel: false,//마우스 휠, 모바일 터치를 이용한 확대 및 축소 가능 여부
                            disableDoubleClick: false,//더블클릭 이벤트 및 더블클릭 확대 가능 여부
                            keyboardShortcuts: false
                        }
                    let map = new window.kakao.maps.Map(mapContainer, mapOption);
                    // 지도에 확대 축소 컨트롤을 생성한다
                    // let zoomControl = new window.kakao.maps.ZoomControl();

                    // 지도의 우측에 확대 축소 컨트롤을 추가한다
                    // map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

                    let markerPosition = new window.kakao.maps.LatLng(y, x);

                    let favoriteMarkerSrc = process.env.PUBLIC_URL + "/assets/images/markers/bookmark.png",
                        favoriteMarkerSize = new window.kakao.maps.Size(38, 38),
                        favoriteMarkerImg = new window.kakao.maps.MarkerImage(favoriteMarkerSrc, favoriteMarkerSize);

                    let marker = new window.kakao.maps.Marker({
                        position: markerPosition,
                        image: favoriteMarkerImg
                    });

                    marker.setMap(map);
                    // 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
                    var zoomControl = new window.kakao.maps.ZoomControl();
                    map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

                    const mapDiv = document.getElementById(`map${i}`);
                    //전체 감싸고있는 div
                    const mapContent = mapDiv.lastChild.childNodes[0] as HTMLDivElement;
                    //읍면동, 시, 도 움직이는 바
                    const mapZoomBar = mapDiv.lastChild.childNodes[0].childNodes[1] as HTMLDivElement;
                    //줌인 버튼 +
                    const mapZoomIn = mapDiv.lastChild.childNodes[0].childNodes[0] as HTMLButtonElement;
                    //줌아웃버튼 -
                    const mapZoomOut = mapDiv.lastChild.childNodes[0].childNodes[2] as HTMLButtonElement;
                    //div 호버시 나오는 읍면동, 시, 도 텍스트 숨기기
                    (mapDiv.lastChild.childNodes[0].childNodes[3].childNodes[0] as HTMLDivElement).style.display = 'none';
                    (mapDiv.lastChild.childNodes[0].childNodes[3].childNodes[1] as HTMLDivElement).style.display = 'none';
                    (mapDiv.lastChild.childNodes[0].childNodes[3].childNodes[2] as HTMLDivElement).style.display = 'none';
                    (mapDiv.lastChild.childNodes[0].childNodes[3].childNodes[3] as HTMLDivElement).style.display = 'none';
                    (mapDiv.lastChild.childNodes[0].childNodes[3].childNodes[4] as HTMLDivElement).style.display = 'none';


                    // mapContent.style.cssText = 'position:absolute; bottom:0; right:0; margin-top:16vh; margin-right:-4vw; transform:rotate(270deg)';
                    //움직이는 바 숨기기
                    mapZoomBar.style.display = "none";
                    //전체 감싸는 div 움직이는 css
                    // mapContent.style.position = "absolute";
                    // mapContent.style.top = "0";
                    // mapContent.style.right = "0";
                    mapContent.style.marginTop = "20px";
                    mapContent.style.marginLeft = "-20px";
                    // //아래에 가로로 놓자해서 돌린것
                    // mapContent.style.transform = "rotate(270deg)";
                    // //위 코드에 맞춰서 돌린것
                    // mapZoomIn.style.transform="rotate(-90deg)";
                    // mapZoomOut.style.transform="rotate(90deg)";

                    //반응형 해보려고했던것
                    // if(document.body.offsetWidth <= 768){
                    //     mapContent.style.marginTop = "-2vh";
                    //     mapContent.style.marginLeft = "-7vw";
                    // };
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

    const onDeleteClick = (e: React.MouseEvent<HTMLSpanElement>) => {
        if (!(e.target instanceof Element)) {
            return
        }
        if (window.confirm("즐겨찾기를 삭제하시겠습니까?")) {
            fetch('/api/place/deleteFavoritePlace', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "place_num": e.target.id,
                    "user_num": userId,
                })
            })
                .then(() => fetchMyBookmark())
                .catch(err => console.log("에러", err));
        } else {
            return;
        }
    }

    const onGoToMapBtnClick = (
        e: React.MouseEvent<HTMLButtonElement>,
        bookmarkData: any) => {
        fetchPlaceDetail(bookmarkData.place_num);
    }

    function fetchPlaceDetail(placeNum: string): void {
        fetch('/api/place/selectDetailPlaceInfo', {
            method: 'POST',
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                place_num: placeNum,
                user_num: sessionStorage.getItem("id") === null ? "" : sessionStorage.getItem("id")
            }),
        })
            .then(response => response.text())
            .then((message) => {
                const data = JSON.parse(message);
                dispatch(setCafeInfoContainer({
                    data: JSON.parse(JSON.parse(data.selectedPlaceInfo).place_info),
                    filter: data.filterList,
                    placeNum: placeNum,
                    imageList: data.placeImgList,
                    reviewList: data.placeReviewList,
                    isBookmarked: data.isBookmarked
                }));
            })
            .then(() => {
                dispatch(setIsBookmarkMode(true));
                dispatch(setNeedToFocus(true));
            })
            .then(() => {
                navigate("/");
                dispatch(setIsOpenedCafeInfo(true));
            })
            .catch(err => console.log(err));
    }


    return (
        bookmarkData.length > 0 ? (
            <>
                <ContentCount>{bookmarkData.length}개 즐겨찾기</ContentCount>
                <Base>
                    {bookmarkData.slice(offset, offset + limit).map((bookmarkData: any, idx: number) => (
                        <CardWrapper id="mapCard" key={idx}>
                            <BookmarkHeader>
                                <PlaceName>{JSON.parse(bookmarkData.place_info).place_name}</PlaceName>
                                <MapGuideText>맵에서 보기</MapGuideText>
                                <GoToMapBtn
                                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => onGoToMapBtnClick(e, bookmarkData)}>
                                    <Icon className="material-symbols-rounded">map</Icon>
                                </GoToMapBtn>
                            </BookmarkHeader>
                            <Card height={200}>
                                <FavoriteMap id={`map${offset + idx}`}/>
                            </Card>
                            <BookmarkFooter>
                                <PlaceAdress>{JSON.parse(bookmarkData.place_info).road_address_name}</PlaceAdress>
                                <DeleteBtn className="material-symbols-rounded"
                                           id={bookmarkData.place_num}
                                           onClick={onDeleteClick}
                                >delete</DeleteBtn>
                            </BookmarkFooter>
                        </CardWrapper>
                    ))}
                    <Pagination dataLength={bookmarkLength} limit={limit} page={page} setPage={setPage}/>
                </Base>
            </>
        ) : (
            <Notice>등록하신 즐겨찾기가 없습니다.</Notice>
        )
    )
}

export default Favorite;