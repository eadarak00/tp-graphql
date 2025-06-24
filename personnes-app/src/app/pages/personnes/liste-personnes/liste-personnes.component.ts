// src/app/pages/personnes/liste-personnes/liste-personnes.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PersonneService } from '../../../core/services/personne.service';
import { Personne, PersonneInput } from '../../../models/personne';

/**
 * ListePersonnesComponent - Composant principal pour la gestion des personnes
 * 
 * Ce composant permet de :
 * - Afficher la liste complète des personnes
 * - Supprimer une personne avec confirmation
 * - Rechercher une personne par ID et la modifier
 * - Naviguer vers le formulaire d'ajout
 * - Calculer et afficher l'âge des personnes
 * 
 * @description Composant CRUD (Create, Read, Update, Delete) pour les personnes
 */
@Component({
  selector: 'app-liste-personnes',
  templateUrl: './liste-personnes.component.html',
  styleUrls: ['./liste-personnes.component.css']
})
export class ListePersonnesComponent implements OnInit {
  
  // ============================================================================
  // PROPRIÉTÉS DE GESTION DES DONNÉES
  // ============================================================================
  
  /**
   * Observable contenant la liste des personnes
   * Utilise un Observable pour permettre une gestion réactive des données
   */
  personnes$: Observable<Personne[]> | undefined;
  
  /**
   * États de chargement et d'erreur pour l'affichage
   */
  loading = true;                    // Indique si les données sont en cours de chargement
  error: string | null = null;       // Message d'erreur à afficher à l'utilisateur
  
  // ============================================================================
  // PROPRIÉTÉS DU MODAL DE MODIFICATION
  // ============================================================================
  
  /**
   * Variables pour gérer le modal de modification d'une personne
   */
  showModal = false;                           // Contrôle l'affichage du modal
  personneAModifier: Personne | null = null;   // Personne actuellement en cours de modification
  formData: Partial<PersonneInput> = {};       // Données du formulaire de modification
  submitting = false;                          // Indique si une soumission est en cours
  loadingPersonne = false;                     // Indique si la recherche d'une personne est en cours

  // ============================================================================
  // PROPRIÉTÉS DE RECHERCHE
  // ============================================================================
  
  /**
   * Variables pour la fonctionnalité de recherche par ID
   */
  searchId = '';                        // ID saisi par l'utilisateur pour la recherche
  searchError: string | null = null;    // Message d'erreur spécifique à la recherche

  /**
   * CONSTRUCTEUR
   * 
   * Injection des dépendances nécessaires au fonctionnement du composant
   * 
   * @param personneService Service pour les opérations CRUD sur les personnes
   * @param router Service de navigation Angular pour changer de page
   */
  constructor(
    private personneService: PersonneService,
    private router: Router
  ) {}

  // ============================================================================
  // CYCLE DE VIE DU COMPOSANT
  // ============================================================================

  /**
   * ngOnInit - Méthode du cycle de vie Angular
   * 
   * Appelée automatiquement après l'initialisation du composant.
   * Charge la liste des personnes au démarrage.
   */
  ngOnInit(): void {
    this.chargerPersonnes();
  }

  // ============================================================================
  // MÉTHODES DE GESTION DES DONNÉES
  // ============================================================================

  /**
   * Charge la liste complète des personnes depuis le service
   * 
   * Gère les états de chargement et d'erreur pour une meilleure UX.
   * Utilise un Observable pour une approche réactive.
   * 
   * @description Méthode principale pour récupérer et afficher les données
   */
  chargerPersonnes(): void {
    this.loading = true;
    this.error = null;
    
    // Récupération des données via le service
    this.personnes$ = this.personneService.listerPersonnes();
    
    // Gestion des états de chargement et d'erreur
    this.personnes$.subscribe({
      next: () => {
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Erreur lors du chargement des personnes: ' + err.message;
        console.error('Erreur:', err);
      }
    });
  }

  // ============================================================================
  // MÉTHODES DE NAVIGATION
  // ============================================================================

