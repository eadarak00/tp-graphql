// src/app/pages/personnes/ajouter-personne/ajouter-personne.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PersonneService } from '../../../core/services/personne.service';
import { PersonneInput } from '../../../models/personne';

/**
 * AjouterPersonneComponent - Composant pour l'ajout d'une nouvelle personne
 * 
 * Ce composant implémente un formulaire réactif complet pour créer une nouvelle personne
 * avec validation en temps réel et gestion d'erreurs. Il utilise les Angular Reactive Forms
 * pour une approche robuste et scalable de la gestion des formulaires.
 * 
 * Fonctionnalités principales :
 * - Formulaire réactif avec validation intégrée
 * - Validation côté client avec messages d'erreur personnalisés
 * - Gestion des états de chargement et d'erreur
 * - Navigation automatique après succès
 * - Interface utilisateur intuitive
 * 
 * @description Composant de création utilisant les meilleures pratiques Angular
 */
@Component({
  selector: 'app-ajouter-personne',
  templateUrl: './ajouter-personne.component.html',
  styleUrls: ['./ajouter-personne.component.css']
})
export class AjouterPersonneComponent implements OnInit {

  // ============================================================================
  // PROPRIÉTÉS DU COMPOSANT
  // ============================================================================

  /**
   * Formulaire réactif Angular pour la saisie des données de la personne
   * 
   * Utilise FormGroup pour grouper les contrôles et gérer la validation.
   * Configuration dans le constructeur avec FormBuilder pour plus de lisibilité.
   * 
   * @description Cœur du système de validation et de saisie des données
   */
  personneForm: FormGroup;

  /**
   * États de l'interface utilisateur
   */
  loading = false;                    // Indique si une opération d'ajout est en cours
  error: string | null = null;        // Message d'erreur à afficher en cas d'échec

  /**
   * CONSTRUCTEUR - Configuration du formulaire et injection des dépendances
   * 
   * @param fb FormBuilder - Service Angular pour construire des formulaires réactifs
   * @param personneService Service métier pour les opérations sur les personnes
   * @param router Service de navigation pour rediriger après succès
   * 
   * Le formulaire est configuré directement dans le constructeur pour assurer
   * sa disponibilité dès l'initialisation du composant.
   */
  constructor(
    private fb: FormBuilder,
    private personneService: PersonneService,
    private router: Router
  ) {
    // Configuration du formulaire réactif avec validations
    this.personneForm = this.fb.group({
      /**
       * CHAMP NOM - Obligatoire avec longueur minimale
       * 
       * Validations :
       * - required : Le nom est obligatoire
       * - minLength(2) : Au moins 2 caractères pour éviter les saisies accidentelles
       */
      nom: ['', [Validators.required, Validators.minLength(2)]],

      /**
       * CHAMP PRÉNOM - Obligatoire avec longueur minimale
       * 
       * Validations identiques au nom pour la cohérence
       */
      prenom: ['', [Validators.required, Validators.minLength(2)]],

      /**
       * CHAMP DATE DE NAISSANCE - Optionnel
       * 
       * Pas de validation car ce champ est facultatif.
       * Le contrôle de format sera géré par l'input HTML de type date.
       */
      dateNaissance: [''],

      /**
       * CHAMP ADRESSE - Optionnel
       * 
       * Champ libre sans validation pour maximum de flexibilité
       */
      adresse: [''],

      /**
       * CHAMP TÉLÉPHONE - Optionnel avec validation de format
       * 
       * Validation par expression régulière pour accepter :
       * - Chiffres (\d)
       * - Espaces (\s)
       * - Tirets (-)
       * - Plus (+) pour les indicatifs internationaux
       * - Parenthèses () pour les codes de zone
       */
      telephone: ['', [Validators.pattern(/^[\d\s\-\+\(\)]+$/)]]
    });
  }

  // ============================================================================
  // CYCLE DE VIE DU COMPOSANT
  // ============================================================================

  /**
   * ngOnInit - Initialisation du composant
   * 
   * Méthode vide car toute l'initialisation se fait dans le constructeur.
   * Conservée pour respecter l'interface OnInit et permettre d'éventuelles
   * extensions futures.
   */
  ngOnInit(): void {
    // Pas d'initialisation supplémentaire nécessaire
    // Le formulaire est déjà configuré dans le constructeur
  }

  // ============================================================================
  // MÉTHODES DE GESTION DU FORMULAIRE
  // ============================================================================

