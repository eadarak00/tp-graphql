// // src/app/pages/personnes/liste-personnes/liste-personnes.component.ts
// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { Observable } from 'rxjs';
// import { PersonneService } from '../../../core/services/personne.service';
// import { Personne } from '../../../models/personne';

// @Component({
//   selector: 'app-liste-personnes',
//   templateUrl: './liste-personnes.component.html',
//   styleUrls: ['./liste-personnes.component.css']
// })
// export class ListePersonnesComponent implements OnInit {
//   personnes$: Observable<Personne[]> | undefined;
//   loading = true;
//   error: string | null = null;
  
//   // Variables pour le modal de modification
//   showModal = false;
//   personneAModifier: Personne | null = null;
//   formData: Partial<Personne> = {};
//   submitting = false;

//   constructor(
//     private personneService: PersonneService,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     this.chargerPersonnes();
//   }

//   chargerPersonnes(): void {
//     this.loading = true;
//     this.error = null;
    
//     this.personnes$ = this.personneService.listerPersonnes();
    
//     // Pour gérer le loading state
//     this.personnes$.subscribe({
//       next: () => {
//         this.loading = false;
//       },
//       error: (err) => {
//         this.loading = false;
//         this.error = 'Erreur lors du chargement des personnes: ' + err.message;
//         console.error('Erreur:', err);
//       }
//     });
//   }

//   naviguerVersAjouter(): void {
//     this.router.navigate(['/ajouter']);
//   }

//   supprimerPersonne(personne: Personne): void {
//     if (!personne.id) {
//       console.log(`La personne ${personne.id} est introuvable `);
//       return;
//     }

//     const confirmation = confirm(
//       `Êtes-vous sûr de vouloir supprimer ${personne.prenom} ${personne.nom} ?`
//     );

//     if (confirmation) {
//       this.personneService.supprimerPersonne(personne.id).subscribe({
//         next: () => {
//           console.log('Personne supprimée avec succès');
//           this.chargerPersonnes(); // Recharger la liste
//         },
//         error: (err) => {
//           this.error = 'Erreur lors de la suppression: ' + err.message;
//           console.error('Erreur:', err);
//         }
//       });
//     }
//   }

//   // Méthodes pour le modal de modification
//   ouvrirModalModification(personne: Personne): void {
//     this.personneAModifier = personne;
//     this.formData = {
//       prenom: personne.prenom,
//       nom: personne.nom,
//       adresse: personne.adresse,
//       telephone: personne.telephone
//     };
//     this.showModal = true;
//   }

//   fermerModal(): void {
//     this.showModal = false;
//     this.personneAModifier = null;
//     this.formData = {};
//     this.submitting = false;
//   }

//   modifierPersonne(): void {
//     if (!this.personneAModifier?.id || this.submitting) {
//       return;
//     }

//     // Validation basique
//     if (!this.formData.prenom?.trim() || !this.formData.nom?.trim()) {
//       alert('Le prénom et le nom sont obligatoires');
//       return;
//     }

//     this.submitting = true;

//     // Créer un objet propre sans __typename et autres champs Apollo
//     const personneModifiee = {
//       prenom: this.formData.prenom!.trim(),
//       nom: this.formData.nom!.trim(),
//       adresse: this.formData.adresse?.trim() || '',
//       telephone: this.formData.telephone?.trim() || ''
//     };

//     this.personneService.modifier(this.personneAModifier.id, personneModifiee).subscribe({
//       next: () => {
//         console.log('Personne modifiée avec succès');
//         this.fermerModal();
//         this.chargerPersonnes(); // Recharger la liste
//       },
//       error: (err) => {
//         this.submitting = false;
//         this.error = 'Erreur lors de la modification: ' + err.message;
//         console.error('Erreur:', err);
//       }
//     });
//   }
// }


// src/app/pages/personnes/liste-personnes/liste-personnes.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PersonneService } from '../../../core/services/personne.service';
import { Personne, PersonneInput } from '../../../models/personne';

