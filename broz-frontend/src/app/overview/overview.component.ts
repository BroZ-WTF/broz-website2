import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { NGXLogger } from 'ngx-logger';

export interface MCServerStatus {
  status: string;
  online?: boolean;
  description?: string;
  players?: {
    max?: number;
    now?: number;
    names: string;
  };
  version?: number;
}

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  fullMCServerStatus: MCServerStatus = { status: "unknown", online: false, players: { max: 0, now: 0, names: "" } };
  mcapiAnswer: any;

  constructor(private logger: NGXLogger, private http: HttpClient) { }

  ngOnInit(): void {
    this.logger.debug('overview.component: query MCServerStatus.');
    this.getMCServerStatus();
  }

  getMCServerStatus() {
    return this.http.get('https://mcapi.us/server/query?ip=broz.wtf').subscribe(
      (val) => {
        this.logger.log('overview.component: GET request: MCServerStatus val:', val);
        this.mcapiAnswer = val;
        // Parse data from API call into own datastructure
        this.fullMCServerStatus.status = this.mcapiAnswer.status;
        this.fullMCServerStatus.online = this.mcapiAnswer.online;
        this.fullMCServerStatus.description = this.mcapiAnswer.motd;
        this.fullMCServerStatus.version = this.mcapiAnswer.version;
        // Create placeholder if player-list is empty
        this.fullMCServerStatus.players = { max: this.mcapiAnswer.players.max, now: this.mcapiAnswer.players.now, names: "niemand hier :(" };
        if (this.mcapiAnswer.players.list !== null) {
          this.fullMCServerStatus.players.names = this.mcapiAnswer.players.list.join(', ');
        }
      },
      response => {
        this.logger.error('overview.component: GET request error: response:', response);
      },
      () => {
        this.logger.debug('overview.component: GET observable completed.');
      }
    );
  }
}
