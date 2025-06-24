import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListePersonnesComponent } from './liste-personnes.component';

describe('ListePersonnesComponent', () => {
  let component: ListePersonnesComponent;
  let fixture: ComponentFixture<ListePersonnesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListePersonnesComponent]
    });
    fixture = TestBed.createComponent(ListePersonnesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
