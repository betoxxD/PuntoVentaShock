import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresarCantidadModalComponent } from './ingresar-cantidad-modal.component';

describe('IngresarCantidadModalComponent', () => {
  let component: IngresarCantidadModalComponent;
  let fixture: ComponentFixture<IngresarCantidadModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IngresarCantidadModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IngresarCantidadModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