  /**
   * Navigation vers la page d'ajout d'une nouvelle personne
   * 
   * Utilise le router Angular pour naviguer vers la route '/ajouter'
   * définie dans le module de routage.
   */
  naviguerVersAjouter(): void {
    this.router.navigate(['/ajouter']);
  }

  // ============================================================================
  // MÉTHODES DE SUPPRESSION
  // ============================================================================

  /**
   * Supprime une personne après confirmation de l'utilisateur
   * 
   * @param personne La personne à supprimer
   * 
   * Processus :
   * 1. Vérification que la personne a un ID valide
   * 2. Demande de confirmation à l'utilisateur
   * 3. Appel du service de suppression
   * 4. Rechargement de la liste en cas de succès
   * 5. Affichage d'erreur en cas d'échec
   */
  supprimerPersonne(personne: Personne): void {
    // Vérification de l'existence de l'ID
    if (!personne.id) {
      console.log(`La personne ${personne.id} est introuvable `);
      return;
    }

    // Demande de confirmation avec le nom complet de la personne
    const confirmation = confirm(
      `Êtes-vous sûr de vouloir supprimer ${personne.prenom} ${personne.nom} ?`
    );

    if (confirmation) {
      this.personneService.supprimerPersonne(personne.id).subscribe({
        next: () => {
          console.log('Personne supprimée avec succès');
          this.chargerPersonnes(); // Actualisation de la liste
        },
        error: (err) => {
          this.error = 'Erreur lors de la suppression: ' + err.message;
          console.error('Erreur:', err);
        }
      });
    }
  }

  // ============================================================================
  // MÉTHODES DE RECHERCHE ET MODIFICATION
  // ============================================================================

  /**
   * Recherche une personne par son ID et ouvre le modal de modification
   * 
   * Processus :
   * 1. Validation que l'ID n'est pas vide
   * 2. Recherche de la personne via le service
   * 3. Ouverture du modal si la personne est trouvée
   * 4. Affichage d'erreur si la personne n'existe pas
   * 
   * @description Combinaison recherche + ouverture du modal pour l'UX
   */
  rechercherEtModifier(): void {
    // Validation de la saisie
    if (!this.searchId.trim()) {
      this.searchError = 'Veuillez saisir un ID';
      return;
    }

    // Gestion de l'état de chargement
    this.loadingPersonne = true;
    this.searchError = null;

    // Recherche de la personne
    this.personneService.obtenirPersonne(this.searchId.trim()).subscribe({
      next: (personne) => {
        this.loadingPersonne = false;
        if (personne) {
          this.ouvrirModalModification(personne);
          this.searchId = ''; // Nettoyage du champ de recherche
        } else {
          this.searchError = 'Personne introuvable avec cet ID';
        }
      },
      error: (err) => {
        this.loadingPersonne = false;
        this.searchError = 'Erreur lors de la recherche: ' + err.message;
        console.error('Erreur:', err);
      }
    });
  }

  // ============================================================================
  // MÉTHODES DE GESTION DU MODAL
  // ============================================================================

  /**
   * Ouvre le modal de modification avec les données de la personne
   * 
   * @param personne La personne à modifier
   * 
   * Prépare le formulaire avec les données existantes de la personne.
   * Utilise Partial<PersonneInput> pour permettre des champs optionnels.
   */
  ouvrirModalModification(personne: Personne): void {
    this.personneAModifier = personne;
    this.formData = {
      prenom: personne.prenom,
      nom: personne.nom,
      adresse: personne.adresse || '',
      telephone: personne.telephone || '',
      dateNaissance: personne.dateNaissance || ''
    };
    this.showModal = true;
  }

  /**
   * Ferme le modal et nettoie toutes les données temporaires
   * 
   * Remet à zéro :
   * - L'état d'affichage du modal
   * - La personne en cours de modification
   * - Les données du formulaire
   * - L'état de soumission
   */
  fermerModal(): void {
    this.showModal = false;
    this.personneAModifier = null;
    this.formData = {};
    this.submitting = false;
  }

