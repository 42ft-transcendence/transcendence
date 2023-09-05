export class GameData {
  left_paddle: number;
  right_paddle: number;
  ball_x: number;
  ball_y: number;
  ball_vec_x: number;
  ball_vec_y: number;
  ball_speed: number;
  score: [number, number];

  constructor() {
    (this.left_paddle = 300),
      (this.right_paddle = 300),
      (this.ball_x = 400),
      (this.ball_y = 300),
      (this.ball_speed = 8),
      (this.ball_vec_x = 5),
      (this.ball_vec_y = 0),
      (this.score = [0, 0]);
  }

  public reset() {
    this.ball_x = 400;
    this.ball_y = 300;
    this.ball_vec_y = 0;
    this.ball_speed = 9;
  }

  advance(mouseDelta: number) {
    let collidePoint: number;
    let angleRad: number;

    this.ball_x += this.ball_vec_x;
    this.ball_y += this.ball_vec_y;

    const speedModifier = 1 + mouseDelta * 0.002;

    if (this.ball_y < 0 + 10) {
      if (this.ball_vec_y < 0) this.ball_vec_y = -this.ball_vec_y;
    } else if (this.ball_y > 600 - 10) {
      if (this.ball_vec_y > 0) this.ball_vec_y = -this.ball_vec_y;
    }

    if (this.ball_x < 0) {
      if (
        this.ball_y >= this.left_paddle &&
        this.ball_y <= this.left_paddle + 100
      ) {
        collidePoint = (this.ball_y - (this.left_paddle + 50)) / 50;
        angleRad = (Math.PI / 4) * collidePoint;
        this.ball_vec_x = this.ball_speed * Math.cos(angleRad);
        this.ball_vec_y = this.ball_speed * Math.sin(angleRad);
        this.ball_speed *= speedModifier;
        if (this.ball_speed < 9) {
          this.ball_speed = 9;
        }
      } else {
        this.score[1]++;
        this.ball_vec_x = -5;
        this.reset();
      }
    } else if (this.ball_x > 800) {
      if (
        this.ball_y >= this.right_paddle &&
        this.ball_y <= this.right_paddle + 100
      ) {
        collidePoint = (this.ball_y - (this.right_paddle + 50)) / 50;
        angleRad = (Math.PI / 4) * collidePoint;
        this.ball_vec_x = -1 * this.ball_speed * Math.cos(angleRad);
        this.ball_vec_y = this.ball_speed * Math.sin(angleRad);
        this.ball_speed *= speedModifier;
        if (this.ball_speed < 9) {
          this.ball_speed = 9;
        }
      } else {
        this.score[0]++;
        this.ball_vec_x = 5;
        this.reset();
      }
    }
  }
}
