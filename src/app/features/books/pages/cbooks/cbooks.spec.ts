import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cbooks } from './cbooks';

describe('Cbooks', () => {
  let component: Cbooks;
  let fixture: ComponentFixture<Cbooks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cbooks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cbooks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