  /**
   * Effectue la modification d'une personne
   * 
   * Processus complet de validation et sauvegarde :
   * 1. Vérifications préliminaires (ID, état de soumission)
   * 2. Validation des champs obligatoires
   * 3. Validation de la date de naissance
   * 4. Nettoyage des données (suppression des champs Apollo)
   * 5. Appel du service de modification
   * 6. Fermeture du modal et rechargement en cas de succès
   * 
   * @description Méthode centrale pour la mise à jour des données
   */
  modifierPersonne(): void {
    // Vérifications préliminaires
    if (!this.personneAModifier?.id || this.submitting) {
      return;
    }

    // Validation des champs obligatoires
    if (!this.formData.prenom?.trim() || !this.formData.nom?.trim()) {
      alert('Le prénom et le nom sont obligatoires');
      return;
    }

    // Validation de la date de naissance
    if (this.formData.dateNaissance && !this.isValidDate(this.formData.dateNaissance)) {
      alert('La date de naissance n\'est pas valide');
      return;
    }

    this.submitting = true;

    // Création d'un objet propre sans métadonnées Apollo/GraphQL
    const personneModifiee: PersonneInput = {
      prenom: this.formData.prenom!.trim(),
      nom: this.formData.nom!.trim(),
      adresse: this.formData.adresse?.trim() || '',
      telephone: this.formData.telephone?.trim() || '',
      dateNaissance: this.formData.dateNaissance?.trim() || ''
    };

    // Appel du service de modification
    this.personneService.modifier(this.personneAModifier.id, personneModifiee).subscribe({
      next: () => {
        console.log('Personne modifiée avec succès');
        this.fermerModal();
        this.chargerPersonnes(); // Actualisation de la liste
      },
      error: (err) => {
        this.submitting = false;
        this.error = 'Erreur lors de la modification: ' + err.message;
        console.error('Erreur:', err);
      }
    });
  }

  // ============================================================================
  // MÉTHODES UTILITAIRES
  // ============================================================================

  /**
   * Valide le format d'une date
   * 
   * @param dateString Chaîne de caractères représentant une date
   * @returns true si la date est valide ou vide, false sinon
   * 
   * @description Permet de vérifier qu'une date peut être parsée correctement
   */
  private isValidDate(dateString: string): boolean {
    if (!dateString) return true; // Date optionnelle
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  }

  /**
   * Calcule l'âge d'une personne à partir de sa date de naissance
   * 
   * @param dateNaissance Date de naissance au format string
   * @returns L'âge en années ou null si pas de date
   * 
   * Calcul précis qui prend en compte :
   * - L'année de naissance
   * - Le mois et le jour pour déterminer si l'anniversaire est passé
   * 
   * @description Utilitaire pour l'affichage de l'âge dans l'interface
   */
  calculerAge(dateNaissance: string): number | null {
    if (!dateNaissance) return null;
    
    const naissance = new Date(dateNaissance);
    const aujourdhui = new Date();
    let age = aujourdhui.getFullYear() - naissance.getFullYear();
    const moisDiff = aujourdhui.getMonth() - naissance.getMonth();
    
    // Ajustement si l'anniversaire n'est pas encore passé cette année
    if (moisDiff < 0 || (moisDiff === 0 && aujourdhui.getDate() < naissance.getDate())) {
      age--;
    }
    
    return age;
  }

  /**
   * Formate une date pour l'affichage en français
   * 
   * @param dateString Date au format ISO string
   * @returns Date formatée en français (jj/mm/aaaa)
   * 
   * @description Améliore la lisibilité des dates dans l'interface utilisateur
   */
  formaterDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  }

  /**
   * Retourne la date maximale autorisée (aujourd'hui)
   * 
   * @returns Date du jour au format YYYY-MM-DD
   * 
   * Utilisée pour limiter la saisie de dates de naissance dans le futur.
   * Format compatible avec les inputs HTML de type date.
   * 
   * @description Contrainte de validation pour les formulaires de date
   */
  getMaxDate(): string {
    return new Date().toISOString().split('T')[0];
  }
}