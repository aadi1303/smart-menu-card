import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareWhatsappComponent } from './share-whatsapp.component';

describe('ShareWhatsappComponent', () => {
  let component: ShareWhatsappComponent;
  let fixture: ComponentFixture<ShareWhatsappComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShareWhatsappComponent]
    });
    fixture = TestBed.createComponent(ShareWhatsappComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
