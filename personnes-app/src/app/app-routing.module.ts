import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListePersonnesComponent } from './pages/personnes/liste-personnes/liste-personnes.component';
import { AjouterPersonneComponent } from './pages/personnes/ajouter-personne/ajouter-personne.component';
import { DocumentationComponent } from './pages/personnes/documentation/documentation.component';

/**
 * CONFIGURATION DES ROUTES DE L'APPLICATION
 * 
 * Définit toutes les routes disponibles dans l'application et les composants
 * associés à chaque URL. L'ordre des routes est important car Angular
 * utilise le principe "first match wins" (première correspondance trouvée).
 */
const routes: Routes = [
  /**
   * ROUTE PAR DÉFAUT - Redirection automatique
   * 
   * Quand l'utilisateur accède à la racine du site ('/'), 
   * il est automatiquement redirigé vers '/personnes'
   * 
   * - path: '' → URL racine (ex: https://monsite.com/)
   * - redirectTo: '/personnes' → Destination de la redirection
   * - pathMatch: 'full' → La correspondance doit être exacte (pas de segment supplémentaire)
   */
  { path: '', redirectTo: '/personnes', pathMatch: 'full' },

  /**
   * ROUTE LISTE DES PERSONNES
   * 
   * Affiche la liste de toutes les personnes enregistrées
   * 
   * - URL: /personnes
   * - Composant: ListePersonnesComponent
   * - Fonctionnalité: Consultation, recherche, suppression des personnes
   */
  { path: 'personnes', component: ListePersonnesComponent },

  /**
   * ROUTE AJOUT D'UNE PERSONNE
   * 
   * Affiche le formulaire pour ajouter une nouvelle personne
   * 
   * - URL: /ajouter
   * - Composant: AjouterPersonneComponent
   * - Fonctionnalité: Création d'une nouvelle personne via formulaire
   */
  { path: 'ajouter', component: AjouterPersonneComponent },
  { path: 'documentation', component: DocumentationComponent },

  /**
   * ROUTE WILDCARD - Gestion des erreurs 404
   * 
   * Capture toutes les URLs qui ne correspondent à aucune route définie
   * et redirige vers la page des personnes (page d'accueil par défaut)
   * 
   * - path: '**' → Correspond à toute URL non reconnue
   * - redirectTo: '/personnes' → Redirection vers la page principale
   * 
   * ⚠️ IMPORTANT: Cette route doit TOUJOURS être la dernière du tableau
   */
  { path: '**', redirectTo: '/personnes' }
];

/**
 * AppRoutingModule - Module de configuration du routage
 * 
 * Ce module configure le système de navigation de l'application Angular.
 * Il définit quels composants afficher selon l'URL visitée par l'utilisateur.
 * 
 * @description Module responsable de la gestion des routes et de la navigation
 */
@NgModule({
  /**
   * IMPORTS - Configuration du routeur
   * 
   * RouterModule.forRoot(routes) configure le routeur principal de l'application
   * avec les routes définies ci-dessus. Cette méthode est utilisée uniquement
   * dans le module racine (AppModule).
   * 
   * Options possibles (2ème paramètre) :
   * - enableTracing: true → Active les logs de debug du routeur
   * - useHash: true → Utilise le mode hash (#) dans les URLs
   * - preloadingStrategy → Stratégie de pré-chargement des modules
   */
  imports: [RouterModule.forRoot(routes)],

  /**
   * EXPORTS - Mise à disposition du RouterModule
   * 
   * Exporte RouterModule pour que ses directives (routerLink, router-outlet)
   * et services (Router, ActivatedRoute) soient disponibles dans toute l'application.
   * 
   * Directives disponibles après export :
   * - <router-outlet> : Affiche le composant de la route active
   * - [routerLink] : Crée des liens de navigation
   * - routerLinkActive : Applique des styles aux liens actifs
   */
  exports: [RouterModule]
})
export class AppRoutingModule { 

  /**
   * NAVIGATION DANS L'APPLICATION
   * 
   * Exemples d'utilisation dans les templates :
   * 
   * 1. LIENS DE NAVIGATION :
   *    <a routerLink="/personnes">Voir les personnes</a>
   *    <a routerLink="/ajouter">Ajouter une personne</a>
   * 
   * 2. NAVIGATION PROGRAMMATIQUE (dans un composant) :
   *    constructor(private router: Router) {}
   *    
   *    naviguerVersListe() {
   *      this.router.navigate(['/personnes']);
   *    }
   * 
   * 3. AFFICHAGE DU COMPOSANT ACTIF :
   *    <router-outlet></router-outlet>
   * 
   * FLUX DE NAVIGATION TYPIQUE :
   * 
   * 1. Utilisateur arrive sur le site (/) → Redirection automatique vers /personnes
   * 2. Sur /personnes → Affichage de ListePersonnesComponent
   * 3. Clic sur "Ajouter" → Navigation vers /ajouter
   * 4. Sur /ajouter → Affichage de AjouterPersonneComponent
   * 5. Après ajout → Retour vers /personnes (navigation programmatique)
   * 6. URL incorrecte → Redirection vers /personnes (gestion d'erreur)
   * 
   * AMÉLIORATIONS POSSIBLES :
   * 
   * - Ajouter une route pour modifier une personne : '/modifier/:id'
   * - Ajouter une route pour voir le détail : '/personne/:id'
   * - Implémenter des guards pour protéger certaines routes
   * - Ajouter des résolveurs pour pré-charger les données
   */
}