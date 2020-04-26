import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable()
export class ServiceLoginState {

  private login_state = new BehaviorSubject(0);
  loginState = this.login_state.asObservable();

  constructor() { }

  setLoginState(state: number) {
    this.login_state.next(state);
  }

}
