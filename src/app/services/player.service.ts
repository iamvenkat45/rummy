import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  playersList = [
    {
      name: 'VenkatSandeep Bandlamudi',
      shortName: 'VS',
      id: this.getId()
    },
    {
      name: 'Sneha Bandlamudi',
      shortName: 'SB',
      id: this.getId()
    },
    {
      name: 'Venkat Teja Potini',
      shortName: 'PVT',
      id: this.getId()
    },
    {
      name: 'Butchinayudamma Potini',
      shortName: 'PBN',
      id: this.getId()
    },
    {
      name: 'Sailaja Potini',
      shortName: 'PS',
      id: this.getId()
    },
    {
      name: 'VenkatKrishna Yarlagadda',
      shortName: 'YVK',
      id: this.getId()
    }
  ];
  constructor() { }

  getPlayersList() {
    let playersList = this.playersList;
    if (localStorage.getItem('rummy-players')) {
      playersList = JSON.parse(localStorage.getItem('rummy-players'));
    }
    return playersList;
  }

  setPlayersList(playersList) {
    if (playersList && playersList.length) {
      localStorage.setItem('rummy-players', JSON.stringify(playersList));
      this.playersList = playersList;
    }
  }

  getPlayerById(id) {
    const players: any = this.getPlayersList();
    return players.find(game => game.id === id);
  }

  getPlayerIndexById(id) {
    const players: any = this.getPlayersList();
    return players.findIndex(player => player.id === id);
  }

  getId() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }


}
