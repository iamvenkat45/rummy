import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-score-dialog',
  templateUrl: './score-dialog.component.html',
  styleUrls: ['./score-dialog.component.scss']
})
export class ScoreDialogComponent implements OnInit {

  showScoreError;
  private originalTotals;
  constructor(public dialogRef: MatDialogRef<ScoreDialogComponent>, @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit(): void {
    if (this.data.isRejoin) {
      this.originalTotals = Object.assign({}, this.data.totals);
      const scoreObj = {
        round: this.data.score.round
      };
      this.data.players.forEach(player => {
        scoreObj[player] = this.data.totals[player]
      });
      this.data.score = scoreObj;
    }
  }

  onNoClick() {
    this.dialogRef.close();
  }

  onAddScore() {
    if (this.data.isRejoin) {
      let rejoinError;
      Object.keys(this.data.score).forEach(player => {
        if (Number(this.data.score[player]) > this.data.rules.gamePoints) {
          rejoinError = true; this.showError();
        }
      });
      const newTotals = JSON.parse(JSON.stringify(this.data.score));
      this.data.players.forEach(player => {
        this.data.score[player] = Number(newTotals[player])  - Number(this.originalTotals[player]);
      });
      if (rejoinError) {
        this.showError();
      } else {
        this.dialogRef.close(this.data);
      }
    } else {
      let hasScoreLessThanFull;
      let playersWithCountZero =  0;
      Object.keys(this.data.score).forEach(player => {
        if (Number(this.data.score[player]) === 0) {
          playersWithCountZero ++;
        }
        if (Number(this.data.score[player]) < this.data.rules.fullPoints) {
          hasScoreLessThanFull = true
        }
      });
      if (hasScoreLessThanFull && playersWithCountZero === 1) {
        this.dialogRef.close(this.data);
      } else {
        this.showError();
      }
    }

  }

  showError() {
    this.showScoreError = true;
    setTimeout(() => {
      this.showScoreError = false;
    }, 2000);
  }

}
