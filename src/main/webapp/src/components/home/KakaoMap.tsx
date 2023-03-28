import React, {
    useState,
    useEffect,
} from "react";
import PostCafeInfo from "./PostCafeInfo";

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
const KakaoMap = () => {
    //카페추가 버튼으로 해당 컴포넌트 보이게 하는 state
    const [visible, setVisible] = useState<boolean>(false);
    //검색어 : PostCafeInfo 컴포넌트의 카페찾기 input에서 조작
    const [keyword, setKeyword] = useState<string>("");
    //마커를 클릭해서 카페추가에 올릴 정보
    const [clickMarkerCafeInfo, setClickMarkerCafeInfo] = useState<markerInfo>();

    const [mapstate, setMapstate] = useState<any>();

    // const [markers, setMarkers] = useState<any[]>([]);
    var markers: any[] = [];
    var placeSearch = new window.kakao.maps.services.Places();

    // console.log(markers)

    // // 마커를 담을 배열
    // var markers: any[] = [];
    useEffect(() => {
        //지도를 담을 div선택
        const container = document.getElementById("map");
        //지도 만들기 옵션
        const options = {
            center: new window.kakao.maps.LatLng(37.56667, 126.97806),
            level: 4,
        };
        //지도 만드는 객체
        var map = new window.kakao.maps.Map(container as HTMLElement, options);

        setMapstate(map);
        //현재위치로 지도 이동
        //어쩌다보니 현재위치로 이동하면 해당 키워드도 같이 검색되버림
        //키워드로 장소 검색
        // searchPlaces();
    }, []);

    // useEffect(() => {
    //     if (mapstate !== undefined) {
    //         // 지도 중심 좌표 변화 이벤트를 등록한다
    //         window.kakao.maps.event.addListener(mapstate, 'center_changed', function () {
    //             mapstate.setCenter(mapstate.getCenter());
    //         });
    //     }
    // })
    //키워드 검색을 요청하는 함수
    function searchPlaces() {
        console.log(markers)
        //2번불러와지고 카페목록은 나오지만 마커는 안나옴
        if (mapstate !== undefined) {
            //장소 검색 객체를 통해 키워드로 장소검색을 요청합니다.
            //keywordSearch() : 입력한 키워드로 검색하는 함수 options 활용 필요
            //https://apis.map.kakao.com/web/documentation/#services_Places_keywordSearch
            placeSearch.keywordSearch(keyword, placesSearchCB, {
                code: "CE7", // 카페만 검색 코드 추가
                location: mapstate.getCenter(),
                size: 10,
                page: 1,
                sort: window.kakao.maps.services.SortBy.Distance,
            });
            // 중복 코드라 주석처리합니다. -환희
            // window.kakao.maps.event.addListener(mapstate, 'center_changed', function () {
            //     mapstate.setCenter(mapstate.getCenter());
            // });
        }
    }

    //장소 검색 객체 생성


    //검색 결과 목록이나 마커를 클릭했을 때 장소명을 표시할 인포 윈도우 생성
    var infowindow = new window.kakao.maps.InfoWindow({zIndex: 1});


    //장소검색이 완료됬을 때 호출하는 콜백함수
    function placesSearchCB(data: any, status: any) {
        if (mapstate !== undefined) {
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


    //검색 결과 목록과 마커를 표출하는 함수
    function displayPlaces(places: any[]) {

        // console.log('mapstate: ', mapstate)
        // console.log('places: ', places)

        if (mapstate !== undefined) {
            const listEl = document.getElementById('placesList'),
                resultEl = document.getElementById('search-result'),
                fragment = document.createDocumentFragment(),
                bounds = new window.kakao.maps.LatLngBounds();
            // 검색 결과 목록에 추가된 항목들을 제거
            listEl && removeAllChildNods(listEl);

            // 지도에 표시되고 있는 마커를 제거
            removeMarker();

            // TODO(FE) : 키워드 변경 후 검색 시 마커가 제거되지 않는 이슈
            // 1차 스크럼 이후 해결하기
            // assignees : hwanyb

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
                            setKeyword("")
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
            mapstate.setBounds(bounds);
        }
    }

    //검색결과 항목을 Element로 반환하는 함수
    function getListItem(index: number, places: any) {
        if (mapstate !== undefined) {
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

    //마커를 생성하고 지도 위에 마커를 표시하는 함수
    function addMarker(position: any, idx: number, title: string) {
        if (mapstate !== undefined) {
            var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png', // 마커 이미지 url, 스프라이트 이미지 사용
                imageSize = new window.kakao.maps.Size(34, 37), //마커크기
                imgOptions = {
                    spriteSize: new window.kakao.maps.Size(36, 691), //스프라이트 크기
                    spriteOrigin: new window.kakao.maps.Point(0, (idx * 46) + 10), //스프라이트 이미지 중 사용할 영역의 좌상단 좌표
                    offset: new window.kakao.maps.Point(13, 37) //마커 좌표에 일치시킬 이미지 내에서의 좌표
                },
                markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
                marker = new window.kakao.maps.Marker({
                    position: position,
                    image: markerImage
                });
            // setMarkers(marker)
            marker.setMap(mapstate);
            markers.push(marker);

            return marker;
        }
    }

    //검색결과 목록 또는 마커를 클릭했을 때 호출되는 함수
    //인포윈도우에 장소명 표시
    //마커에 마우스 오버됬을 때 카드 만들 수 있는 곳
    function displayInfowindow(marker: any, title: string) {
        if (mapstate !== undefined) {
            var content = `<div style={{padding:"5px",zIndex:"1"}} >${title}</div>`

            infowindow.setContent(content);
            infowindow.open(mapstate, marker);
        }
    }

    //검색경로가 목록의 자식 Element를 제거하는 함수
    function removeAllChildNods(el: HTMLElement) {
        if (mapstate !== undefined) {
            while (el.hasChildNodes()) {
                el.lastChild && el.removeChild(el.lastChild);
            }
        }
    }

    var currentLocation = () => {
        if (navigator.geolocation) {
            //Gelocation으로 현재 위치 얻기
            navigator.geolocation.getCurrentPosition((position) => {
                var currentLat = position.coords.latitude,
                    currentLng = position.coords.longitude;
                if (mapstate !== undefined) mapstate.setCenter(new window.kakao.maps.LatLng(currentLat, currentLng))
            })
        }
    }

//지도 위에 표시되고 있는 마커 모두 제거
//     function removeMarker() {
//         console.log("삭제됨")
//         // console.log(markers.marker)
//
//         for (let i = 0; i < markers.length; i++) {
//             setMarkers(markers[i].setMap(null));
//         }
//         if(markers.length > 1){
//             markers.shift()
//         }
//     } // markers state 일때


    function removeMarker() {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }

        markers = [];
    }

//postCafeInfo 열기
    const postCafeInfoVisible = () => {
        setVisible(true)
    }

//PostCafeInfo 닫기
    const closePostCafeInfo = () => {
        setVisible(false);
        //TODO(FE) : 마커가 간헐적으로 삭제 안되는 이슈
        //어쩔때는 삭제가 되고 어쩔때는 안되는 말도안되는...이슈...
        // assignees : hwanyb, SeongSilver
        removeMarker();
        // setClickMarkerCafeInfo();
        setKeyword("");
    }

    return <>
        <div id="map" style={{width: "100vw", height: "100vh"}}/>
        <button style={{position: "absolute", top: "2vh", right: "2vw", zIndex: "100"}}
                onClick={currentLocation}
        >현재위치
        </button>
        {visible ? (
            mapstate ? (
                <PostCafeInfo setKeyword={setKeyword} closePostCafeInfo={closePostCafeInfo}
                              clickMarkerCafeInfo={clickMarkerCafeInfo}
                              searchPlaces={searchPlaces} keyword={keyword}/>
            ) : null
        ) : (
            <button
                style={{
                    width: "100px",
                    zIndex: "100",
                    position: "absolute",
                    bottom: "10vh",
                    right: "calc(50vw - 50px)"
                }}
                onClick={postCafeInfoVisible}>카페추가
            </button>
        )
        }
    </>;
}

export default KakaoMap;