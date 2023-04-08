import React, {SetStateAction, useEffect, useState} from "react";
import styled, {css} from "styled-components";
import {Button, Icon} from "../../styles/common";
import Header from "./header/Header";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../modules";
import {setIsOpenedLoginModal} from "../../modules/userReducer";
import {setIsOpenedCafeInfo, setIsOpenedPostCafe} from "../../modules/viewReducer";
import PostCafeInfo from "../home/PostCafeInfo";
import CafeInfo from "../home/CafeInfo";
import {setCurrentFilter, setIsBookmarkMode} from "../../modules/filterReducer";

const Base = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  display: flex;
  justify-content: end;
  @media ${props => props.theme.windowSize.mobile} {
    /* mobile viewport bug fix */
    /* iOS only */
    @supports (-webkit-touch-callout: none) {
      min-height: -webkit-fill-available;
    }
  }
`;
const MapContainer = styled.div<{ isOpenedPostCafe: boolean }>`
  width: 100vw;
  min-height: 100vh;
  ${props => props.isOpenedPostCafe && css`
    width: calc(100vw - 300px);

    @media ${props => props.theme.windowSize.tablet} {
      width: 100vw;
      height: calc(100vh - 300px);
      min-height: calc(100vh - 300px);
    }
  `}
`;

// const CurrentLocationBtn = styled(Button)`
//   position: absolute;
//   top: 20rem;
//   right: 3rem;
//   z-index: 999;
//   background-color: ${props => props.theme.color.white};
//   padding: 0.5rem;
//   box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
//
//   & span {
//     color: ${props => props.theme.color.primary};
//
//     @media ${props => props.theme.windowSize.mobile} {
//       right: 2rem;
//     }
//   }
// `;

const AddCafeButton = styled(Button)`
  transition: all 0.2s ease-in-out;
  z-index: 999;
  position: absolute;
  bottom: 3rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  border-radius: 2rem;
  padding: 1rem 3rem;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  background-color: #fff;
  color: ${props => props.theme.color.primary};
  border: 2px solid ${props => props.theme.color.primary};

  & span {
    margin-right: 10px;
    transition: all 0.2s ease-in-out;
  }

  &:hover {
    background-color: ${props => props.theme.color.primary};
    color: ${props => props.theme.color.white};

    & span {
      color: ${props => props.theme.color.white};
    }
  }

  @media ${props => props.theme.windowSize.mobile} {
    bottom: 5rem;
  }
  @media not all and (min-resolution: .001dpcm) {
    @supports (-webkit-appearance:none) {
      /* 이 안에 Safari(10.1 이상)에서만 적용할 스타일 작성 */
      bottom: 8rem;
    }
  }
`;

const BookmarkBtn = styled(Button)<{ isBookmarkMode: boolean }>`
  position: absolute;
  z-index: 111;
  top: 20%;
  right: 3rem;
  padding: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease-in-out;

  ${props => props.isBookmarkMode ? css`
    background-color: ${props => props.theme.color.primary};

    & span {
      color: ${props => props.theme.color.white};
    }
  ` : css`
    background-color: ${props => props.theme.color.white};
  `}
  &:hover {
    transform: scale(110%);
  }

  @media ${props => props.theme.windowSize.mobile} {
    right: 2rem;
  }
`;
const BookmarkIcon = styled(Icon)`
  color: ${props => props.theme.color.primary};
  transition: all 0.1s ease-in-out;

  &:hover {
    transform: scale(110%);
  }
`;


declare global {
    interface Window {
        kakao: any;
    }
}


