import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { NGXLogger } from 'ngx-logger';

import { MatSnackBar } from '@angular/material/snack-bar';

export var noLogin = true;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'broz-website2';
  snackbarDuration = 3 * 1000; // ms
  password = new FormControl('');

  constructor(private _logger: NGXLogger, private _snackBar: MatSnackBar) { }

  ngOnInit(): void { }

  getLoginState() {
    return noLogin;
  }

  login() {
    this._logger.debug('app.component: password:', this.password.value);
    if (this.password.value === 'maddin') {
      noLogin = false;
      this._snackBar.open('Erfolgreich eingeloggt', 'OK', { duration: this.snackbarDuration });
    } else {
      this._snackBar.open('Passwort fehlerhaft', 'OK', { duration: this.snackbarDuration });
    }
  }

  logout() {
    this.password.setValue('');
    noLogin = true;
    this._snackBar.open('Erfolgreich ausgeloggt', 'OK', { duration: this.snackbarDuration });
  }
}
