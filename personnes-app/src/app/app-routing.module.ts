import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListePersonnesComponent } from './pages/personnes/liste-personnes/liste-personnes.component';
import { AjouterPersonneComponent } from './pages/personnes/ajouter-personne/ajouter-personne.component';

const routes: Routes = [
  { path: '', redirectTo: '/personnes', pathMatch: 'full' },
  { path: 'personnes', component: ListePersonnesComponent },
  { path: 'ajouter', component: AjouterPersonneComponent },
  { path: '**', redirectTo: '/personnes' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }