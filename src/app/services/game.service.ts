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
        games[gameIndex]  = currentGame;
        localStorage.setItem('rummy-games', JSON.stringify(games));
      } else {
        games.push(currentGame);
        localStorage.setItem('rummy-games', JSON.stringify(games));
      }
    } else {
      localStorage.setItem('rummy-games', JSON.stringify([currentGame]));
    }
  }
}
