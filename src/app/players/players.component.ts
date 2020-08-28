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
  currentPlayer;
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
    this.displayedColumns = ['name', 'shortName', 'action'];
  }

  addPlayer(add) {
    if (add && this.validatePlayer(this.name.value, this.shortName.value)) {
      this.createPlayer();
      this.resetForm();
    } else {
      const playerIndex = this.playerService.getPlayerIndexById(this.currentPlayer.id);
      if (playerIndex !== -1) {
        this.playersList[playerIndex] = {
          name: this.name.value,
          shortName: this.shortName.value,
          id: this.currentPlayer.id
        };
        this.playerService.setPlayersList(this.playersList);
        this.playersList = this.playerService.getPlayersList();
        this.playersDataSource = new MatTableDataSource(this.playersList);
        this.resetForm();
      }
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
    this.currentPlayer = this.playerService.getPlayerById(player.id);
    this.name.setValue(player.name);
    this.shortName.setValue(player.shortName);
    this.isUpdate = true;
  }

  createPlayer() {
    this.playersList.push({
      name: this.name.value,
      shortName: this.shortName.value,
      id: this.playerService.getId()
    });
    this.playerService.setPlayersList(this.playersList);
    this.playersDataSource = new MatTableDataSource(this.playersList);
  }

  deletePlayer(player) {
    const playerList = this.playerService.getPlayersList();
    const playerIndex = this.playerService.getPlayerIndexById(player.id);
    playerList.splice(playerIndex, 1);
    this.playerService.setPlayersList(playerList);
    this.playersList = this.playerService.getPlayersList();
    this.playersDataSource = new MatTableDataSource(this.playersList);
    this.resetForm();
  }

  resetForm() {
    this.name.setValue('');
    this.shortName.setValue('');
    this.isUpdate = false;
    this.showAddForm = false;
  }
}
