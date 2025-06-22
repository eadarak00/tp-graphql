package sn.uasz.m1Info.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import sn.uasz.m1Info.tp_graphql.entity.Personne;

@Repository
public interface PersonneRepository extends JpaRepository<Personne, Long> {

    List<Personne> findByNomContainingIgnoreCase(String nom);
}