@Component({
  selector: 'app-liste-personnes',
  templateUrl: './liste-personnes.component.html',
  styleUrls: ['./liste-personnes.component.css']
})
export class ListePersonnesComponent implements OnInit {
  personnes$: Observable<Personne[]> | undefined;
  loading = true;
  error: string | null = null;
  
  // Variables pour le modal de modification
  showModal = false;
  personneAModifier: Personne | null = null;
  formData: Partial<PersonneInput> = {};
  submitting = false;
  loadingPersonne = false;

  // Variables pour la recherche
  searchId = '';
  searchError: string | null = null;

  constructor(
    private personneService: PersonneService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.chargerPersonnes();
  }

  chargerPersonnes(): void {
    this.loading = true;
    this.error = null;
    
    this.personnes$ = this.personneService.listerPersonnes();
    
    // Pour gérer le loading state
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

  naviguerVersAjouter(): void {
    this.router.navigate(['/ajouter']);
  }

  supprimerPersonne(personne: Personne): void {
    if (!personne.id) {
      console.log(`La personne ${personne.id} est introuvable `);
      return;
    }

    const confirmation = confirm(
      `Êtes-vous sûr de vouloir supprimer ${personne.prenom} ${personne.nom} ?`
    );

    if (confirmation) {
      this.personneService.supprimerPersonne(personne.id).subscribe({
        next: () => {
          console.log('Personne supprimée avec succès');
          this.chargerPersonnes(); // Recharger la liste
        },
        error: (err) => {
          this.error = 'Erreur lors de la suppression: ' + err.message;
          console.error('Erreur:', err);
        }
      });
    }
  }

  // Recherche par ID et ouverture du modal
  rechercherEtModifier(): void {
    if (!this.searchId.trim()) {
      this.searchError = 'Veuillez saisir un ID';
      return;
    }

    this.loadingPersonne = true;
    this.searchError = null;

    this.personneService.obtenirPersonne(this.searchId.trim()).subscribe({
      next: (personne) => {
        this.loadingPersonne = false;
        if (personne) {
          this.ouvrirModalModification(personne);
          this.searchId = ''; // Vider le champ de recherche
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

  // Méthodes pour le modal de modification
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

  fermerModal(): void {
    this.showModal = false;
    this.personneAModifier = null;
    this.formData = {};
    this.submitting = false;
  }

  modifierPersonne(): void {
    if (!this.personneAModifier?.id || this.submitting) {
      return;
    }

    // Validation basique
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

    // Créer un objet propre sans __typename et autres champs Apollo
    const personneModifiee: PersonneInput = {
      prenom: this.formData.prenom!.trim(),
      nom: this.formData.nom!.trim(),
      adresse: this.formData.adresse?.trim() || '',
      telephone: this.formData.telephone?.trim() || '',
      dateNaissance: this.formData.dateNaissance?.trim() || ''
    };

    this.personneService.modifier(this.personneAModifier.id, personneModifiee).subscribe({
      next: () => {
        console.log('Personne modifiée avec succès');
        this.fermerModal();
        this.chargerPersonnes(); // Recharger la liste
      },
      error: (err) => {
        this.submitting = false;
        this.error = 'Erreur lors de la modification: ' + err.message;
        console.error('Erreur:', err);
      }
    });
  }

  // Utilitaires
  private isValidDate(dateString: string): boolean {
    if (!dateString) return true; // Date optionnelle
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  }

  calculerAge(dateNaissance: string): number | null {
    if (!dateNaissance) return null;
    const naissance = new Date(dateNaissance);
    const aujourd_hui = new Date();
    let age = aujourd_hui.getFullYear() - naissance.getFullYear();
    const moisDiff = aujourd_hui.getMonth() - naissance.getMonth();
    
    if (moisDiff < 0 || (moisDiff === 0 && aujourd_hui.getDate() < naissance.getDate())) {
      age--;
    }
    
    return age;
  }

  formaterDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  }

  // Nouvelle méthode pour obtenir la date maximale
  getMaxDate(): string {
    return new Date().toISOString().split('T')[0];
  }
}