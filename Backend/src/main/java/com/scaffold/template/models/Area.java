package com.scaffold.template.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Area {
    private Long id;
    private Long areaResponsible;
    private String description;
    private Long state;
    private Long user;
}