type KakaoMapProps = {
    dbData: any[];
    setDBData: React.Dispatch<SetStateAction<any[]>>;
    setSearchDBKeyword: React.Dispatch<React.SetStateAction<string>>;
    markers: any[];
    setMarkers: React.Dispatch<SetStateAction<any[]>>;
    removeMarker: () => void;
    dbFilterData: any[];
    searchDB: () => void;
}
const KakaoMap = ({
                      dbData,
                      setDBData,
                      setSearchDBKeyword,
                      markers,
                      setMarkers,
                      removeMarker,
                      dbFilterData,
                      searchDB
                  }: KakaoMapProps) => {
    const dispatch = useDispatch();
    /*------------------------------------------- 상태 관련 START -------------------------------------------*/
    const isLoggedin = useSelector((state: RootState) => state.userReducer.isLoggedin);
    const {isOpenedCafeInfo, isOpenedPostCafe} = useSelector((state: RootState) => state.viewReducer);
    const isBookmarkMode = useSelector((state: RootState) => state.filterReducer.isBookmarkMode);
    const [isPostedCafe, setIsPostedCafe] = useState<boolean>(false);
    /*------------------------------------------- [ END ] 상태 관련 -------------------------------------------*/


    /*------------------------------------------- 검색/ 필터링 관련 START -------------------------------------------*/
    //검색어 : PostCafeInfo 컴포넌트의 카페찾기 input에서 조작
    const [keyword, setKeyword] = useState<string>("");
    const currentFilter = useSelector((state: RootState) => state.filterReducer.currentFilter);
    const [searchCafeInfo, setSearchCafeInfo] = useState<string>("");
    /*------------------------------------------- [ END ] 검색 필터링 관련 -------------------------------------------*/

    /*------------------------------------------- 지도, 마커 등 맵 관련 START -------------------------------------------*/
    const [mapState, setMapState] = useState<any>();

    var markersTmp: any[] = [];
    var markerAPI: any[] = [];
    if (isBookmarkMode) {
        var filterMarkerImgSrc = `${process.env.PUBLIC_URL}/assets/images/markers/bookmark.png`;
    } else {
        if (currentFilter.length === 0) {
            var filterMarkerImgSrc = `${process.env.PUBLIC_URL}/assets/images/markers/all.png`;
        } else {
            var filterMarkerImgSrc = `${process.env.PUBLIC_URL}/assets/images/markers/${currentFilter}.png`;
        }
    }
    var filterImgSize = new window.kakao.maps.Size(38, 38);
    var filterMarkerImg = new window.kakao.maps.MarkerImage(filterMarkerImgSrc, filterImgSize);
    /*------------------------------------------- [ END ] 지도, 마커 등 맵 관련 -------------------------------------------*/

    /*------------------------------------------- 데이터 관련 START -------------------------------------------*/
    //MapNav에서 검색된 데이터를 담을 마커 배열 state
    const [searchedPlaceInfoInNav, setSearchedPlaceInfoInNav] = useState<object[]>([]);
    //DB검색된 카페 클릭시 해당 마커의 정보만 담을 state
    const [cafeInfoContainer, setCafeInfoContainer] = useState<object>();
    //마커를 클릭해서 카페추가에 올릴 정보
    const [clickMarkerCafeInfo, setClickMarkerCafeInfo] = useState<any>();


    /*------------------------------------------- [ END ] 데이터 관련 -------------------------------------------*/


    /*=========================================================================================================*/
    /*============================================== 맵 관련 START ==============================================*/

    /*====================================== 지도 초기설정 외 START =====================================*/
    // 1. 지도 생성하기
    useEffect(() => {
        let container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
        if (mapState === undefined) {
            var options = { //지도를 생성할 때 필요한 기본 옵션
                center: new window.kakao.maps.LatLng(37.56667, 126.97806), //지도의 중심좌표.
                level: 3 //지도의 레벨(확대, 축소 정도)
            };
        } else {
            options = {
                center: new window.kakao.maps.LatLng(mapState.getCenter().getLat(), mapState.getCenter().getLng()),
                level: 3,
            };
        }
        let map = new window.kakao.maps.Map(container, options); //지도 생성 및 객체 리턴
        setMapState(map);
    }, []);
    //장소 검색 객체 생성
    var placeSearch = new window.kakao.maps.services.Places();

    //검색 결과 목록이나 마커를 클릭했을 때 장소명을 표시할 인포 윈도우 생성
    var infowindow = new window.kakao.maps.InfoWindow({zIndex: 1});

    /*====================================== [ END ] 지도 초기설정 외 =====================================*/


    /*====================================== 마커 공통 START =====================================*/
    //모든 마커를 제거하는 함수
    const [needToRemove, setNeedToRemove] = useState(false);
    useEffect(() => {
        if (mapState !== undefined) {
            removeMarkerAPI();
        }
    }, [needToRemove])

    function removeMarkerAPI() {
        //DB검색한 것이 있을때
        if (markers !== undefined && markers.length > 0) {
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(null);
            }
        }
        markers = [];
        //setMarkers([]);
    }

    /*====================================== [ END ] 마커 공통 =====================================*/


    /*============================================== [ END ] 맵 관련 ============================================*/
    /*=========================================================================================================*/


    /*=========================================================================================================*/
    /*============================================== API 검색 관련 START ==============================================*/

    // 카카오맵 api를 이용하여 키워드 검색을 요청하는 함수
    function searchPlaces() {
        if (mapState !== undefined) {
            //장소 검색 객체를 통해 키워드로 장소검색을 요청합니다.
            placeSearch.keywordSearch(keyword, placesSearchCB, {
                category_group_code: "CE7", // 카페만 검색 코드 추가
                location: mapState.getCenter(),
                size: 15,
                page: 1,
                sort: window.kakao.maps.services.SortBy.Distance,
            });
        }
    }

