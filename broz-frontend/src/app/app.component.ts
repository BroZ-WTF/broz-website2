import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { NGXLogger } from 'ngx-logger';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { LoginDialogComponent } from './login-dialog/login-dialog.component';

import { environment } from 'src/environments/environment'

export var noLogin = true;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'broz-website2';
  snackbarDuration = 3 * 1000; // ms
  baseUrl = environment.baseUrl;
  loginResponse: any;

  constructor(private _logger: NGXLogger, private _snackBar: MatSnackBar, private _http: HttpClient, public dialog: MatDialog) { }

  ngOnInit(): void { }

  getLoginState() {
    return noLogin;
  }

  loginDialog() {
    const loginDialogRef = this.dialog.open(LoginDialogComponent, {
      width: '300px',
    });
    loginDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loginAPI(result);
      }
    });
  }

  logout() {
    noLogin = true;
    this._snackBar.open('Erfolgreich ausgeloggt', 'OK', { duration: this.snackbarDuration });
  }

  loginAPI(user) {
    this._logger.debug('app.component.component: user:', user);
    const headers = new HttpHeaders({ 'Authorization': `Basic ${btoa(user.name + ':' + user.password)}` });
    this._http.get(this.baseUrl + '/auth/token', { headers }).subscribe(
      (val) => {
        this.loginResponse = val;
        this._logger.debug('app.component: GET auth token request: val:', this.loginResponse);
        if (this.loginResponse.token) {
          noLogin = false;
          this._snackBar.open('Erfolgreich eingeloggt', 'OK', { duration: this.snackbarDuration });
        } else {
          this._snackBar.open('Passwort fehlerhaft', 'OK', { duration: this.snackbarDuration });
        }
      },
      response => {
        this._logger.debug('app.component: GET auth request error: response:', response);
        this._snackBar.open('Passwort fehlerhaft', 'OK', { duration: this.snackbarDuration });
      },
      () => {
        this._logger.debug('app.component: GET observable completed.');
      }
    );
  }
}
