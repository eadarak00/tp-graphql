export interface Personne {
  id?: string;
  nom: string;
  prenom: string;
  adresse?: string;
  telephone?: string;
  dateNaissance?: string;
}

export interface PersonneInput {
  nom: string;
  prenom: string;
  dateNaissance?: string;
  adresse?: string;
  telephone?: string;
}