//장소검색 완료시 호출하는 콜백함수
    function placesSearchCB(data: any, status: any) {
        if (mapState !== undefined) {
            if (status === window.kakao.maps.services.Status.OK) {

                //정상적으로 검색이 완료됬으면 검색 목록과 마커 표출
                displayPlaces(data);

            } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
                alert("검색 결과가 존재하지 않습니다");
                return;
            } else if (status === window.kakao.maps.services.Status.ERROR) {
                alert("검색 결과 중 오류가 발생했습니다.");
                return;
            }
        }
    }

    //카페추가 창 검색 결과 목록과 마커를 표출하는 함수
    function displayPlaces(places: any[]) {
        if (mapState !== undefined) {
            const listEl = document.getElementById('placesList'),
                resultEl = document.getElementById('search-result'),
                fragment = document.createDocumentFragment(),
                bounds = new window.kakao.maps.LatLngBounds();
            // 검색 결과 목록에 추가된 항목들을 제거
            listEl && removeAllChildNods(listEl);

            // 지도에 표시되고 있는 마커를 제거
            removeMarkerAPI();

            //검색결과 목록으로 List요소 만들기, bounds : 검색된 좌표만큼의 범위 넓히기
            for (let i = 0; i < places.length; i++) {
                // 마커를 생성하고 지도에 표시
                let placePosition = new window.kakao.maps.LatLng(places[i].y, places[i].x),
                    marker = addMarker(placePosition, i, undefined),
                    itemEl: HTMLElement | undefined = getListItem(i, places[i]); // 검색 결과 항목 Element를 생성
                // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
                // LatLngBounds 객체에 좌표를 추가
                bounds.extend(placePosition);

                if (itemEl !== undefined) {
                    // 마커와 검색결과 항목에 mouseover 했을때
                    // 해당 장소에 인포윈도우에 장소명을 표시
                    // mouseout 했을 때는 인포윈도우를 닫기
                    (function (marker: any, data: any) {
                        window.kakao.maps.event.addListener(marker, 'mouseover', function () {
                            displayInfowindow(marker, data.place_name);
                        });

                        window.kakao.maps.event.addListener(marker, 'mouseout', function () {
                            infowindow.close();
                        });

                        itemEl.onmouseover = function () {
                            displayInfowindow(marker, data.place_name);
                        };

                        itemEl.onmouseout = function () {
                            infowindow.close();
                        };

                        itemEl.onclick = function () {
                            setClickMarkerCafeInfo(data);
                            setSearchCafeInfo("")
                            infowindow.close();
                        }

                        window.kakao.maps.event.addListener(marker, 'click', function () {
                            setClickMarkerCafeInfo(data);
                            setSearchCafeInfo("");
                        });
                    })(marker, places[i])
                    fragment.appendChild(itemEl);
                }
            }
            // 검색결과 항목들을 검색결과 목록 Element에 추가
            listEl && listEl.appendChild(fragment);
            if (resultEl) {
                resultEl.scrollTop = 0;
            }
            // 검색된 장소 위치를 기준으로 지도 범위를 재설정
            mapState.setBounds(bounds);
        }

    }

    //검색결과 항목을 Element로 반환하는 함수
    function getListItem(index: number, places: any) {
        if (mapState !== undefined) {
            const el = document.createElement("li");

            let itemStr = `<div className="info"><h5>${places.place_name}</h5>
                                ${places.road_address_name ? `<span>${places.road_address_name}</span>` : `<span>${places.address_name}</span>`}
                            </div>`;
            el.innerHTML = itemStr;
            el.className = "item";

            return el;
        }
    }

    //검색결과 목록 또는 마커를 클릭했을 때 호출되는 함수
    //인포윈도우에 장소명 표시
    //마커에 마우스 오버됬을 때 카드 만들 수 있는 곳
    function displayInfowindow(marker: any, title: string) {
        if (mapState !== undefined) {
            var content = `<div class="infoWindowWrapper">
                                <div class="infoWindow">${title}</div>
                            </div>`
            infowindow.setContent(content);
            infowindow.open(mapState, marker);
        }
    }

    function removeAllChildNods(el: HTMLElement) {
        if (mapState !== undefined) {
            while (el.hasChildNodes()) {
                el.lastChild && el.removeChild(el.lastChild);
            }
        }
    }


    //마커를 생성하고 지도 위에 마커를 표시하는 함수(카페 추가 검색)
    function addMarker(position: () => {}, idx?: number, title?: string | undefined) {
        if (mapState !== undefined) {
            // 카페추가 검색 마커
            var AddCafeMarkerSrc = process.env.PUBLIC_URL + "/assets/images/markers/search.png", // 마커 이미지 url, 스프라이트 이미지를 씁니다
                AddCafeMarkerSize = new window.kakao.maps.Size(34, 37), //마커크기
                AddCafeMarkerOptions = {
                    spriteSize: new window.kakao.maps.Size(36, 691), //스프라이트 크기
                    spriteOrigin: new window.kakao.maps.Point(0, (idx * 46) + 10), //스프라이트 이미지 중 사용할 영역의 좌상단 좌표
                    offset: new window.kakao.maps.Point(13, 37) //마커 좌표에 일치시킬 이미지 내에서의 좌표
                };


            var markerImage = new window.kakao.maps.MarkerImage(AddCafeMarkerSrc, AddCafeMarkerSize, AddCafeMarkerOptions),
                marker = new window.kakao.maps.Marker({
                    position: position,
                    image: markerImage,
                    title: title
                });

            marker.setMap(mapState);
            markersTmp.push(marker)
            setMarkers(markersTmp);

            return marker;
        }
    }

    /*============================================== [ END ] API 검색 관련 ============================================*/
    /*=========================================================================================================*/


    /*=========================================================================================================*/
    /*============================================== DB 검색 관련 START ==============================================*/


    //처음 맵이 로딩되고 mpaState가 있을 때 데이터에 있는 모든 카페를 뿌려주는 useEffect
    useEffect(() => {
        if (mapState !== undefined) {
            //데이터가 변할 때마다 리렌더링 => 데이터 추가되면 렌더링 / 필터링되면 렌더링
            displayDBPlaces(dbData, dbFilterData);
            //mapState.setLevel(7);

            if (keyword === "" && currentFilter.length > 0) {
                mapState.setLevel(7);// TODO(FE) : 데이터가 많아지고 나면 setLevel을 낮추고 자기 위치에서 필터 할 수 있도록 조정

            } else if (keyword !== "" && currentFilter.length === 0) {
                mapState.setLevel(2);
            }
            //mapState.setCenter(new window.kakao.maps.LatLng(37.56667, 126.97806));
            //const dbDataCenter = new window.kakao.maps.LatLng(dbData[0].y, dbData[0].x);
        }
    }, [mapState, dbData]);

    //DB카페를 검색했을 시 displayDBPlaces하기
    useEffect(() => {
        if (searchedPlaceInfoInNav.length > 0) {
            displayDBPlaces(searchedPlaceInfoInNav);
        }
    }, [searchedPlaceInfoInNav]);

    // // //DB에 있는 카페 중 키워드에 맞는 CafeInfo에 쓸 데이터를 불러오는 함수
    // function loadClickMarkerData(keywords: string) {
    //     fetch("/api/place/getAllPlaceInfo", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json"
    //         },
    //         body: JSON.stringify({
    //             "place_filter": [],
    //             "keywords": keywords,
    //         }),
    //     })
    //         .then(response => response.text())
    //         .then(function (data: any) {
    //             removeMarker();
    //             const responseData = JSON.parse(data).map((i: any) => JSON.parse(i.place_info))
    //             setDBData(responseData);
    //             setCafeInfoContainer(cafeInfoContainer);
    //         }).catch(err => console.log("에러", err));
    // }

    function fetchPlaceDetail(placeNum:string):void{
        fetch('/api/place/selectDetailPlaceInfo',{
            method:'POST',
            headers:{
                'Content-Type': "application/json"
            },
            body:JSON.stringify({
                place_num: placeNum,
                user_num: sessionStorage.getItem("id") === null ? "" : sessionStorage.getItem("id")
            }),
        })
            .then(response => response.text())
            .then((message) => {
                const data = JSON.parse(message);
                console.log(JSON.parse(message).isBookmarked);
                setCafeInfoContainer({
                    data: JSON.parse(JSON.parse(data.selectedPlaceInfo).place_info),
                    filter: data.filterList,
                    placeNum: placeNum,
                    imageList: data.placeImgList,
                    reviewList: data.placeReviewList,
                    isBookmarked: data.isBookmarked
                });
                dispatch(setIsOpenedCafeInfo(true));
                // moveMapAfterPost(data.y, data.x);
            }).catch(err => console.log(err));
    }


