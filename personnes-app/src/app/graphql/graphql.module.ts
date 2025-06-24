// graphql.module.ts
import { NgModule } from '@angular/core';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core';
import { inject } from '@angular/core';

/**
 * Configuration et création du client Apollo GraphQL
 * 
 * Cette fonction configure le client Apollo qui sera utilisé dans toute l'application
 * pour communiquer avec le serveur GraphQL.
 * 
 * @returns {ApolloClientOptions<any>} Configuration complète du client Apollo
 */
export function createApollo(): ApolloClientOptions<any> {
  // URL du serveur GraphQL - à adapter selon l'environnement
  const uri = 'http://localhost:8080/graphql';
  
  // Injection du service HttpLink pour les requêtes HTTP
  const httpLink = inject(HttpLink);

  return {
    /**
     * Configuration du transport réseau
     * Utilise HttpLink pour envoyer les requêtes GraphQL via HTTP POST
     */
    link: httpLink.create({ uri }),
    
    /**
     * Configuration du cache
     * InMemoryCache stocke les résultats des requêtes en mémoire pour :
     * - Éviter les requêtes redondantes
     * - Améliorer les performances
     * - Synchroniser automatiquement l'état de l'application
     */
    cache: new InMemoryCache(),
  };
}

/**
 * Module Angular pour l'intégration GraphQL
 * 
 * Ce module configure Apollo Client dans l'application Angular.
 * Il doit être importé dans le module principal (AppModule) ou dans
 * les modules qui utilisent GraphQL.
 * 
 * UTILISATION :
 * 1. Importer ce module dans AppModule :
 *    imports: [GraphQLModule, ...]
 * 
 * 2. Ensuite, utiliser Apollo dans les services/composants :
 *    constructor(private apollo: Apollo) {}
 * 
 * FONCTIONNALITÉS FOURNIES :
 * - Client Apollo configuré et prêt à l'emploi
 * - Cache en mémoire pour optimiser les performances
 * - Transport HTTP vers le serveur GraphQL
 */
@NgModule({
  providers: [
    /**
     * Fournit le client Apollo à l'ensemble de l'application
     * Utilise la fonction createApollo() pour la configuration
     */
    provideApollo(createApollo)
  ],
})
export class GraphQLModule {}
