import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Components
import { ListePersonnesComponent } from './pages/personnes/liste-personnes/liste-personnes.component';
import { AjouterPersonneComponent } from './pages/personnes/ajouter-personne/ajouter-personne.component';

// GraphQL
import { GraphQLModule } from './graphql/graphql.module';
// import { ApolloModule } from 'apollo-angular';

@NgModule({
  declarations: [
    AppComponent,
    ListePersonnesComponent,
    AjouterPersonneComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    // ApolloModule,
    GraphQLModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }