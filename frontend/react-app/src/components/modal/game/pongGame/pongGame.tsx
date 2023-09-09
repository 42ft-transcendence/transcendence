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

  const userIndex = gameRoomInfo.participants.findIndex(
    (participant) => participant.user.id === userData.id,
  );

  useEffect(() => {
    const cvs = document.getElementById("pong") as HTMLCanvasElement;
    const ctx = cvs.getContext("2d");
    if (!ctx) {
      console.error("Canvas context is null.");
      return;
    }
    const backgroundImage = new Image();

    backgroundImage.src = NormalMapSvg;
    // ctx.drawImage(backgroundImage, 0, 0, cvs.width, cvs.height);
    const user = {
      x: userIndex === 0 ? 0 : cvs.width - 10,
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

    const com = {
      x: userIndex === 1 ? 0 : cvs.width - 10,
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
      // const radius = Math.sqrt(vecX * vecX + vecY * vecY);
      const radius = 10;
      // console.log("radius", radius);
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

      drawpaddle(user.x, user.y, user.width, user.height, user.color);
      drawpaddle(com.x, com.y, com.width, com.height, com.color);

      //draw the ball

      drawBall(ball.x, ball.y, ball.color);
    }

    // control the user paddle
    cvs.addEventListener("mousemove", movePaddle);

    function movePaddle(evt: MouseEvent) {
      const rect = cvs.getBoundingClientRect();
      user.y = evt.clientY - rect.top - user.height / 2;
    }

    let animationFrameId: number;

    backgroundImage.onload = () => {
      function game() {
        render();
        gameSocket.emit("userPaddle", {
          gameRoomURL: gameRoomURL,
          userIndex: userIndex,
          userPaddle: user.y,
        });

        animationFrameId = requestAnimationFrame(game);
      }

      // 게임 루프 시작
      game();
    };

    gameSocket.off("gameProcess");
    gameSocket.on("gameProcess", (data) => {
      if (data.gameRoomURL !== gameRoomURL) return;
      if (data.userIndex === userIndex) return;
      data.userIndex === 0
        ? (com.y = data.gameData.leftPaddle)
        : (com.y = data.gameData.rightPaddle);
      ball.x = data.gameData.ballX;
      ball.y = data.gameData.ballY;
      ball.velocityX = data.gameData.ballVecX;
      ball.velocityY = data.gameData.ballVecY;
      ball.speed = data.gameData.ballSpeed;
    });

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
