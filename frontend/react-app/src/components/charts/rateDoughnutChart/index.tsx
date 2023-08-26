import { showProfileSlideState } from "@src/recoil/atoms/common";
import { UserType } from "@src/types";
import { AnimatePresence, motion } from "framer-motion";
import { useRecoilState } from "recoil";
import { ProfileWinRateDoughnut } from "./container";
import * as S from "./index.styled";

interface RateDoughnutChartProps {
  userData: UserType;
}

type DragInfo = {
  offset: {
    x: number;
    y: number;
  };
};

const RateDoughnutChart = ({ userData }: RateDoughnutChartProps) => {
  const [activeSlide, setActiveSlide] = useRecoilState(showProfileSlideState);

  const slideVariants = {
    hidden: { opacity: 0, x: "100%" },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: "-100%" },
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent, info: DragInfo) => {
    // _는 event를 무시하겠다는 의미 (슬라이드를 가로로만 하기 때문)
    if (info.offset.x > 100 && activeSlide === 2) {
      setActiveSlide(1);
    } else if (info.offset.x < -100 && activeSlide === 1) {
      setActiveSlide(2);
    }
  };

  return (
    <>
      <motion.div
        drag="x"
        onDragEnd={handleDragEnd}
        dragConstraints={{ left: 0, right: 0 }}
      >
        <AnimatePresence>
          {activeSlide === 1 && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={slideVariants}
            >
              <ProfileWinRateDoughnut
                wins={userData.ladder_win}
                losses={userData.ladder_lose}
                rating={userData.rating}
                isRanking={activeSlide}
              />
            </motion.div>
          )}
          {activeSlide === 2 && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={slideVariants}
            >
              <ProfileWinRateDoughnut
                wins={userData.win}
                losses={userData.lose}
                rating={userData.rating}
                isRanking={activeSlide}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <S.DoughnutSlideCircleContainer>
        <S.DoughnutSlideCircle $status={activeSlide} $select={1} />
        <S.DoughnutSlideCircle $status={activeSlide} $select={2} />
      </S.DoughnutSlideCircleContainer>
    </>
  );
};

export default RateDoughnutChart;
