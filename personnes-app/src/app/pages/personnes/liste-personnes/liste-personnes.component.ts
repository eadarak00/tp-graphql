// src/app/pages/personnes/liste-personnes/liste-personnes.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PersonneService } from '../../../core/services/personne.service';
import { Personne } from '../../../models/personne';

@Component({
  selector: 'app-liste-personnes',
  templateUrl: './liste-personnes.component.html',
  styleUrls: ['./liste-personnes.component.css']
})
export class ListePersonnesComponent implements OnInit {
  personnes$: Observable<Personne[]> | undefined;
  loading = true;
  error: string | null = null;

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
    if (!personne.id) return;
    
    const confirmation = confirm(
      `Êtes-vous sûr de vouloir supprimer ${personne.prenom} ${personne.nom} ?`
    );
    
    if (confirmation) {
      this.personneService.supprimerPersonne(personne.id).subscribe({
        next: () => {
          console.log('Personne supprimée avec succès');
          // Le refetchQueries dans le service actualisera automatiquement la liste
        },
        error: (err) => {
          this.error = 'Erreur lors de la suppression: ' + err.message;
          console.error('Erreur:', err);
        }
      });
    }
  }

  // formaterDate(date: string | undefined): string {
  //   if (!date) return 'Non renseignée';
  //   return new Date(date).toLocaleDateString('fr-FR');
  // }
}
