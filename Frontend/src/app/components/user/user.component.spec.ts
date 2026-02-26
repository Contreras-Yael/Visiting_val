import { TestBed } from '@angular/core/testing';

import { UserComponent } from './user.component';

describe('UserComponent', () => {
  let component: UserComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    component = TestBed.inject(UserComponent);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
