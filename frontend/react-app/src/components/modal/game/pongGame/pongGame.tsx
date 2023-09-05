// PongGame.tsx
import React, { useEffect } from "react";
import NormalMapSvg from "@assets/maps/mapNormal.svg";
import { ballLocationType } from "@src/types/game.type";

const PongGame: React.FC = () => {
  useEffect(() => {
    // Canvas에 핑퐁 게임을 그리는 코드를 작성합니다.
    const cvs = document.getElementById("pong") as HTMLCanvasElement;
    const ctx = cvs.getContext("2d");
    if (!ctx) {
      console.error("Canvas context is null.");
      return;
    }
    const backgroundImage = new Image();
    // 핑퐁 게임 로직을 구현합니다
    backgroundImage.src = NormalMapSvg;
    // ctx.drawImage(backgroundImage, 0, 0, cvs.width, cvs.height);
    const user = {
      x: 0,
      y: cvs.height / 2 - 100 / 2,
      width: 10,
      height: 100,
      color: "WHITE",
      score: 0,
    };

    const com = {
      x: cvs.width - 10,
      y: cvs.height / 2 - 100 / 2,
      width: 10,
      height: 100,
      color: "WHITE",
      score: 0,
    };

    const ball: ballLocationType = {
      x: cvs.width / 2,
      y: cvs.height / 2,
      radius: 10,
      speed: 5,
      velocityX: 5,
      velocityY: 5,
      color: "WHITE",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      score: 0,
      height: 0,
      width: 0,
    };

    function drawpaddle(
      x: number,
      y: number,
      w: number,
      h: number,
      color: string,
    ) {
      if (!ctx) {
        console.error("Canvas context is null.");
        return;
      }
      ctx.fillStyle = color;
      ctx.fillRect(x, y, w, h);
    }

    // drawpaddle(0, 0, cvs.width, cvs.height, "white");
    function drawText(text: number, x: number, y: number, color: string) {
      if (!ctx) {
        console.error("Canvas context is null.");
        return;
      }
      ctx.fillStyle = color;
      ctx.font = "45px fantasy";
      ctx.fillText(text.toString(), x, y);
    }

    function drawBall(x: number, y: number, r: number, color: string) {
      if (!ctx) {
        console.error("Canvas context is null.");
        return;
      }
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2, false);
      ctx.closePath();
      ctx.fill();
    }

    function render() {
      //clear canvas
      if (!ctx) {
        console.error("Canvas context is null.");
        return;
      }

      // ctx.drawImage(backgroundImage, 0, 0, cvs.width, cvs.height);
      // ctx.fillStyle = "BLACK";
      // ctx.fillRect(0, 0, cvs.width, cvs.height);
      ctx.drawImage(backgroundImage, 0, 0, cvs.width, cvs.height);

      //draw the net
      // drawNet();
      //draw score
      drawText(user.score, cvs.width / 4, cvs.height / 5, "WHITE");
      drawText(com.score, (3 * cvs.width) / 4, cvs.height / 5, "WHITE");
      // console.log("score", com.score);

      //draw the user and com paddle
      drawpaddle(user.x, user.y, user.width, user.height, user.color);
      drawpaddle(com.x, com.y, com.width, com.height, com.color);

      //draw the ball
      drawBall(ball.x, ball.y, ball.radius, ball.color);
    }

    // control the user paddle
    cvs.addEventListener("mousemove", movePaddle);
    // console.log(cvs.getBoundingClientRect());

    function movePaddle(evt: MouseEvent) {
      // console.log("evt", evt);
      const rect = cvs.getBoundingClientRect();
      user.y = evt.clientY - rect.top - user.height / 2;
    }

    // collision detection
    function collision(b: ballLocationType, p: ballLocationType) {
      console.log("b", b);
      b.top = b.y - b.radius;
      b.bottom = b.y + b.radius;
      b.left = b.x - b.radius;
      b.right = b.x + b.radius;

      p.top = p.y;
      p.bottom = p.y + p.height;
      p.left = p.x;
      p.right = p.x + p.width;

      return (
        b.right > p.left &&
        b.bottom > p.top &&
        b.left < p.right &&
        b.top < p.bottom
      );
    }

    // update : pos, mov, score
    function update() {
      if (!ctx) {
        console.error("Canvas context is null.");
        return;
      }

      ball.x += ball.velocityX;
      ball.y += ball.velocityY;

      const computerLevel = 0.1;
      com.y += (ball.y - (com.y + com.height / 2)) * computerLevel;
      if (ball.y + ball.radius > cvs.height || ball.y - ball.radius < 0) {
        ball.velocityY = -ball.velocityY;
      }
      const player: ballLocationType = {
        ...ball,
        score: 0,
      };
      if (collision(ball, player)) {
        // ball.velocityX = -ball.velocityX;
        const collide = ball.y - (player.y + player.height / 2);

        const collidePoint = collide / (player.height / 2);
        const angleRad = (collidePoint * Math.PI) / 4;
        const direction = ball.x < cvs.width / 2 ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);
        ball.speed += 0.1;
      }
      if (ball.x - ball.radius < 0) {
        com.score++;
        resetBall();
      } else if (ball.x + ball.radius > cvs.width) {
        user.score++;
        resetBall();
      }
    }

    function resetBall() {
      ball.x = cvs.width / 2;
      ball.y = cvs.height / 2;
      ball.speed = 5;
      ball.velocityX = -ball.velocityX;
    }

    let animationFrameId: number;
    //game init

    backgroundImage.onload = () => {
      function game() {
        // 게임 상태 업데이트
        update();
        // 게임 요소 그리기
        render();
        // 다음 프레임을 기다립니다.
        animationFrameId = requestAnimationFrame(game);
      }

      // 게임 루프 시작
      game();
    };
    // 이펙트 클린업 함수
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  return (
    <div>
      <canvas id="pong" width={800} height={600}></canvas>
    </div>
  );
};

export default PongGame;
