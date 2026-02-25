import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Corders } from './corders';

describe('Corders', () => {
  let component: Corders;
  let fixture: ComponentFixture<Corders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Corders]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Corders);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
