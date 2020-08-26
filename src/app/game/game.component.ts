import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { PlayerService } from '../services/player.service';
import { GameService } from '../services/game.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ScoreDialogComponent } from '../score-dialog/score-dialog.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  step = 0;
  playersList;
  game;
  gameId: number;
  displayGameSettings = true;
  gameDataSource;
  showScores = false;
  columnsToDisplay = [];
  playerShortNames = [];
  totals = {};
  constructor(private playerService: PlayerService, private route: ActivatedRoute, public dialog: MatDialog,
    private gameService: GameService, private router: Router) {
    this.route.params.subscribe(params => {
      this.gameId = params['id'];
      this.game = this.gameService.getGameById(this.gameId);
      if(!this.game && !this.isValidGameId(Number(this.gameId))) {
        this.router.navigate(['/']);
      }
      if (!this.game) {
        this.initializeGame();
      } else {
        this.gameDataSource = new MatTableDataSource(this.game.score);
        this.startGame();
        this.calculateTotals();
      }
    });
  }

  isValidGameId(id) {
    return new Date(id) &&  new Date(id).getDay() === new Date().getDay();
  }

  ngOnInit(): void {
    this.getPlayers();
  }

  initializeGame() {
    this.game = {
      id: this.gameId,
      players: [],
      rules: {
        dropPoints: 20,
        middleDropPoints: 40,
        fullPoints: 80,
        gamePoints: 200,
        pool: 10
      },
      score: [],
      totals: {}
    }
  }

  getPlayers() {
    this.playersList = this.playerService.getPlayersList();
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
    if (this.step > 1 && this.gameId && this.game.players.length >= 2
      && this.game.rules.dropPoints && this.game.rules.middleDropPoints
      && this.game.rules.fullPoints
      && this.game.rules.gamePoints && this.game.rules.pool) {
      this.displayGameSettings = false;
      this.startGame();
    }
  }

  prevStep() {
    this.step--;
  }

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.game.players, event.previousIndex, event.currentIndex);
  }

  startGame(): void {
    this.setDisplayColumns();
    this.displayGameSettings = false;
    this.showScores = true;
  }

  setDisplayColumns(): void {
    this.playerShortNames = this.game.players.map((player) => player.shortName);
    this.columnsToDisplay = ['round', ...this.playerShortNames, 'action'];
  }

  openScoreDialog(round?): void {
    let playerswithCountLessthanGamePoints = 0;
    for (const key in this.totals) {
      if (this.totals[key] < this.game.rules.gamePoints) {
        playerswithCountLessthanGamePoints++;
      }
    }
    if (!Object.keys(this.totals).length || playerswithCountLessthanGamePoints > 1) {
      const dialogRef = this.dialog.open(ScoreDialogComponent, {
        data: {
          rules: this.game.rules,
          score: this.getScoreObj(round),
          players: this.playerShortNames
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed', result);
        if (result) {
          const scoreObj = this.game.score.find((score) => score.round === result.score.round);
          if (scoreObj) {
            this.game.score[+(scoreObj.round) - 1] = result.score;
          } else {
            this.game.score.push(result.score);
          }
          this.calculateTotals();
          this.gameDataSource = new MatTableDataSource(this.game.score);
          this.gameService.saveGame(this.game);
        }
      });
    }
  }

  getScoreObj(round?) {
    let scoreObj;
    if (round) {
      scoreObj = this.game.score.find((score) => score.round === round);
    } else {
      scoreObj = {
        round: this.game.score ? this.game.score.length + 1 : 1
      }
      this.playerShortNames.forEach(player => {
        scoreObj[player] = ''
      });
    }
    return scoreObj;
  }

  editRound(score) {
    this.openScoreDialog(score.round);
  }

  calculateTotals() {
    const scores = this.game.score;
    let totals = {};
    this.playerShortNames.forEach(player => {
      totals[player] = 0;
      scores.forEach(score => {
        if (totals[player] < this.game.rules.gamePoints) {
          totals[player] = Number(totals[player]) + Number(score[player]);
        }
      });
    });
    this.totals = totals;
    this.game.totals = totals;
  }

  deleteGame() {
    this.gameService.deleteGame(this.game);
    this.gameService.sendGAEvent('delete game', new Date());
    this.router.navigate(['/']);
  }

}
