import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Components - Composants de l'application
import { ListePersonnesComponent } from './pages/personnes/liste-personnes/liste-personnes.component';
import { AjouterPersonneComponent } from './pages/personnes/ajouter-personne/ajouter-personne.component';

// GraphQL - Configuration pour les requêtes GraphQL
import { GraphQLModule } from './graphql/graphql.module';
import { DocumentationComponent } from './pages/personnes/documentation/documentation.component';
// import { ApolloModule } from 'apollo-angular'; // Module Apollo commenté (non utilisé actuellement)

/**
 * AppModule - Module racine de l'application Angular
 * 
 * Ce module configure et initialise l'application Angular en définissant :
 * - Les composants à déclarer
 * - Les modules à importer
 * - Les services à fournir
 * - Le composant de démarrage (bootstrap)
 * 
 * @description Module principal qui orchestre tous les autres modules et composants
 */
@NgModule({
  /**
   * DECLARATIONS - Composants, directives et pipes de ce module
   * 
   * Liste tous les composants qui appartiennent à ce module.
   * Ces composants peuvent être utilisés dans les templates de ce module.
   */
  declarations: [
    AppComponent,              // Composant racine de l'application
    ListePersonnesComponent,   // Composant pour afficher la liste des personnes
    AjouterPersonneComponent, DocumentationComponent   // Composant pour ajouter une nouvelle personne
  ],

  /**
   * IMPORTS - Modules externes nécessaires
   * 
   * Liste des modules Angular à importer pour utiliser leurs fonctionnalités.
   * Chaque module apporte des services, directives ou composants spécifiques.
   */
  imports: [
    BrowserModule,        // Module essentiel pour exécuter Angular dans un navigateur
    AppRoutingModule,     // Module de routage personnalisé de l'application
    ReactiveFormsModule,  // Module pour les formulaires réactifs (FormGroup, FormControl, etc.)
    HttpClientModule,     // Module pour effectuer des requêtes HTTP (GET, POST, PUT, DELETE)
    FormsModule,         // Module pour les formulaires template-driven (ngModel, etc.)
    GraphQLModule        // Module personnalisé pour la configuration GraphQL
  ],

  /**
   * PROVIDERS - Services disponibles dans toute l'application
   * 
   * Liste des services à injecter au niveau de l'application.
   * Ces services sont des singletons disponibles partout dans l'app.
   * Actuellement vide car les services sont probablement fournis ailleurs.
   */
  providers: [],

  /**
   * BOOTSTRAP - Composant de démarrage
   * 
   * Définit le composant racine qui sera instancié au démarrage de l'application.
   * Ce composant est généralement celui qui contient le <router-outlet> principal.
   */
  bootstrap: [AppComponent]
})
export class AppModule { 

  /**
   * ARCHITECTURE DE L'APPLICATION
   * 
   * Cette application semble être structurée pour gérer des personnes avec :
   * 
   * 1. FONCTIONNALITÉS PRINCIPALES :
   *    - Affichage d'une liste de personnes (ListePersonnesComponent)
   *    - Ajout de nouvelles personnes (AjouterPersonneComponent)
   * 
   * 2. TECHNOLOGIES UTILISÉES :
   *    - Angular Reactive Forms : pour la gestion avancée des formulaires
   *    - Template-driven Forms : pour des formulaires plus simples
   *    - HTTP Client : pour communiquer avec des APIs REST
   *    - GraphQL : pour des requêtes de données optimisées
   *    - Routing : pour la navigation entre les pages
   * 
   * 3. STRUCTURE RECOMMANDÉE :
   *    src/
   *    ├── app/
   *    │   ├── pages/personnes/          # Pages liées aux personnes
   *    │   │   ├── liste-personnes/      # Composant liste
   *    │   │   └── ajouter-personne/     # Composant ajout
   *    │   ├── graphql/                  # Configuration GraphQL
   *    │   ├── services/                 # Services métier
   *    │   └── models/                   # Interfaces TypeScript
   */
}