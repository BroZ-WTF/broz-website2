import { Component, OnInit } from '@angular/core';

import { NGXLogger } from 'ngx-logger';

import { FormControl, Validators } from '@angular/forms';

export var noLogin = true;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'broz-website2';
  password = new FormControl('');

  constructor(private _logger: NGXLogger) { }

  ngOnInit(): void { }

  getLoginState() {
    return noLogin;
  }

  login() {
    this._logger.debug('app.component: password:', this.password.value);
    if (this.password.value === 'test') {
      noLogin = false;
    }
  }

  logout() {
    this.password.setValue('');
    noLogin = true;
  }
}
