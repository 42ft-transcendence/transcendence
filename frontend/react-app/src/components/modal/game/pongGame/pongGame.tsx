// PongGame.tsx
import React, { useEffect } from "react";
import NormalMapSvg from "@assets/maps/mapNormal.svg";
import { ballLocationType } from "@src/types/game.type";
import { useRecoilState } from "recoil";
import { gameRoomInfoState, gameRoomURLState } from "@src/recoil/atoms/game";
import { userDataState } from "@src/recoil/atoms/common";
import { gameSocket } from "@src/router/socket/gameSocket";

const PongGame: React.FC = () => {
  const [gameRoomInfo] = useRecoilState(gameRoomInfoState);
  const [gameRoomURL] = useRecoilState(gameRoomURLState);
  const [userData] = useRecoilState(userDataState);

  useEffect(() => {
    const cvs = document.getElementById("pong") as HTMLCanvasElement;
    const ctx = cvs.getContext("2d");
    if (!ctx) {
      console.error("Canvas context is null.");
      return;
    }
    const userIndex = gameRoomInfo.participants.findIndex(
      (participant) => participant.user.id === userData.id,
    );

    const backgroundImage = new Image();

    backgroundImage.src = NormalMapSvg;
    ctx.fillStyle = "BLACK";
    ctx.fillRect(0, 0, cvs.width, cvs.height);
    ctx.fillStyle = "WHITE";
    ctx.font = "60px fantasy";
    ctx.textAlign = "center"; // 텍스트 정렬을 가운데로 설정
    ctx.textBaseline = "middle"; // 수직 정렬을 중앙으로 설정

    const leftUser = {
      x: 0,
      y: cvs.height / 2 - 100 / 2,
      width: 10,
      height: 100,
      color: "WHITE",
      radius: 0,
      speed: 0,
      velocityX: 0,
      velocityY: 0,
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    };

    const rightUser = {
      x: cvs.width - 10,
      y: cvs.height / 2 - 100 / 2,
      width: 10,
      height: 100,
      color: "WHITE",
      radius: 0,
      speed: 0,
      velocityX: 0,
      velocityY: 0,
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    };

    const ball: ballLocationType = {
      x: cvs.width / 2,
      y: cvs.height / 2,
      radius: 10,
      speed: 8,
      velocityX: 5,
      velocityY: 0,
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

    function drawBall(x: number, y: number, color: string) {
      if (!ctx) {
        console.error("Canvas context is null.");
        return;
      }
      const radius = 10;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2, false);
      ctx.closePath();
      ctx.fill();
    }
    function render() {
      if (!ctx) {
        console.error("Canvas context is null.");
        return;
      }
      ctx.drawImage(backgroundImage, 0, 0, cvs.width, cvs.height);

      drawpaddle(
        leftUser.x,
        leftUser.y,
        leftUser.width,
        leftUser.height,
        leftUser.color,
      );
      drawpaddle(
        rightUser.x,
        rightUser.y,
        rightUser.width,
        rightUser.height,
        rightUser.color,
      );

      //draw the ball

      drawBall(ball.x, ball.y, ball.color);
    }

    // control the user paddle
    cvs.addEventListener("mousemove", movePaddle);

    function movePaddle(evt: MouseEvent) {
      const rect = cvs.getBoundingClientRect();
      if (userIndex === 0) {
        leftUser.y = evt.clientY - rect.top - leftUser.height / 2;
      } else {
        rightUser.y = evt.clientY - rect.top - rightUser.height / 2;
      }
    }

    let animationFrameId: number;

    backgroundImage.onload = () => {
      // let count = 4;
      // const countDown = setInterval(() => {
      //   if (!ctx) {
      //     console.error("Canvas context is null.");
      //     return;
      //   }
      //   ctx.fillStyle = "BLACK";
      //   ctx.fillRect(0, 0, cvs.width, cvs.height);
      //   ctx.fillStyle = "WHITE";
      //   ctx.font = "45px Noto Sans Mono";
      //   if (count !== 1) {
      //     ctx.fillText((count - 1).toString(), cvs.width / 2, cvs.height / 2);
      //   } else if (count === 1) {
      //     ctx.fillText("Game Start!!", cvs.width / 2, cvs.height / 2);
      //   }
      //   count--;
      //   if (count === -1) {
      //     clearInterval(countDown);

      //     game();
      //   }
      // }, 1000);
      game();
    };
    function game() {
      render();
      gameSocket.emit("userPaddle", {
        gameRoomURL: gameRoomURL,
        userIndex: userIndex,
        userPaddle: userIndex === 0 ? leftUser.y : rightUser.y,
      });
      animationFrameId = requestAnimationFrame(game);
    }

    gameSocket.off("gameProcess");
    gameSocket.on("gameProcess", (data) => {
      if (data.gameRoomURL !== gameRoomURL) return;
      userIndex === 0
        ? (rightUser.y = data.gameData.rightPaddle)
        : (leftUser.y = data.gameData.leftPaddle);
      ball.x = data.gameData.ballX;
      ball.y = data.gameData.ballY;
      ball.velocityX = data.gameData.ballVecX;
      ball.velocityY = data.gameData.ballVecY;
      ball.speed = data.gameData.ballSpeed;
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [userData]);
  return (
    <div>
      <canvas id="pong" width={800} height={600}></canvas>
    </div>
  );
};

export default PongGame;
