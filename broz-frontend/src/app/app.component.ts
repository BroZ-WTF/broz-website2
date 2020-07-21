import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import appRoutes from './routerConfig';

import { NGXLogger } from 'ngx-logger';
import { CookieService } from 'ngx-cookie-service';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { LoginDialogComponent } from './login-dialog/login-dialog.component';

import { environment } from 'src/environments/environment';
import { ServiceLoginState } from './app.service.login-state';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'broz-website2';
  snackbarDuration = 3 * 1000; // ms
  baseUrl = environment.baseUrl;

  login_state: number = 0;

  new_entries_for_badges = {
    'gallery': { 'seen': 0, 'current': 0 },
    'quotes': { 'seen': 0, 'current': 0 }
  };

  navEntries = appRoutes.filter(route => route.redirectTo == null);

  constructor(private _logger: NGXLogger, private _snackBar: MatSnackBar, private _http: HttpClient, private _cookieService: CookieService, private _router: Router, private _loginState: ServiceLoginState, public dialog: MatDialog) { }

  ngOnInit(): void {
    if (this._cookieService.check('login-token')) {
      this.checkTokenStillValidAPI();
    }

    if (this._cookieService.check('most-current-viewed-quote')) {
      this.new_entries_for_badges.quotes.seen = parseInt(this._cookieService.get('most-current-viewed-quote'));
    } else {
      this._cookieService.set('most-current-viewed-quote', '0', 365);
      this.new_entries_for_badges.quotes.seen = 0;
    }

    if (this._cookieService.check('most-current-viewed-picture')) {
      this.new_entries_for_badges.gallery.seen = parseInt(this._cookieService.get('most-current-viewed-picture'));
    } else {
      this._cookieService.set('most-current-viewed-picture', '0', 365);
      this.new_entries_for_badges.gallery.seen = 0;
    }

    this.getGalleryMetadataCountsAPI();
    this.getAllQuotesCountsAPI();

    this._loginState.loginState.subscribe(login_state => this.login_state = login_state);
  }

  getBadgeCnt(tab) {
    if (this.new_entries_for_badges[this._router.url.slice(1)]?.current) {
      this.new_entries_for_badges[this._router.url.slice(1)].seen = this.new_entries_for_badges[this._router.url.slice(1)].current;
      if (this._router.url.slice(1) === 'quotes') {
        this._cookieService.set('most-current-viewed-quote', this.new_entries_for_badges.quotes.seen.toString(), 365);
      } else if (this._router.url.slice(1) === 'gallery') {
        this._cookieService.set('most-current-viewed-picture', this.new_entries_for_badges.gallery.seen.toString(), 365);
      }
    }
    return this.new_entries_for_badges[tab.path]?.current - this.new_entries_for_badges[tab.path]?.seen;
  }

  getBadgeHidden(tab) {
    return !(this.getBadgeCnt(tab) > 0);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: this.snackbarDuration });
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
    this._loginState.setLoginState(0);
    this._cookieService.delete('login-token');
    this._snackBar.open('Erfolgreich ausgeloggt', 'OK', { duration: this.snackbarDuration });
    window.location.reload();
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
          this._loginState.setLoginState(loginResponse.rights);
          this._cookieService.set('login-token', loginResponse.token, 1);
          this._logger.debug('app.component: auth token cookie:', this._cookieService.get('login-token'));
          this._snackBar.open('Erfolgreich eingeloggt', 'OK', { duration: this.snackbarDuration });
          window.location.reload();
        } else {
          this._loginState.setLoginState(0);
          this._cookieService.delete('login-token');
          this._snackBar.open('Passwort fehlerhaft', 'OK', { duration: this.snackbarDuration });
          this.loginDialog();
        }
      },
      response => {
        this._loginState.setLoginState(0);
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
          this._loginState.setLoginState(checkResponse.rights);
        } else {
          this._logger.debug('app.component: auth token check failed:');
          this._cookieService.delete('login-token');
          this._loginState.setLoginState(0);
        }
      },
      response => {
        this._logger.debug('app.component: auth token check failed:', response);
        this._cookieService.delete('login-token');
        this._loginState.setLoginState(0);
      },
      () => {
        this._logger.debug('app.component: GET observable completed.');
      }
    );
  }

  getGalleryMetadataCountsAPI() {
    var response;
    this._http.get(this.baseUrl + '/gallery/metadata/count').subscribe(
      (val) => {
        this._logger.log('app.component: GET request: all gallery metadata cnt:', val);
        response = val;
        this.new_entries_for_badges.gallery.current = response.count;
      },
      response => {
        this._logger.error('app.component: GET request error: response:', response);
      },
      () => {
        this._logger.debug('app.component: GET observable completed.');
      }
    );
  }

  getAllQuotesCountsAPI() {
    var response;
    this._http.get(this.baseUrl + '/quotes/count').subscribe(
      (val) => {
        this._logger.log('app.component: GET request: all quotes cnt:', val);
        response = val;
        this.new_entries_for_badges.quotes.current = response.count;
      },
      response => {
        this._logger.error('app.component: GET request error: response:', response);
      },
      () => {
        this._logger.debug('app.component: GET observable completed.');
      }
    );
  }
}
