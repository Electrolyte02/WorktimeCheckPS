package com.scaffold.template.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "areas")
public class AreaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "area_id", nullable = false)
    private Long id;

    @Column(name = "area_description", nullable = false)
    private String description;

    @Column(name = "area_responsible")
    private Long areaResponsible;

    @Column(name = "area_state", nullable = false)
    private Long state;

    @Column(name = "area_auduser", nullable = false)
    private Long user;
}
