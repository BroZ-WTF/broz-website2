import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { NGXLogger } from 'ngx-logger';
import { CookieService } from 'ngx-cookie-service';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { LoginDialogComponent } from './login-dialog/login-dialog.component';

import { environment } from 'src/environments/environment'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'broz-website2';
  snackbarDuration = 3 * 1000; // ms
  baseUrl = environment.baseUrl;

  viewed_quotes_cnt: number;
  viewed_pictures_cnt: number;
  current_quotes_cnt: number;
  current_pictures_cnt: number;

  LoginState: boolean;

  constructor(private _logger: NGXLogger, private _snackBar: MatSnackBar, private _http: HttpClient, private _cookieService: CookieService, public dialog: MatDialog) { }

  ngOnInit(): void {
    if (this._cookieService.check('login-token')) {
      this.checkTokenStillValidAPI();
      this.LoginState = true;
    }

    if (this._cookieService.check('most-current-viewed-quote')) {
      this.viewed_quotes_cnt = parseInt(this._cookieService.get('most-current-viewed-quote'));
    } else {
      this._cookieService.set('most-current-viewed-quote', '0');
      this.viewed_quotes_cnt = 0;
    }

    if (this._cookieService.check('most-current-viewed-picture')) {
      this.viewed_pictures_cnt = parseInt(this._cookieService.get('most-current-viewed-picture'));
    } else {
      this._cookieService.set('most-current-viewed-picture', '0');
      this.viewed_pictures_cnt = 0;
    }
  }

  recieveCurrentQuotesCnt($event) {
    this.current_quotes_cnt = $event;
  }

  recieveCurrentPicturesCnt($event) {
    this.current_pictures_cnt = $event;
  }

  onTabChanged($event) {
    this._logger.debug('app.component: current active view:', $event.index);
    if ($event.index === 1) {
      this.setViewedQuotesCnt();
    } else if ($event.index === 2) {
      this.setViewedPicturesCnt();
    }
  }

  setViewedQuotesCnt() {
    this._logger.debug('app.component: viewed quotes:', this.current_quotes_cnt);
    this.viewed_quotes_cnt = this.current_quotes_cnt;
    this._cookieService.set('most-current-viewed-quote', this.current_quotes_cnt.toString());
  }

  setViewedPicturesCnt() {
    this._logger.debug('app.component: viewed pictures:', this.current_pictures_cnt);
    this.viewed_pictures_cnt = this.current_pictures_cnt;
    this._cookieService.set('most-current-viewed-picture', this.current_pictures_cnt.toString());
  }

  getLoginState() {
    return this.LoginState;
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
    this.LoginState = true;
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
          this.LoginState = false;
          this._cookieService.set('login-token', loginResponse.token, 1);
          this._logger.debug('app.component: auth token cookie:', this._cookieService.get('login-token'));
          this._snackBar.open('Erfolgreich eingeloggt', 'OK', { duration: this.snackbarDuration });
        } else {
          this.LoginState = true;
          this._cookieService.delete('login-token');
          this._snackBar.open('Passwort fehlerhaft', 'OK', { duration: this.snackbarDuration });
          this.loginDialog();
        }
      },
      response => {
        this.LoginState = true;
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
          this.LoginState = false;
        } else {
          this._logger.debug('app.component: auth token check failed:');
          this._cookieService.delete('login-token');
          this.LoginState = true;
        }
      },
      response => {
        this._logger.debug('app.component: auth token check failed:', response);
        this._cookieService.delete('login-token');
        this.LoginState = true;
      },
      () => {
        this._logger.debug('app.component: GET observable completed.');
      }
    );
  }
}
