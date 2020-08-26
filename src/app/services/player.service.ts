import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  playersList = [
    {
      name: 'VenkatSandeep Bandlamudi',
      shortName: 'VS',
    },
    {
      name: 'Sneha Bandlamudi',
      shortName: 'SB'
    },
    {
      name: 'Venkat Teja Potini',
      shortName: 'PVT'
    },
    {
      name: 'Butchinayudamma Potini',
      shortName: 'PBN'
    },
    {
      name: 'Sailaja Potini',
      shortName: 'PS'
    },
    {
      name: 'VenkatKrishna Yarlagadda',
      shortName: 'YVK'
    }
  ];
  constructor() { }

  getPlayersList() {
    let playersList = this.playersList;
    if (localStorage.getItem('players')) {
      playersList = JSON.parse(localStorage.getItem('players'));
    }
    return playersList;
  }

  setPlayersList(playersList) {
    if (playersList && playersList.length) {
      localStorage.setItem('players', JSON.stringify(playersList));
      this.playersList = playersList;
    }
  }


}
