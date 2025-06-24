import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterPersonneComponent } from './ajouter-personne.component';

describe('AjouterPersonneComponent', () => {
  let component: AjouterPersonneComponent;
  let fixture: ComponentFixture<AjouterPersonneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AjouterPersonneComponent]
    });
    fixture = TestBed.createComponent(AjouterPersonneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
