import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambioModalComponent } from './cambio-modal.component';

describe('CambioModalComponent', () => {
  let component: CambioModalComponent;
  let fixture: ComponentFixture<CambioModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CambioModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CambioModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
