// src/app/core/services/personne.service.ts
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { gql } from 'apollo-angular';
import { Personne, PersonneInput } from '../../models/personne';

const LISTER_PERSONNES = gql`
  query {
    listerToutesPersonnes {
      id
      prenom
      nom
      adresse
      telephone
    }
  }
`;

const AJOUTER_PERSONNE = gql`
  mutation AjouterPersonne($personne: PersonneInput!) {
    ajouterPersonne(personne: $personne) {
      id
      nom
      prenom
      dateNaissance
      adresse
      telephone
    }
  }
`;

const RECHERCHER_PERSONNES = gql`
  query rechercherPersonnes($nom: String!) {
    rechercherPersonnes(nom: $nom) {
      id
      prenom
      nom
      adresse
      telephone
      dateNaissance
    }
  }
`;



const OBTENIR_PERSONNE = gql`
  query rechercherPersonneParId($id: ID!) {
    personne(id: $id) {
      id
      prenom
      nom
      adresse
      telephone
      dateNaissance
    }
  }
`;

const MODIFIER_PERSONNE = gql`
  mutation modifierPersonne($id: ID!, $personne: PersonneInput!) {
    modifierPersonne(id: $id, personne: $personne) {
      id
      prenom
      nom
      adresse
      telephone
      dateNaissance
    }
  }
`;

const SUPPRIMER_PERSONNE = gql`
  mutation supprimerPersonne($id: ID!) {
    supprimerPersonne(id: $id)
  }
`;

@Injectable({
  providedIn: 'root',
})
export class PersonneService {
  constructor(private apollo: Apollo) {}

 listerPersonnes(): Observable<Personne[]> {
     return this.apollo
       .watchQuery<{ listerToutesPersonnes: Personne[] }>({
         query: LISTER_PERSONNES,
       })
       .valueChanges.pipe(map((result) => result.data.listerToutesPersonnes));
   }

  ajouterPersonne(personne: PersonneInput): Observable<Personne> {
    return this.apollo
      .mutate<{ ajouterPersonne: Personne }>({
        mutation: AJOUTER_PERSONNE,
        variables: { personne },
        refetchQueries: [{ query: LISTER_PERSONNES }],
      })
      .pipe(map((result) => result.data!.ajouterPersonne));
  }

obtenirPersonne(id: string): Observable<Personne> {
    return this.apollo
      .query<{ rechercherPersonneParId: Personne }>({
        query: OBTENIR_PERSONNE,
        variables: { id },
        fetchPolicy: 'network-only'
      })
      .pipe(map((result) => result.data.rechercherPersonneParId));
  }

  // Nouvelle méthode pour rechercher par nom
  rechercherPersonnes(nom: string): Observable<Personne[]> {
    return this.apollo
      .query<{ rechercherPersonnes: Personne[] }>({
        query: RECHERCHER_PERSONNES,
        variables: { nom },
        fetchPolicy: 'network-only'
      })
      .pipe(map((result) => result.data.rechercherPersonnes));
  }

  modifier(id: string, personne: PersonneInput): Observable<Personne> {
    // Nettoyer l'objet pour éviter les champs Apollo
    const cleanedPersonne = this.cleanPersonneForMutation(personne);

    return this.apollo
      .mutate<{ modifierPersonne: Personne }>({
        mutation: MODIFIER_PERSONNE,
        variables: { id, personne: cleanedPersonne },
        refetchQueries: [{ query: LISTER_PERSONNES }],
      })
      .pipe(map((result) => result.data!.modifierPersonne));
  }

  supprimerPersonne(id: string): Observable<boolean> {
    return this.apollo
      .mutate<{ supprimerPersonne: boolean }>({
        mutation: SUPPRIMER_PERSONNE,
        variables: { id },
        refetchQueries: [{ query: LISTER_PERSONNES }],
      })
      .pipe(map((result) => result.data!.supprimerPersonne));
  }

  private cleanPersonneForMutation(personne: any): PersonneInput {
    return {
      prenom: personne.prenom?.trim(),
      nom: personne.nom?.trim(),
      adresse: personne.adresse?.trim() || '',
      telephone: personne.telephone?.trim() || '',
      dateNaissance: personne.dateNaissance || '',
    };
  }
}
