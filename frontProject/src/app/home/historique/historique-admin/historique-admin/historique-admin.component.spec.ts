import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueAdminComponent } from './historique-admin.component';

describe('HistoriqueAdminComponent', () => {
  let component: HistoriqueAdminComponent;
  let fixture: ComponentFixture<HistoriqueAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoriqueAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoriqueAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
