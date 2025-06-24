/**
 * Interface représentant une personne dans le système
 * 
 * Cette interface définit la structure complète d'une personne avec tous ses attributs,
 * incluant l'identifiant unique généré par le système.
 */
export interface Personne {
  /** 
   * Identifiant unique de la personne (généré automatiquement par le système)
   * Optionnel car il n'existe pas lors de la création d'une nouvelle personne
   */
  id?: string;

  /** 
   * Nom de famille de la personne
   * Champ obligatoire
   */
  nom: string;

  /** 
   * Prénom de la personne
   * Champ obligatoire
   */
  prenom: string;

  /** 
   * Adresse complète de résidence de la personne
   * Champ optionnel
   */
  adresse?: string;

  /** 
   * Numéro de téléphone de la personne
   * Champ optionnel - peut inclure indicatif pays
   */
  telephone?: string;

  /** 
   * Date de naissance de la personne
   * Format attendu : chaîne de caractères (ex: "1990-01-15" ou "15/01/1990")
   * Champ optionnel
   */
  dateNaissance?: string;
}

/**
 * Interface pour la création d'une nouvelle personne
 * 
 * Cette interface est utilisée lors de la saisie/création d'une nouvelle personne.
 * Elle exclut l'ID qui sera généré automatiquement par le système.
 * Seuls le nom et prénom sont obligatoires pour créer une personne.
 */
export interface PersonneInput {
  /** 
   * Nom de famille de la personne
   * Champ obligatoire pour la création
   */
  nom: string;

  /** 
   * Prénom de la personne
   * Champ obligatoire pour la création
   */
  prenom: string;

  /** 
   * Date de naissance de la personne
   * Format attendu : chaîne de caractères (ex: "1990-01-15")
   * Champ optionnel lors de la création
   */
  dateNaissance?: string;

  /** 
   * Adresse complète de résidence
   * Champ optionnel lors de la création
   */
  adresse?: string;

  /** 
   * Numéro de téléphone
   * Champ optionnel lors de la création
   */
  telephone?: string;
}

