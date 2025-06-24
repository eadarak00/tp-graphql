package sn.uasz.m1Info.tp_graphql.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class PersonneSummaryDTO {
    private String nom;
    private String prenom;
    private String telephone;
    private String adresse;
}
