import React, {
    useState,
    MutableRefObject,
    useEffect,
    useRef,
    useMemo,
} from "react";

declare global {
    interface Window {
        kakao: any;
    }
}


function KakaoMap() {
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | string>("");
    useMemo(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, error);
        }

        function success(position: any) {
            setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            });
        }

        function error() {
            setLocation({
                latitude: 37.56667,
                longitude: 126.97806,
            });
            alert("위치 정보 허용 후 사용해주세요");
        }
    }, [navigator.geolocation.getCurrentPosition]);

    const mapRef = useRef<HTMLElement | null>(null);


    const initMap = () => {
        if(typeof location !== "string"){

            const container = document.getElementById("map");
            const options = {
                center: new window.kakao.maps.LatLng(location.latitude, location.longitude),
                level: 3,
            };
            var map = new window.kakao.maps.Map(container as HTMLElement, options);
            (mapRef as MutableRefObject<any>).current = map;

            // //장소 검색 객체
            // var ps = new window.kakao.maps.service.Places();
            // //키워드로 장소를 검색(키워드, 검색 완료시 호출되는 콜백함수
            //
            // //키워드 검색 완료 시 호출되는 콜백함수
            // const placeSearchCB = (data : any, status: any, pagination: any)  => {
            //     if(status === window.kakao.maps.services.Status.Ok){
            //
            //         //검색된 장소 위치를 기준으로 지도 범위를 재설정하기 위해
            //         //LatLngBounds객체에 좌표 추가
            //         var bounds = new window.kakao.maps.LatLngBounds();
            //
            //         for(let i=0;i<data.length;i++){
            //             // displayMarker(data[i]);
            //             // bounds.extended(new window.kakao.maps.LatLng(data[i].y, data[i].x));
            //         }
            //
            //         //검색된 장소 위치를 기준으로 지도 범위 재설정
            //         map.setBounds(bounds);
            //     }
            // }
            //
            // ps.keywordSearch("카페", placeSearchCB);
        }
    };

    useEffect(() => {
        window.kakao.maps.load(() => initMap());
    }, [mapRef, location]);

    return <><div id="map" style={{  width:"100vw", height:"100vh" }} /><button style={{ position:"relative", zIndex:"2"}} onClick={() => initMap()}>위치 조정</button></>;
}

export default KakaoMap;