  /**
   * Traite la soumission du formulaire
   * 
   * Processus complet de validation et d'ajout :
   * 1. Vérification de la validité du formulaire
   * 2. Préparation des données (nettoyage et format)
   * 3. Appel du service d'ajout
   * 4. Gestion du succès (navigation) ou de l'erreur
   * 5. Si formulaire invalide : activation des messages d'erreur
   * 
   * @description Méthode centrale du composant, orchestrant tout le processus d'ajout
   */
  onSubmit(): void {
    if (this.personneForm.valid) {
      // Activation de l'état de chargement
      this.loading = true;
      this.error = null;

      // Préparation des données avec nettoyage et validation
      const personneInput: PersonneInput = {
        nom: this.personneForm.value.nom.trim(),                    // Suppression des espaces en début/fin
        prenom: this.personneForm.value.prenom.trim(),              // Suppression des espaces en début/fin
        dateNaissance: this.personneForm.value.dateNaissance || null,  // null si vide pour la base de données
        adresse: this.personneForm.value.adresse?.trim() || null,      // null si vide, trim si présent
        telephone: this.personneForm.value.telephone?.trim() || null   // null si vide, trim si présent
      };

      // Appel du service d'ajout avec gestion des résultats
      this.personneService.ajouterPersonne(personneInput).subscribe({
        next: (personne) => {
          console.log('Personne ajoutée avec succès:', personne);
          // Navigation automatique vers la liste après succès
          this.router.navigate(['/personnes']);
        },
        error: (err) => {
          // Gestion des erreurs avec remise à zéro du loading
          this.loading = false;
          this.error = 'Erreur lors de l\'ajout de la personne: ' + err.message;
          console.error('Erreur:', err);
        }
      });
    } else {
      // Si le formulaire n'est pas valide, afficher les erreurs
      this.markFormGroupTouched();
    }
  }

  /**
   * Marque tous les champs du formulaire comme "touchés"
   * 
   * Cette méthode force l'affichage des messages d'erreur pour tous les champs
   * invalides lorsque l'utilisateur tente de soumettre un formulaire non valide.
   * 
   * Parcourt tous les contrôles du FormGroup et applique markAsTouched()
   * qui déclenche l'affichage des erreurs dans le template.
   * 
   * @description Améliore l'expérience utilisateur en montrant toutes les erreurs d'un coup
   */
  private markFormGroupTouched(): void {
    Object.keys(this.personneForm.controls).forEach(key => {
      const control = this.personneForm.get(key);
      control?.markAsTouched();
    });
  }

  // ============================================================================
  // MÉTHODES DE NAVIGATION
  // ============================================================================

  /**
   * Retour vers la liste des personnes
   * 
   * Permet à l'utilisateur d'annuler l'ajout et de revenir à la liste principale.
   * Utile pour l'expérience utilisateur et la navigation intuitive.
   */
  retourListe(): void {
    this.router.navigate(['/personnes']);
  }

  // ============================================================================
  // MÉTHODES D'AIDE POUR LE TEMPLATE
  // ============================================================================

  /**
   * Détermine si un champ spécifique est en erreur et doit afficher un message
   * 
   * @param fieldName Nom du champ à vérifier
   * @returns true si le champ est invalide ET a été touché par l'utilisateur
   * 
   * Cette méthode est utilisée dans le template pour contrôler l'affichage
   * conditionnel des messages d'erreur. Un champ doit être à la fois :
   * - invalid : ne respecte pas les règles de validation
   * - touched : l'utilisateur a interagi avec (focus puis blur)
   * 
   * @description Évite l'affichage d'erreurs avant que l'utilisateur ait saisi quelque chose
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.personneForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  /**
   * Génère le message d'erreur approprié pour un champ donné
   * 
   * @param fieldName Nom du champ pour lequel générer le message
   * @returns Message d'erreur localisé et personnalisé
   * 
   * Analyse le type d'erreur de validation et retourne un message
   * en français adapté au contexte. Gère les erreurs courantes :
   * - required : champ obligatoire manquant
   * - minlength : longueur insuffisante avec indication du minimum
   * - pattern : format incorrect (spécifique au téléphone)
   * 
   * @description Centralise la logique des messages d'erreur pour cohérence et maintenabilité
   */
  getFieldError(fieldName: string): string {
    const field = this.personneForm.get(fieldName);
    
    if (field?.errors) {
      // Erreur de champ requis
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} est requis`;
      }
      
      // Erreur de longueur minimale
      if (field.errors['minlength']) {
        const requiredLength = field.errors['minlength'].requiredLength;
        return `${this.getFieldLabel(fieldName)} doit contenir au moins ${requiredLength} caractères`;
      }
      
      // Erreur de format (spécifique au téléphone)
      if (field.errors['pattern']) {
        return 'Format de téléphone invalide';
      }
    }
    
    return '';
  }

  /**
   * Retourne le libellé français d'un champ pour les messages d'erreur
   * 
   * @param fieldName Nom technique du champ
   * @returns Libellé utilisateur en français
   * 
   * Map les noms techniques des champs vers leurs libellés utilisateur
   * pour des messages d'erreur plus naturels et compréhensibles.
   * 
   * @description Améliore la qualité des messages d'erreur avec des termes métier
   */
  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      nom: 'Le nom',
      prenom: 'Le prénom',
      telephone: 'Le téléphone'
    };
    return labels[fieldName] || fieldName;
  }
}