import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { NGXLogger } from 'ngx-logger';

import { MatSnackBar } from '@angular/material/snack-bar';

import { environment } from 'src/environments/environment'

export var noLogin = true;

export interface LoginSuccess {
  accepted: boolean,
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'broz-website2';
  snackbarDuration = 3 * 1000; // ms
  password = new FormControl('');
  baseUrl = environment.baseUrl;
  loginResponse: any;

  constructor(private _logger: NGXLogger, private _snackBar: MatSnackBar, private _http: HttpClient) { }

  ngOnInit(): void { }

  getLoginState() {
    return noLogin;
  }

  login() {
    this._logger.debug('app.component: password:', this.password.value);
    const headers = new HttpHeaders({ 'Authorization': `Basic ${btoa('test:' + this.password.value)}` });
    this._http.get(this.baseUrl + '/auth', { headers }).subscribe(
      (val) => {
        this.loginResponse = val;
        this._logger.debug('app.component: GET auth request: val:', val);
        if (this.loginResponse.accepted) {
          noLogin = false;
          this._snackBar.open('Erfolgreich eingeloggt', 'OK', { duration: this.snackbarDuration });
        } else {
          this._snackBar.open('Passwort fehlerhaft', 'OK', { duration: this.snackbarDuration });
        }
      },
      response => {
        this._logger.error('app.component: GET auth request error: response:', response);
      },
      () => {
        this._logger.debug('app.component: GET observable completed.');
      }
    );
  }

  logout() {
    this.password.setValue('');
    noLogin = true;
    this._snackBar.open('Erfolgreich ausgeloggt', 'OK', { duration: this.snackbarDuration });
  }
}
