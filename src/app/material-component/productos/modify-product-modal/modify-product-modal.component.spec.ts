import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyProductModalComponent } from './modify-product-modal.component';

describe('ModifyProductModalComponent', () => {
  let component: ModifyProductModalComponent;
  let fixture: ComponentFixture<ModifyProductModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyProductModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyProductModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
