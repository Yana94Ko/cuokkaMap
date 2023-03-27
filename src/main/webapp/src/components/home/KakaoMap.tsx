import React, {
    useState,
    useEffect,
    useMemo
} from "react";
import PostCafeInfo from "./PostCafeInfo";
import './map.css';

interface placeType {
    place_name: string,
    road_address_name: string,
    address_name: string,
    phone: string,
    place_url: string
}

declare global {
    interface Window {
        kakao: any;
    }
}


const KakaoMap = () => {
    //카페추가 버튼으로 해당 컴포넌트 보이게 하는 state
    const [visible, setVisible] = useState<boolean>(false);
    //지도 중심 좌표 바꾸기 위해 만든 state
    const [center, setCenter] = useState<{lat:number, lng:number}>({lat:37.56667, lng: 126.97806});
    //검색어 : PostCafeInfo 컴포넌트의 카페찾기 input에서 조작
    const [keyword, setKeyword] = useState<string>("");
    //마커를 클릭해서 카페추가에 올릴 정보
    const [clickMarkerCafeInfo, setClickMarkerCafeInfo] = useState<string[] >(["","",""]);

    // 마커를 담을 배열
    var markers: any[] = [];

    useMemo(()=>{
        if (navigator.geolocation){
            navigator.geolocation.getCurrentPosition(success, error);
        }

        function success(position: any){
            setCenter({
                lat: position.coords.latitude,
                lng: position.coords.longitude
            });
        }

        function error(){
            setCenter({
                lat: 37.483034,
                lng: 126.902435
            })
            console.log("위치 받기 실패");
        }
    },[navigator.geolocation.getCurrentPosition])

    useEffect(() => {
            //지도를 담을 div선택
            const container = document.getElementById("map");
            //지도 만들기 옵션
            const options = {
                center: new window.kakao.maps.LatLng(center.lat, center.lng),
                level: 4,
            };
            //지도 만드는 객체
            var map = new window.kakao.maps.Map(container as HTMLElement, options);

            //지도움직였을 때 센터 좌표 구하는 체인지 함수
            window.kakao.maps.event.addListener(map, 'center_changed', function() {
                setCenter({
                    lat:map.getCenter().getLat(),
                    lng:map.getCenter().getLng()
                })
            })

            //장소 검색 객체 생성
            var placeSearch = new window.kakao.maps.services.Places();

            //검색 결과 목록이나 마커를 클릭했을 때 장소명을 표시할 인포 윈도우 생성
            var infowindow = new window.kakao.maps.InfoWindow({zIndex:1});

            //키워드로 장소 검색
            searchPlaces();

        //장소검색이 완료됬을 때 호출하는 콜백함수
        function placesSearchCB(data: any, status: any){
            if(status === window.kakao.maps.services.Status.OK){

                //정상적으로 검색이 완료됬으면 검색 목록과 마커 표출
                displayPlaces(data);

            }else if(status === window.kakao.maps.services.Status.ZERO_RESULT){
                alert("검색 결과가 존재하지 않습니다");
                return;
            }else if(status === window.kakao.maps.services.Status.ERROR){
                alert("검색 결과 중 오류가 발생했습니다.");
                return;
            }
        }

        //키워드 검색을 요청하는 함수
        function searchPlaces(){

            //장소 검색 객체를 통해 키워드로 장소검색을 요청합니다.
            //아래 bounds 경계 설정
            var sw = new window.kakao.maps.LatLng(center.lat+1, center.lng+1),
                ne = new window.kakao.maps.LatLng(center.lat-1, center.lng-1);
            var bounds = new window.kakao.maps.LatLngBounds(sw, ne);

            //keywordSearch() : 입력한 키워드로 검색하는 함수 options 활용 필요
            //https://apis.map.kakao.com/web/documentation/#services_Places_keywordSearch
            placeSearch.keywordSearch(keyword, placesSearchCB, {
                location: new window.kakao.maps.LatLng(center.lat, center.lng),
                radius:1000,
                size:10,
                bounds: bounds,
                sort: window.kakao.maps.services.SortBy.Distance
            })
        }



        //검색 결과 목록과 마커를 표출하는 함수
        function displayPlaces(places: string | any[]) {
            const listEl = document.getElementById('places-list'),
                resultEl = document.getElementById('search-result'),
                fragment = document.createDocumentFragment(),
                bounds = new window.kakao.maps.LatLngBounds();
            console.log(places);
            // 검색 결과 목록에 추가된 항목들을 제거
            listEl && removeAllChildNods(listEl);

            // 지도에 표시되고 있는 마커를 제거
            removeMarker();

            //검색결과 목록으로 List요소 만들기, bounds : 검색된 좌표만큼의 범위 넓히기
            for (var i = 0; i < places.length; i++) {
                // 마커를 생성하고 지도에 표시
                let placePosition = new window.kakao.maps.LatLng(places[i].y, places[i].x),
                    marker = addMarker(placePosition, i, undefined),
                    itemEl = getListItem(i, places[i]); // 검색 결과 항목 Element를 생성

                // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
                // LatLngBounds 객체에 좌표를 추가
                bounds.extend(placePosition);

                // 마커와 검색결과 항목에 mouseover 했을때
                // 해당 장소에 인포윈도우에 장소명을 표시
                // mouseout 했을 때는 인포윈도우를 닫기
                (function (marker: any, title:string, address:string, phone:string) {
                    window.kakao.maps.event.addListener(marker, 'mouseover', function () {
                        displayInfowindow(marker, title);
                    });

                    window.kakao.maps.event.addListener(marker, 'mouseout', function () {
                        infowindow.close();
                    });

                    itemEl.onmouseover = function () {
                        displayInfowindow(marker, title);
                    };

                    itemEl.onmouseout = function () {
                        infowindow.close();
                    };

                    window.kakao.maps.event.addListener(marker, 'click', function() {
                        setClickMarkerCafeInfo([title, address, phone]);
                    });
                })(marker, places[i].place_name, places[i].road_address_name, places[i].phone);

                fragment.appendChild(itemEl);
            }
        }

        //현재 위치를 반환하는 버튼


        //검색결과 항목을 Element로 반환하는 함수
        function getListItem(index: number, places: any){
            const el = document.createElement("li");

            let itemStr = `<span className="markerbg marker_${index+1}" ></span>
                            <div className="info" onClick={console.log("롤롤")}><h5>${places.place_name}</h5>
                            ${places.road_address_name
                                ? `<span>${places.road_address_name}</span>
<!--                                <span className="jibun gray">${places.address_name}</span>-->
                                `
                                : `<span>${places.address_name}</span>`
                            }
                            </div>`;
            el.innerHTML = itemStr;
            el.className="item";

            return el;
        }

        //마커를 생성하고 지도 위에 마커를 표시하는 함수
        function addMarker(position:() => {}, idx: number, title: undefined){
            var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png', // 마커 이미지 url, 스프라이트 이미지 사용
                imageSize = new window.kakao.maps.Size(34, 37), //마커크기
                imgOptions = {
                    spriteSize: new window.kakao.maps.Size(36, 691), //스프라이트 크기
                    spriteOrigin : new window.kakao.maps.Point(0, (idx*46)+10), //스프라이트 이미지 중 사용할 영역의 좌상단 좌표
                    offset : new window.kakao.maps.Point(13, 37) //마커 좌표에 일치시킬 이미지 내에서의 좌표
                },
                markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
                marker = new window.kakao.maps.Marker({
                    position:position,
                    image:markerImage
                });

            marker.setMap(map);
            markers.push(marker);


            return marker;
        }


        //검색결과 목록 또는 마커를 클릭했을 때 호출되는 함수
        //인포윈도우에 장소명 표시
        function displayInfowindow(marker:any, title:string){
            var content = `<div style={{padding:"5px",zIndex:"1"}} >${title}</div>`

            infowindow.setContent(content);
            infowindow.open(map, marker);
        }

        //검색경로가 목록의 자식 Element를 제거하는 함수
        function removeAllChildNods(el:HTMLElement){
                while(el.hasChildNodes()){
                    el.lastChild && el.removeChild(el.lastChild);
                }
        }
    }, [keyword, center]);

    //현재위치로 지도 이동
    //어쩌다보니 현재위치로 이동하면 해당 키워드도 같이 검색되버림
    function currenttLocation(){
        console.log("하하")
        if(navigator.geolocation){
            //Gelocation으로 현재 위치 얻기
            navigator.geolocation.getCurrentPosition((position) => {
                var currentLat = position.coords.latitude,
                    currentLng = position.coords.longitude;
                setCenter({lat:currentLat, lng:currentLng});
            })
        }
    }

    //지도 위에 표시되고 있는 마커 모두 제거
    function removeMarker(){
        for(let i=0;i<markers.length;i++){
            markers[i].setMap(null);
        }
        markers=[];
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
        setClickMarkerCafeInfo(["","",""]);
    }

    return <>
        <div id="map" style={{  width:"100vw", height:"100vh" }} />
        <button style={{position:"absolute", top:"2vh", right:"2vw",zIndex:"100"}} onClick={currenttLocation}>현재위치</button>
        {visible ? (<PostCafeInfo setKeyword={setKeyword} closePostCafeInfo={closePostCafeInfo} clickMarkerCafeInfo={clickMarkerCafeInfo}/>) :(<button style={{width:"100px", zIndex:"100", position:"absolute", bottom:"10vh", right:"calc(50vw - 50px)"}} onClick={postCafeInfoVisible}>카페추가</button>)}
    </>;
}

export default KakaoMap;