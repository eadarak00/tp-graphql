package sn.uasz.m1Info.tp_graphql.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import sn.uasz.m1Info.tp_graphql.entity.Personne;
import sn.uasz.m1Info.tp_graphql.repository.PersonneRepository;

@Service
@RequiredArgsConstructor
public class PersonneService {

    private final PersonneRepository repository;
    
    public List<Personne> getAll() {
        return repository.findAll();
    }

    public Optional<Personne> getById(Long id) {
        return repository.findById(id);
    }

    public Personne save(Personne p) {
        return repository.save(p);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public List<Personne> rechercherParNom(String nom) {
        return repository.findByNomContainingIgnoreCase(nom);
    }

    public Personne update(Long id, Personne updated) {
        return repository.findById(id)
                .map(existing -> {
                    existing.setNom(updated.getNom());
                    existing.setPrenom(updated.getPrenom());
                    existing.setAdresse(updated.getAdresse());
                    existing.setDateNaissance(updated.getDateNaissance());
                    existing.setTelephone(updated.getTelephone());
                    return repository.save(existing);
                })
                .orElse(null);
    }
}