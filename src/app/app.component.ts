import { Component, computed, effect, OnInit, signal, viewChildren } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BalloonComponent } from './components/balloon/balloon.component';
import { IBalloon } from './balloon.interface';
import { Balloon } from './balloon.class';

@Component({
  selector: 'app-root',
  imports: [BalloonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  balloonsOnScreen = 5;
  balloons: IBalloon[] = [];

  score = 0;
  missed = signal(0);
  maxMisses = 10;
  gameOver = computed(() => {
    return this.missed() == this.maxMisses;
  });

  balloonElements = viewChildren(BalloonComponent);

  createBalloonsOnDemand = effect(() => {
    if (!this.gameOver() && this.balloonElements().length < this.balloonsOnScreen) {
      this.balloons = [...this.balloons, new Balloon()];
    } 
  })

  ngOnInit(): void {
    this.startGame();
  }

  startGame() {
    this.missed.set(0);
    this.score = 0;
    this.balloons = new Array(this.balloonsOnScreen).fill(0).map(
      () => new Balloon()
    );
  }

  balloonPopHandler(baloonId: string) {
    this.score++;
    this.balloons = this.balloons.filter(balloon => balloon.id !== baloonId);
    this.balloons = [...this.balloons, new Balloon()];
  }

  balloonMissHandler(balloonId: string) {
    this.missed.update(missed => missed + 1);
    this.balloons = this.balloons.filter((balloon) => balloon.id !== balloonId)
  }

}
