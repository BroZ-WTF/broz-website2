import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { NGXLogger } from 'ngx-logger';
import { CookieService } from 'ngx-cookie-service';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { LoginDialogComponent } from './login-dialog/login-dialog.component';

import { environment } from 'src/environments/environment'

export var noLogin = true;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'broz-website2';
  snackbarDuration = 3 * 1000; // ms
  baseUrl = environment.baseUrl;

  new_quotes_cnt: number;

  constructor(private _logger: NGXLogger, private _snackBar: MatSnackBar, private _http: HttpClient, private _cookieService: CookieService, public dialog: MatDialog) { }

  ngOnInit(): void {
    if (this._cookieService.check('login-token')) {
      this.checkTokenStillValidAPI();
      noLogin = true;
    }
    /*
    if (this._cookieService.check('most-current-viewd-quote')) {
      this.new_quotes_cnt = this.dataSourceQuotes.data.length - parseInt(this._cookieService.get('most-current-viewd-quote'));
    } else {
      this._cookieService.set('most-current-viewd-quote', '0');
      this.new_quotes_cnt = this.dataSourceQuotes.data.length;
    }
    */
  }

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
    this._cookieService.delete('login-token');
    this._snackBar.open('Erfolgreich ausgeloggt', 'OK', { duration: this.snackbarDuration });
  }

  loginAPI(user) {
    this._logger.debug('app.component.component: user:', user);
    const headers = new HttpHeaders({ 'Authorization': `Basic ${btoa(user.login_name + ':' + user.password)}` });
    var loginResponse;
    this._http.get(this.baseUrl + '/auth/token', { headers }).subscribe(
      (val) => {
        loginResponse = val;
        this._logger.debug('app.component: GET auth token request: val:', loginResponse);
        if (loginResponse.token) {
          noLogin = false;
          this._cookieService.set('login-token', loginResponse.token, 1);
          this._logger.debug('app.component: auth token cookie:', this._cookieService.get('login-token'));
          this._snackBar.open('Erfolgreich eingeloggt', 'OK', { duration: this.snackbarDuration });
        } else {
          noLogin = true;
          this._cookieService.delete('login-token');
          this._snackBar.open('Passwort fehlerhaft', 'OK', { duration: this.snackbarDuration });
          this.loginDialog();
        }
      },
      response => {
        noLogin = true;
        this._cookieService.delete('login-token');
        this._logger.debug('app.component: GET auth request error: response:', response);
        this._snackBar.open('Passwort fehlerhaft', 'OK', { duration: this.snackbarDuration });
        this.loginDialog();
      },
      () => {
        this._logger.debug('app.component: GET observable completed.');
      }
    );
  }

  checkTokenStillValidAPI() {
    const headers = new HttpHeaders({ 'Authorization': `Basic ${btoa(this._cookieService.get('login-token') + ':')}` });
    var checkResponse;
    this._logger.debug('app.component: Try old token with header:', headers);
    this._http.get(this.baseUrl + '/auth/check', { headers }).subscribe(
      (val) => {
        checkResponse = val;
        this._logger.debug('app.component: GET auth token request: val:', checkResponse);
        if (checkResponse.check === 'success') {
          this._logger.debug('app.component: auth token check successful:');
          noLogin = false;
        } else {
          this._logger.debug('app.component: auth token check failed:');
          this._cookieService.delete('login-token');
          noLogin = true;
        }
      },
      response => {
        this._logger.debug('app.component: auth token check failed:', response);
        this._cookieService.delete('login-token');
        noLogin = true;
      },
      () => {
        this._logger.debug('app.component: GET observable completed.');
      }
    );
  }
}