//DB의 카페 검색 결과 목록과 마커를 표출하는 함수
    function displayDBPlaces(places: any[], filterData?: any[]) {
        const placesInfo = places.map(a => JSON.parse((a.place_info)))
        const placesFilter = places.map(a => (a.filter_type));
        const placesNumber = places.map(a => (a.place_num));
        if (mapState !== undefined) {
            const bounds = new window.kakao.maps.LatLngBounds();

            removeMarker();

            //검색결과 목록으로 List요소 만들기, bounds : 검색된 좌표만큼의 범위 넓히기
            for (var i = 0; i < placesInfo.length; i++) {
                // 마커를 생성하고 지도에 표시
                let placePosition = new window.kakao.maps.LatLng(placesInfo[i].y, placesInfo[i].x),
                    marker = addDBMarker(placePosition, placesInfo[i].place_name);

                // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
                // LatLngBounds 객체에 좌표를 추가
                bounds.extend(placePosition);

                // 마커와 검색결과 항목에 mouseover 했을때
                // 해당 장소에 인포윈도우에 장소명을 표시
                // mouseout 했을 때는 인포윈도우를 닫기
                (function (marker: any, data: any, filter?: any, placeNum?: string) {
                    window.kakao.maps.event.addListener(marker, 'click', function () {
                        fetchPlaceDetail(placeNum);
                    });
                    window.kakao.maps.event.addListener(marker, 'mouseover', function () {
                        displayInfowindow(marker, data.place_name);
                    });

                    window.kakao.maps.event.addListener(marker, 'mouseout', function () {
                        infowindow.close();
                    });
                })(marker, placesInfo[i], placesFilter[i], String(placesNumber[i]));
                setMarkers(markersTmp);
            }
            // 검색된 장소 위치를 기준으로 지도 범위를 재설정
            if(!isPostedCafe){
                mapState.setBounds(bounds);
            } else {
                setIsPostedCafe(!isPostedCafe)
            }

            // if(keyword === "" && currentFilter.length > 0){
            //     mapState.setLevel(7);// TODO(FE) : 데이터가 많아지고 나면 setLevel을 낮추고 자기 위치에서 필터 할 수 있도록 조정
            //
            // } else
            if (isBookmarkMode) {
                mapState.setLevel(mapState.getLevel());
            } else if (keyword !== "" && currentFilter.length === 0) {
                mapState.setLevel(mapState.getLevel() + 1);
            }

        }
    }

    function addDBMarker(position: any, title: string) {
        if (mapState !== undefined) {
            // 마커 생성
            var marker = new window.kakao.maps.Marker({
                position: position,
                image: filterMarkerImg, // 마커이미지 설정
                title: title
            });

            // 마커가 지도 위에 표시되도록 설정
            marker.setMap(mapState);
            markersTmp.push(marker);
            return marker;
        }
    }

    /*============================================== [ END ] DB 검색 관련 ============================================*/
    /*=========================================================================================================*/

    /*=========================================================================================================*/
    /*============================================== 위치 관련 START ==============================================*/

    // 현재위치로 이동시키는 함수
    const currentLocation = () => {
        if (navigator.geolocation) {
            //Gelocation으로 현재 위치 얻기
            navigator.geolocation.getCurrentPosition((position) => {
                var currentLat = position.coords.latitude,
                    currentLng = position.coords.longitude;
                if (mapState !== undefined) mapState.setCenter(new window.kakao.maps.LatLng(currentLat, currentLng))
                mapState.setLevel(4);
            }, () => {
                window.alert("브라우저 위치 설정을 허용해 주세요.")
            })
        }
    }

    //카페등록 후 등록한 위치로 이동시키는 함수
    function moveMapAfterPost(x: number, y: number) {
        const bounds = new window.kakao.maps.LatLngBounds();
        const placePosition = new window.kakao.maps.LatLng(x, y)
        bounds.extend(placePosition);
        mapState.setBounds(bounds);
        mapState.setCenter(placePosition);
        mapState.setLevel(4);
    }

    /*============================================== [ END ] 위치 관련 ============================================*/
    /*=========================================================================================================*/


    // 카페 추가 버튼 클릭 이벤트
    const onPostCafeBtnClick = () => {
        // removeMarker();
        // 로그인 되어있을 시 카페추가 창 열기
        if (isLoggedin) {
            setClickMarkerCafeInfo({});
            dispatch(setIsOpenedCafeInfo(false));
            dispatch(setIsOpenedPostCafe(true));
            removeMarker();
        } else {
            // 로그인되어있지 않으 시 로그인 모달창 열기
            dispatch(setIsOpenedLoginModal(true));
        }
    }

    const filterBookmarkHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (isLoggedin) {
            dispatch(setIsBookmarkMode(!isBookmarkMode));
            //[YANA] 북마크 검색시 키워드,필터 해제
            dispatch(setCurrentFilter([]));
            setSearchDBKeyword("");
            dispatch(setIsOpenedCafeInfo(false));
        } else {
            dispatch(setIsOpenedLoginModal(true));
        }
    }


    return (
        <Base>
            <MapContainer id="map" isOpenedPostCafe={isOpenedPostCafe}/>
            <Header setSearchedPlaceInfoInNav={setSearchedPlaceInfoInNav}
                    removeMarker={removeMarker} setDBData={setDBData}
                    setSearchDBKeyword={setSearchDBKeyword}/>
            {
                !isOpenedPostCafe && (
                    <AddCafeButton onClick={onPostCafeBtnClick}>
                        <Icon className="material-symbols-rounded">add</Icon>
                        카페추가
                    </AddCafeButton>
                )
            }
            {
                isOpenedPostCafe && (
                    <PostCafeInfo setKeyword={setKeyword} clickMarkerCafeInfo={clickMarkerCafeInfo}
                                  searchPlaces={searchPlaces}
                                  removeMarker={removeMarker}
                                  moveMapAfterPost={moveMapAfterPost}
                                  removeMarkerAPI={removeMarkerAPI}
                                  displayDBPlaces={displayDBPlaces} dbData={dbData} dbFilterData={dbFilterData}
                                  searchCafeInfo={searchCafeInfo}
                                  setSearchCafeInfo={setSearchCafeInfo}
                                  setDBData={setDBData}
                                  setIsPostedCafe={setIsPostedCafe}
                    />
                )
            }
            {
                isOpenedCafeInfo && (
                    <CafeInfo cafeInfoContainer={cafeInfoContainer} setCafeInfoContainer={setCafeInfoContainer}
                              fetchPlaceDetail={fetchPlaceDetail}/>
                )
            }
            {/* 북마크 버튼 */}
            <BookmarkBtn isBookmarkMode={isBookmarkMode} onClick={filterBookmarkHandler}>
                <BookmarkIcon className="material-symbols-rounded">star</BookmarkIcon>
            </BookmarkBtn>

            {/*현재위치 기능 버튼 / https 관련 기능 추가 후 주석 해제*/}
            {/*<CurrentLocationBtn onClick={currentLocation}>*/}
            {/*    <Icon className="material-symbols-rounded">my_location</Icon>*/}
            {/*</CurrentLocationBtn>*/}
        </Base>
    )
}

export default KakaoMap;