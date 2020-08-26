import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../services/game.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  games;
  constructor(private router: Router, private gameService: GameService) { }

  ngOnInit(): void {
    this.games = this.gameService.getSortedGames();
    this.games.map(game => {
      const players = [];
      game.players.forEach(player => {
        players.push(`${player.name} (${game.totals[player.shortName]})`)
      });
      game.playersWithTotals = players.join(',  ');
    });
    console.log('games', this.games);
  }

  onAddNewGame() {
    const date = new Date().getTime();
    this.gameService.sendGAEvent('new game', new Date());
    this.router.navigate(['/game', date]);
  }

  onClickGame(game) {
    this.router.navigate(['/game', game.id])
  }

}
