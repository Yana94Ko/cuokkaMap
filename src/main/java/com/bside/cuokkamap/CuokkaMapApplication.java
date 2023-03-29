package com.bside.cuokkamap;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
//@MapperScan(value={"com.bside.cuokkamap.dao"})
public class CuokkaMapApplication {
	public static void main(String[] args) {
		SpringApplication.run(CuokkaMapApplication.class, args);
	}

}
