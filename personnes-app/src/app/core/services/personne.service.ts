// src/app/core/services/personne.service.ts
import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Personne, PersonneInput } from '../../models/personne';

// Définition des requêtes GraphQL
const LISTER_PERSONNES = gql`
  query ListerPersonnes {
    listerToutesPersonnes {
      nom
      prenom
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

const SUPPRIMER_PERSONNE = gql`
  mutation SupprimerPersonne($id: ID!) {
    supprimerPersonne(id: $id)
  }
`;

@Injectable({
  providedIn: 'root'
})
export class PersonneService {
  
  constructor(private apollo: Apollo) {}

  listerPersonnes(): Observable<Personne[]> {
    return this.apollo.watchQuery<{ listerToutesPersonnes: Personne[] }>({
      query: LISTER_PERSONNES
    }).valueChanges.pipe(
      map(result => result.data.listerToutesPersonnes)
    );
  }

  ajouterPersonne(personne: PersonneInput): Observable<Personne> {
    return this.apollo.mutate<{ ajouterPersonne: Personne }>({
      mutation: AJOUTER_PERSONNE,
      variables: { personne },
      refetchQueries: [{ query: LISTER_PERSONNES }]
    }).pipe(
      map(result => result.data!.ajouterPersonne)
    );
  }

  supprimerPersonne(id: string): Observable<boolean> {
    return this.apollo.mutate<{ supprimerPersonne: boolean }>({
      mutation: SUPPRIMER_PERSONNE,
      variables: { id },
      refetchQueries: [{ query: LISTER_PERSONNES }]
    }).pipe(
      map(result => result.data!.supprimerPersonne)
    );
  }
}