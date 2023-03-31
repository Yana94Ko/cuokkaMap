import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {Button, Icon} from "../../styles/common";
import MapNavigationBar from "../home/header/MapNavigationBar";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../modules";
import {setIsOpenedLoginModal} from "../../modules/userReducer";
import {setIsOpenedCafeInfo, setIsOpenedPostCafe} from "../../modules/viewReducer";
import PostCafeInfo from "../home/PostCafeInfo";
import CafeInfo from "../home/CafeInfo";
import Loading from "./header/Laoding";

const Base = styled.div``;
const MapContainer = styled.div`
  width: 100vw;
  height: 100vh;
`;
const CurrentLocationBtn = styled(Button)`
  position: absolute;
  top: 20rem;
  right: 3rem;
  z-index: 999;
  background-color: ${props => props.theme.color.white};
  padding: 0.5rem;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);

  & span {
    color: ${props => props.theme.color.primary};
`;

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
  }

  &:hover {
    background-color: ${props => props.theme.color.primary};
    color: ${props => props.theme.color.white};

  }

  @media ${props => props.theme.windowSize.mobile} {
    bottom: 2rem;
  }
`;
declare global {
    interface Window {
        kakao: any;
    }
}

type markerInfo = {
    address_name: string,
    category_group_code: string,
    category_group_name: string,
    distance: string,
    id: string,
    phone?: string,
    place_name: string,
    place_url?: string,
    road_address_name?: string,
    x: number,
    y: number
};
const Map = () => {
    const dispatch = useDispatch();
    // [Yana] 로딩페이지
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    const currentFilter = useSelector((state: RootState) => state.filterReducer.currentFilter);
    const isLoggedin = useSelector((state: RootState) => state.userReducer.isLoggedin);
    const isOpenedCafeInfo = useSelector((state: RootState) => state.viewReducer.isOpenedCafeInfo);
    const isOpenedPostCafe = useSelector((state: RootState) => state.viewReducer.isOpenedPostCafe);

    const [mapState, setMapState] = useState<any>();
    //MapNav에서 검색된 데이터를 담을 마커 배열 state
    const [searchedPlaceInfoInNav, setSearchedPlaceInfoInNav] = useState<object[]>([]);
    //CafeInfo 컴포넌트를 띄우기 위한 state MapNavigationBar에서 search된 카페를 띄워줌
    const [confirmCafeInfo, setConfirmCafeInfo] = useState<boolean>(false);
    //DB검색된 카페 클릭시 해당 마커의 정보만 담을 state
    const [cafeInfoContainer, setCafeInfoContainer] = useState<object>();
    //검색어 : PostCafeInfo 컴포넌트의 카페찾기 input에서 조작
    const [keyword, setKeyword] = useState<string>("");
    //마커를 클릭해서 카페추가에 올릴 정보
    const [clickMarkerCafeInfo, setClickMarkerCafeInfo] = useState<any>();
    const [DB, setDB] = useState<any>([]);
    const [positions, setPositions] = useState<any[]>([]);
    var markers: any[] = [];

    var filterMarkerImgSrc = `${process.env.PUBLIC_URL}/assets/images/markers/${currentFilter}.png`;
    var filterImgSize = new window.kakao.maps.Size(38, 38);
    var filterMarkerImg = new window.kakao.maps.MarkerImage(filterMarkerImgSrc, filterImgSize);

    // DB 받아오는 로직
    useEffect(() => {
        // [YANA]
        abc();
    }, []);
    function abc(){
        fetch("/api/place/getAllPlaceInfo", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "place_filter": [],
                "keywords": "",
            }),
        })
            .then(response => response.text())
            .then(function (data: any) {
                setDB(JSON.parse(data));
                setPositions(DB.map((i: any) => JSON.parse(i.place_info)));
            }).catch(err => console.log("에러", err));
    }

    useEffect(() => {
        if (currentFilter !== "all") {
            fetch("/api/place/getAllPlaceInfo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "place_filter": [currentFilter],
                    "keywords": "",
                }),
            })
                .then(response => response.text())
                .then((data: any) => {
                    var placeInfoArr = JSON.parse(data).map((i: any) => JSON.parse(i.place_info));
                    setPositions(placeInfoArr);
                })
                .catch(err => console.log("에러", err));
        } else {
            setPositions(DB.map((i: any) => JSON.parse(i.place_info)));
        }

    }, [currentFilter, DB]);

    useEffect(() => {
        let container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스

        if (mapState === undefined) {
            var options = { //지도를 생성할 때 필요한 기본 옵션
                center: new window.kakao.maps.LatLng(37.56667, 126.97806), //지도의 중심좌표.
                level: 4 //지도의 레벨(확대, 축소 정도)
            };
        } else {
            options = {
                center: new window.kakao.maps.LatLng(mapState.getCenter().getLat(), mapState.getCenter().getLng()),
                level: 4,
            };
        }

        let map = new window.kakao.maps.Map(container, options); //지도 생성 및 객체 리턴

        setMapState(map);
        setIsLoaded(true);
        if (!isOpenedPostCafe) {
            // TODO(FE): DB, 필터DB 마커 mouseOver, click 이벤트 추가하기
            // assignees: hwanyb, SeongSilver

            // 디비에 저장되어있는 마커 띄우기
            for (let i = 0; i < positions.length; i++) {
                var marker = new window.kakao.maps.Marker({
                    map: map,
                    position: new window.kakao.maps.LatLng(positions[i].y, positions[i].x),
                    title: positions[i].place_name,
                    image: filterMarkerImg
                })
            }
        }
    }, [currentFilter, keyword, isOpenedPostCafe, positions.length])

    useEffect(() => {
        if (searchedPlaceInfoInNav.length > 0) {
            console.log(searchedPlaceInfoInNav)
            displayDBPlaces(searchedPlaceInfoInNav);
        }
    }, [searchedPlaceInfoInNav]);

    useEffect(() => {
        if (!isOpenedPostCafe) {
            setClickMarkerCafeInfo({})
        }
    }, [isOpenedPostCafe])

    //해당 위치로 이동하는 함수
    function panToMap(x: number, y:number){
        var moveLatLng = new window.kakao.maps.LatLng(x, y);
        abc();
        mapState.setCenter(moveLatLng);
    }

    // 현재위치 함수
    const currentLocation = () => {
        if (navigator.geolocation) {
            //Gelocation으로 현재 위치 얻기
            navigator.geolocation.getCurrentPosition((position) => {
                var currentLat = position.coords.latitude,
                    currentLng = position.coords.longitude;
                if (mapState !== undefined) mapState.setCenter(new window.kakao.maps.LatLng(currentLat, currentLng))
            }, () => {
                window.alert("브라우저 위치 설정을 허용해 주세요.")
            })
        }
    }

    function removeMarker() {
        //DB검색한 것이 있을때
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
        markers = [];
    }

    // 카페 추가 버튼 클릭 이벤트
    const onPostCafeBtnClick = () => {
        // 로그인 되어있을 시 카페추가 창 열기
        if (isLoggedin) {
            setPositions([])

            dispatch(setIsOpenedCafeInfo(false));
            dispatch(setIsOpenedPostCafe(true));
            removeMarker();

        } else {
            // 로그인되어있지 않으 시 로그인 모달창 열기
            dispatch(setIsOpenedLoginModal(true));
        }
    }


    //장소 검색 객체 생성
    var placeSearch = new window.kakao.maps.services.Places();

    //검색 결과 목록이나 마커를 클릭했을 때 장소명을 표시할 인포 윈도우 생성
    var infowindow = new window.kakao.maps.InfoWindow({zIndex: 1});

    // 카카오맵 api를 이용하여 키워드 검색을 요청하는 함수
    function searchPlaces() {
        if (mapState !== undefined) {
            //장소 검색 객체를 통해 키워드로 장소검색을 요청합니다.
            //keywordSearch() : 입력한 키워드로 검색하는 함수 options 활용 필요
            //https://apis.map.kakao.com/web/documentation/#services_Places_keywordSearch
            placeSearch.keywordSearch(keyword, placesSearchCB, {
                code: "CE7", // 카페만 검색 코드 추가
                location: mapState.getCenter(),
                size: 10,
                page: 1,
                sort: window.kakao.maps.services.SortBy.Distance,
            });
        }
        removeMarker();
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
            removeMarker();

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
                        }

                        window.kakao.maps.event.addListener(marker, 'click', function () {
                            setClickMarkerCafeInfo(data);
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

            let itemStr = `<span className="markerbg marker_${index + 1}" ></span>
                                <div className="info"><h5>${places.place_name}</h5>
                                ${places.road_address_name
                ? `<span>${places.road_address_name}</span>
    <!--                                <span className="jibun gray">${places.address_name}</span>-->
                                    `
                : `<span>${places.address_name}</span>`
            }
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
            var content = `<div style={{padding:"5px",zIndex:"1"}} >${title}</div>`

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
    function addMarker(position: () => {}, idx: number, title?: string | undefined) {
        if (mapState !== undefined) {
            var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png', // 마커 이미지 url, 스프라이트 이미지를 씁니다
                imageSize = new window.kakao.maps.Size(34, 37), //마커크기
                imgOptions = {
                    spriteSize: new window.kakao.maps.Size(36, 691), //스프라이트 크기
                    spriteOrigin: new window.kakao.maps.Point(0, (idx * 46) + 10), //스프라이트 이미지 중 사용할 영역의 좌상단 좌표
                    offset: new window.kakao.maps.Point(13, 37) //마커 좌표에 일치시킬 이미지 내에서의 좌표
                },
                markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
                marker = new window.kakao.maps.Marker({
                    position: position,
                    image: markerImage,
                    title: title
                });

            marker.setMap(mapState);
            markers.push(marker);

            return marker;
        }
    }

    //DB의 카페 검색 결과 목록과 마커를 표출하는 함수
    function displayDBPlaces(places: any[]) {
        if (mapState !== undefined) {
            const listEl = document.getElementById('placesList'),
                bounds = new window.kakao.maps.LatLngBounds();

            // 검색 결과 목록에 추가된 항목들을 제거
            listEl && removeAllChildNods(listEl);

            removeMarker();

            //검색결과 목록으로 List요소 만들기, bounds : 검색된 좌표만큼의 범위 넓히기
            for (var i = 0; i < places.length; i++) {
                // 마커를 생성하고 지도에 표시
                let placePosition = new window.kakao.maps.LatLng(places[i].y, places[i].x),
                    marker = addDBMarker(placePosition, places[i].place_name);

                // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
                // LatLngBounds 객체에 좌표를 추가
                bounds.extend(placePosition);

                // 마커와 검색결과 항목에 mouseover 했을때
                // 해당 장소에 인포윈도우에 장소명을 표시
                // mouseout 했을 때는 인포윈도우를 닫기
                (function (marker: any, data: any) {
                    window.kakao.maps.event.addListener(marker, 'click', function () {
                        setCafeInfoContainer(data);
                        dispatch(setIsOpenedCafeInfo(true));
                        console.log(data);
                    });
                })(marker, places[i])
            }

            // 검색된 장소 위치를 기준으로 지도 범위를 재설정
            mapState.setBounds(bounds);
            mapState.setLevel(mapState.getLevel() + 1);
        }
    }

    function addDBMarker(position: () => {}, title: string) {
        if (mapState !== undefined) {
            //마커 이미지 URL
            let imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png',
                //마커 크기
                imageSize = new window.kakao.maps.Size(45, 47),
                // 마커이미지의 옵션, 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정
                imageOption = {offset: new window.kakao.maps.Point(27, 69)};

            // 마커의 이미지정보를 가지고 있는 마커이미지를 생성
            var markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

            // 마커 생성
            var marker = new window.kakao.maps.Marker({
                position: position,
                image: markerImage, // 마커이미지 설정
                title: title
            });

            // 마커가 지도 위에 표시되도록 설정
            marker.setMap(mapState);
            markers.push(marker);

            return marker;
        }
    }

    return (
        <Base>
            <MapContainer id="map">
            </MapContainer>
            { !isLoaded ? (
                <Loading/>
            ) : (
                <>
                <MapNavigationBar setSearchedPlaceInfoInNav={setSearchedPlaceInfoInNav}
                                  setConfirmCafeInfo={setConfirmCafeInfo} removeMarker={removeMarker}/>
                <CurrentLocationBtn onClick={currentLocation}>
                    <Icon className="material-symbols-rounded">my_location</Icon>
                </CurrentLocationBtn>
                <AddCafeButton onClick={onPostCafeBtnClick}>
                    <Icon className="material-symbols-rounded">add</Icon>
                    카페추가
                </AddCafeButton>

            {
                isOpenedPostCafe && (
                    <PostCafeInfo setKeyword={setKeyword} clickMarkerCafeInfo={clickMarkerCafeInfo}
                                  searchPlaces={searchPlaces}
                                  removeMarker={removeMarker}
                                  panToMap={panToMap}
                    />
                )
            }
            {
                isOpenedCafeInfo && (
                    <CafeInfo cafeInfoContainer={cafeInfoContainer}/>
                )
            }

            </>
            )}
        </Base>
    )
}

export default Map;