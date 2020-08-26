import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor() { }

  getGames() {
    const games = localStorage.getItem('rummy-games');
    return games ? JSON.parse(games) : [];
  }

  getSortedGames() {
    let games = this.getGames();
    games = games.slice(0);
    games.sort((a, b) => {
      return b.id - a.id;
    });
    return games;
  }

  getGameById(id) {
    const games: any = this.getGames();
    return games.find(game => game.id === id);
  }

  getGameIndexById(id) {
    const games: any = this.getGames();
    return games.findIndex(game => game.id === id);
  }

  saveGame(currentGame) {
    let games: any = this.getGames();
    if (games.length) {
      const gameIndex = this.getGameIndexById(currentGame.id);
      if (gameIndex !== -1) {
        games[gameIndex] = currentGame;
        localStorage.setItem('rummy-games', JSON.stringify(games));
      } else {
        games.push(currentGame);
        localStorage.setItem('rummy-games', JSON.stringify(games));
      }
    } else {
      localStorage.setItem('rummy-games', JSON.stringify([currentGame]));
    }
  }

  deleteGame(game) {
    let games: any = this.getGames();
    let newGames = [];
    games.forEach(element => {
      if (element.id !== game.id) {
        newGames.push(element);
      }
    });
    localStorage.setItem('rummy-games', JSON.stringify(newGames));
  }

  sendGAEvent(event, value) {
    (<any>window).ga('send', 'event', {
      eventCategory: event,
      eventLabel: event,
      eventAction: event,
      eventValue: value
    });
  }
}
