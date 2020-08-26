import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

import { PlayerService } from './../services/player.service';
@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss']
})
export class PlayersComponent implements OnInit {

  playersList;
  displayedColumns;
  showAddForm;
  playersDataSource;
  name = new FormControl('');
  shortName = new FormControl('');
  isUpdate = false;
  constructor(private playerService: PlayerService) { }

  ngOnInit(): void {
    this.setPlayers();
    this.createTable();
  }

  setPlayers() {
    this.playersList = this.playerService.getPlayersList();
    this.playersDataSource = new MatTableDataSource(this.playersList);
  }

  createTable() {
    this.displayedColumns = ['name', 'shortName'];
  }

  addPlayer() {
    if (this.validatePlayer(this.name.value, this.shortName.value)) {
      this.playersList.push({
        name: this.name.value,
        shortName: this.shortName.value
      });
      this.playerService.setPlayersList(this.playersList);
      this.playersDataSource = new MatTableDataSource(this.playersList);
    }
  }

  validatePlayer(name, shortName) {
    const player = this.playersList.find((player) => player.name.toLowerCase() === name.toLowerCase()
      || player.shortName.toLowerCase() === shortName.toLowerCase());
    return name &&
      shortName &&
      shortName.length < 4 && !(player && player.name);
  }

  editPlayer(player) {
    this.name.setValue(player.name);
    this.shortName.setValue(player.shortName);
    this.isUpdate = true;
  }

  deletePlayer(player) {

  }
}
