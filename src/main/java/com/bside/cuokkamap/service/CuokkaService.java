package com.bside.cuokkamap.service;

import com.bside.cuokkamap.repository.Cuokka;
import com.bside.cuokkamap.repository.CuokkaRepository;
import org.springframework.stereotype.Service;

@Service //bean으로 생성 - > Spring container에서 di 진행
public class CuokkaService {
//
//    private CuokkaRepository cuokkaRepository;
//
//    public CuokkaService(CuokkaRepository cuokkaRepository){
//        this.cuokkaRepository = cuokkaRepository;
//    }
//
//    // 인터페이스 분리도 가능 : 헥사고날 아키텍쳐
//    // solid란 ? : 객체지향적인 소프트웨어 설계의 기본 5원칙
//
//    public Cuokka getCuokka() {
//        Cuokka cuokka = cuokkaRepository.findById(); // 권장X
//        return cuokka;
//    }
}