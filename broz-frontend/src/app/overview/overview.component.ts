import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { NGXLogger } from 'ngx-logger';

export interface MCServerStatus {
  online?: boolean;
  description?: string;
  players?: {
    max?: number;
    online?: number;
    names: string;
  };
  version?: number;
}

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  fullMCServerStatus: MCServerStatus = { online: false, players: { max: 0, online: 0, names: "" } };
  mcapiAnswer: any;

  constructor(private _logger: NGXLogger, private http: HttpClient) { }

  ngOnInit(): void {
    this._logger.debug('overview.component: query MCServerStatus.');
    this.getMCServerStatus();
  }

  getMCServerStatus() {
    return this.http.get('https://api.mcsrvstat.us/2/mc.the-wagner.de').subscribe(
      (val) => {
        this._logger.log('overview.component: GET request: MCServerStatus val:', val);
        this.mcapiAnswer = val;
        // Parse data from API call into own datastructure
        this.fullMCServerStatus.online = this.mcapiAnswer.online;
        this.fullMCServerStatus.description = this.mcapiAnswer.motd.html;
        this.fullMCServerStatus.version = this.mcapiAnswer.version;
        // Create placeholder if player-list is empty
        this.fullMCServerStatus.players = { max: this.mcapiAnswer.players.max, online: this.mcapiAnswer.players.online, names: "niemand hier :(" };
        if ('list' in this.mcapiAnswer.players) {
          this.fullMCServerStatus.players.names = this.mcapiAnswer.players.list.join(', ');
        }
      },
      response => {
        this._logger.error('overview.component: GET request error: response:', response);
      },
      () => {
        this._logger.debug('overview.component: GET observable completed.');
      }
    );
  }
}
