// src/app/core/services/personne.service.ts
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { gql } from 'apollo-angular';
import { Personne, PersonneInput } from '../../models/personne';

// ===== REQUÊTES GRAPHQL =====

/**
 * Requête pour récupérer toutes les personnes
 * Retourne une liste complète sans filtres
 */
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

/**
 * Mutation pour ajouter une nouvelle personne
 * @param personne - Données de la personne à créer (type PersonneInput)
 * @returns La personne créée avec son ID généré
 */
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

/**
 * Requête pour rechercher des personnes par nom
 * Effectue une recherche partielle sur le nom de famille
 * @param nom - Nom ou partie du nom à rechercher
 */
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

/**
 * Requête pour obtenir une personne spécifique par son ID
 * @param id - Identifiant unique de la personne
 */
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

/**
 * Mutation pour modifier une personne existante
 * @param id - Identifiant de la personne à modifier
 * @param personne - Nouvelles données de la personne
 */
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

/**
 * Mutation pour supprimer une personne
 * @param id - Identifiant de la personne à supprimer
 * @returns Boolean indiquant le succès de l'opération
 */
const SUPPRIMER_PERSONNE = gql`
  mutation supprimerPersonne($id: ID!) {
    supprimerPersonne(id: $id)
  }
`;

/**
 * Service de gestion des personnes
 * 
 * Ce service encapsule toutes les opérations CRUD (Create, Read, Update, Delete)
 * pour les entités Personne via GraphQL. Il utilise Apollo Client pour 
 * communiquer avec le serveur GraphQL.
 * 
 * FONCTIONNALITÉS :
 * - Lister toutes les personnes
 * - Ajouter une nouvelle personne
 * - Rechercher des personnes par nom
 * - Obtenir une personne par ID
 * - Modifier une personne existante
 * - Supprimer une personne
 * 
 * GESTION DU CACHE :
 * - Les mutations mettent automatiquement à jour le cache
 * - Certaines requêtes forcent la récupération depuis le serveur
 */
@Injectable({
  providedIn: 'root',
})
export class PersonneService {
  constructor(private apollo: Apollo) {}

  /**
   * Récupère la liste complète de toutes les personnes
   * 
   * Utilise watchQuery pour maintenir le cache synchronisé.
   * Les données sont automatiquement mises à jour quand le cache change.
   * 
   * @returns Observable<Personne[]> - Liste de toutes les personnes
   */
  listerPersonnes(): Observable<Personne[]> {
    return this.apollo
      .watchQuery<{ listerToutesPersonnes: Personne[] }>({
        query: LISTER_PERSONNES,
      })
      .valueChanges.pipe(map((result) => result.data.listerToutesPersonnes));
  }

  /**
   * Ajoute une nouvelle personne dans le système
   * 
   * Après l'ajout, la liste des personnes est automatiquement actualisée
   * grâce à refetchQueries.
   * 
   * @param personne - Données de la personne à créer
   * @returns Observable<Personne> - La personne créée avec son ID
   */
  ajouterPersonne(personne: PersonneInput): Observable<Personne> {
    return this.apollo
      .mutate<{ ajouterPersonne: Personne }>({
        mutation: AJOUTER_PERSONNE,
        variables: { personne },
        // Force la mise à jour de la liste après ajout
        refetchQueries: [{ query: LISTER_PERSONNES }],
      })
      .pipe(map((result) => result.data!.ajouterPersonne));
  }

  /**
   * Récupère une personne spécifique par son identifiant
   * 
   * Utilise fetchPolicy: 'network-only' pour s'assurer d'avoir
   * les données les plus récentes du serveur.
   * 
   * @param id - ID unique de la personne
   * @returns Observable<Personne> - La personne correspondante
   */
  obtenirPersonne(id: string): Observable<Personne> {
    return this.apollo
      .query<{ rechercherPersonneParId: Personne }>({
        query: OBTENIR_PERSONNE,
        variables: { id },
        // Force la récupération depuis le serveur
        fetchPolicy: 'network-only'
      })
      .pipe(map((result) => result.data.rechercherPersonneParId));
  }

  /**
   * Recherche des personnes par nom
   * 
   * Effectue une recherche partielle sur le nom de famille.
   * Utile pour les fonctionnalités d'autocomplétion ou de filtrage.
   * 
   * @param nom - Nom ou partie du nom à rechercher
   * @returns Observable<Personne[]> - Liste des personnes correspondantes
   */
  rechercherPersonnes(nom: string): Observable<Personne[]> {
    return this.apollo
      .query<{ rechercherPersonnes: Personne[] }>({
        query: RECHERCHER_PERSONNES,
        variables: { nom },
        // Force la recherche en temps réel
        fetchPolicy: 'network-only'
      })
      .pipe(map((result) => result.data.rechercherPersonnes));
  }

  /**
   * Modifie une personne existante
   * 
   * Nettoie les données avant envoi pour éviter les conflits avec Apollo.
   * Met à jour automatiquement la liste des personnes après modification.
   * 
   * @param id - ID de la personne à modifier
   * @param personne - Nouvelles données de la personne
   * @returns Observable<Personne> - La personne modifiée
   */
  modifier(id: string, personne: PersonneInput): Observable<Personne> {
    // Nettoie les données pour éviter les champs Apollo (__typename, etc.)
    const cleanedPersonne = this.cleanPersonneForMutation(personne);

    return this.apollo
      .mutate<{ modifierPersonne: Personne }>({
        mutation: MODIFIER_PERSONNE,
        variables: { id, personne: cleanedPersonne },
        // Actualise la liste après modification
        refetchQueries: [{ query: LISTER_PERSONNES }],
      })
      .pipe(map((result) => result.data!.modifierPersonne));
  }

  /**
   * Supprime une personne du système
   * 
   * Suppression définitive avec mise à jour automatique de la liste.
   * 
   * @param id - ID de la personne à supprimer
   * @returns Observable<boolean> - true si suppression réussie
   */
  supprimerPersonne(id: string): Observable<boolean> {
    return this.apollo
      .mutate<{ supprimerPersonne: boolean }>({
        mutation: SUPPRIMER_PERSONNE,
        variables: { id },
        // Actualise la liste après suppression
        refetchQueries: [{ query: LISTER_PERSONNES }],
      })
      .pipe(map((result) => result.data!.supprimerPersonne));
  }

  /**
   * Méthode utilitaire pour nettoyer les données avant mutation
   * 
   * Supprime les champs Apollo (__typename, etc.) et nettoie les chaînes.
   * Évite les erreurs lors de l'envoi des données au serveur.
   * 
   * @param personne - Objet personne potentiellement "sale"
   * @returns PersonneInput - Objet nettoyé prêt pour GraphQL
   */
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
