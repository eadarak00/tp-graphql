// src/app/pages/personnes/ajouter-personne/ajouter-personne.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PersonneService } from '../../../core/services/personne.service';
import { PersonneInput } from '../../../models/personne';

@Component({
  selector: 'app-ajouter-personne',
  templateUrl: './ajouter-personne.component.html',
  styleUrls: ['./ajouter-personne.component.css']
})
export class AjouterPersonneComponent implements OnInit {
  personneForm: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private personneService: PersonneService,
    private router: Router
  ) {
    this.personneForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      dateNaissance: [''],
      adresse: [''],
      telephone: ['', [Validators.pattern(/^[\d\s\-\+\(\)]+$/)]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.personneForm.valid) {
      this.loading = true;
      this.error = null;

      const personneInput: PersonneInput = {
        nom: this.personneForm.value.nom.trim(),
        prenom: this.personneForm.value.prenom.trim(),
        dateNaissance: this.personneForm.value.dateNaissance || null,
        adresse: this.personneForm.value.adresse?.trim() || null,
        telephone: this.personneForm.value.telephone?.trim() || null
      };

      this.personneService.ajouterPersonne(personneInput).subscribe({
        next: (personne) => {
          console.log('Personne ajoutée avec succès:', personne);
          this.router.navigate(['/personnes']);
        },
        error: (err) => {
          this.loading = false;
          this.error = 'Erreur lors de l\'ajout de la personne: ' + err.message;
          console.error('Erreur:', err);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.personneForm.controls).forEach(key => {
      const control = this.personneForm.get(key);
      control?.markAsTouched();
    });
  }

  retourListe(): void {
    this.router.navigate(['/personnes']);
  }

  // Méthodes d'aide pour le template
  isFieldInvalid(fieldName: string): boolean {
    const field = this.personneForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.personneForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} est requis`;
      }
      if (field.errors['minlength']) {
        const requiredLength = field.errors['minlength'].requiredLength;
        return `${this.getFieldLabel(fieldName)} doit contenir au moins ${requiredLength} caractères`;
      }
      if (field.errors['pattern']) {
        return 'Format de téléphone invalide';
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      nom: 'Le nom',
      prenom: 'Le prénom',
      telephone: 'Le téléphone'
    };
    return labels[fieldName] || fieldName;
  }
}