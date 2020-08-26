import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-score-dialog',
  templateUrl: './score-dialog.component.html',
  styleUrls: ['./score-dialog.component.scss']
})
export class ScoreDialogComponent implements OnInit {

  showScoreError;
  constructor(public dialogRef: MatDialogRef<ScoreDialogComponent>, @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit(): void {
  }

  onNoClick() {
    this.dialogRef.close();
  }

  onAddScore() {
    console.log(this.data);
    const valid = true;
    let hasRummy;
    let hasScoreLessThanFull;
    Object.keys(this.data.score).forEach(player => {
      if (Number(this.data.score[player]) === 0) {
        hasRummy = true;
      }
      if (Number(this.data.score[player]) < this.data.rules.fullPoints) {
        hasScoreLessThanFull = true
      }
    });
    console.log({ hasRummy });
    console.log({ hasScoreLessThanFull });
    if (hasRummy && hasScoreLessThanFull) {
      this.dialogRef.close(this.data);
    } else {
      this.showScoreError = true;
      setTimeout(() => {
        this.showScoreError = false;
      }, 2000);
    }

  }

}
