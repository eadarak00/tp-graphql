package sn.uasz.m1Info.tp_graphql.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import lombok.RequiredArgsConstructor;
import sn.uasz.m1Info.tp_graphql.dto.PersonneInputDTO;
import sn.uasz.m1Info.tp_graphql.dto.PersonneSummaryDTO;
import sn.uasz.m1Info.tp_graphql.entity.Personne;
import sn.uasz.m1Info.tp_graphql.service.PersonneService;

@Controller
@RequiredArgsConstructor
public class PersonneController {

    private final PersonneService service;

    @QueryMapping
    public List<PersonneSummaryDTO> listerToutesPersonnes() {
        return service.getAll()
                .stream()
                .map(p -> new PersonneSummaryDTO(p.getId(),p.getNom(), p.getPrenom(), p.getTelephone(), p.getAdresse()))
                .collect(Collectors.toList());
    }

    @QueryMapping
    public Personne rechercherPersonneParId(@Argument Long id) {
        return service.getById(id).orElse(null);
    }

    @QueryMapping
    public List<Personne> rechercherPersonnes(@Argument String nom) {
        return service.rechercherParNom(nom);
    }

    @MutationMapping
    public Personne ajouterPersonne(@Argument PersonneInputDTO personne) {
        Personne p = new Personne();
        p.setNom(personne.getNom());
        p.setPrenom(personne.getPrenom());
        p.setAdresse(personne.getAdresse());
        p.setTelephone(personne.getTelephone());
        p.setDateNaissance(personne.getDateNaissance());
        return service.save(p);
    }

   @MutationMapping
public Personne modifierPersonne(@Argument Long id, @Argument PersonneInputDTO personne) {
    Personne p = new Personne();
    p.setId(id);
    p.setNom(personne.getNom());
    p.setPrenom(personne.getPrenom());
    p.setAdresse(personne.getAdresse());
    p.setTelephone(personne.getTelephone());
    p.setDateNaissance(personne.getDateNaissance());
    return service.update(id, p);
}


    @MutationMapping
    public Boolean supprimerPersonne(@Argument Long id) {
        service.delete(id);
        return true;
    }
}