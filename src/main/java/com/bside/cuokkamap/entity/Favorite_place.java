package com.bside.cuokkamap.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString(of = {"favoritePlace_num", "user_num", "place_num"})
public class Favorite_place {
    @Id @GeneratedValue
    private Long favoritePlace_num;
    private Long user_num;
    private Long place_num;
    private int favorite_type;

    @ManyToOne
    @JoinColumn(name = "user_num")
    private User user;
}
