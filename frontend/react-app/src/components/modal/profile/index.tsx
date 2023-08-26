import { useRecoilState } from "recoil";
import {
  ProfileButtonContainer,
  ProfileContainer,
  ProfileDoughnutSlideCircle,
  ProfileDoughnutSlideCircleContainer,
  ProfileImage,
  ProfileNickname,
  ProfileWrapper,
} from "./index.styled";
import {
  showProfileSlideState,
  showProfileState,
} from "../../recoil/atoms/common";
import { ProfileButtonActions, ProfileWinRateDoughnut } from "./container";
import { AnimatePresence, motion } from "framer-motion";

type DragInfo = {
  offset: {
    x: number;
    y: number;
  };
};

interface ProfileProps {
  onClose: () => void;
}

const Profile: React.FC<ProfileProps> = ({ onClose }) => {
  const [showProfile] = useRecoilState(showProfileState);
  const [activeSlide, setActiveSlide] = useRecoilState(showProfileSlideState);

  const handleClickInside = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const slideVariants = {
    hidden: { opacity: 0, x: "100%" },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: "-100%" },
  };

  const handleDragEnd = (_, info: DragInfo) => {
    // _는 event를 무시하겠다는 의미 (슬라이드를 가로로만 하기 때문)
    if (info.offset.x > 100 && activeSlide === 2) {
      setActiveSlide(1);
    } else if (info.offset.x < -100 && activeSlide === 1) {
      setActiveSlide(2);
    }
  };

  // TODO: showProfile.showProfile가 false일 때 null을 반환
  if (!showProfile.showProfile) return null;

  return (
    <ProfileWrapper onClick={onClose}>
      <ProfileContainer onClick={handleClickInside}>
        <ProfileImage src={showProfile.user.avatarPath} />
        <ProfileNickname>{showProfile.user.nickname}</ProfileNickname>
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
                  wins={showProfile.user.ladder_win}
                  losses={showProfile.user.ladder_lose}
                  rating={showProfile.user.rating}
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
                  wins={showProfile.user.win}
                  losses={showProfile.user.lose}
                  rating={showProfile.user.rating}
                  isRanking={activeSlide}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        <ProfileDoughnutSlideCircleContainer>
          <ProfileDoughnutSlideCircle $status={activeSlide} $select={1} />
          <ProfileDoughnutSlideCircle $status={activeSlide} $select={2} />
        </ProfileDoughnutSlideCircleContainer>
        <ProfileButtonContainer>
          <ProfileButtonActions role="owner" />
        </ProfileButtonContainer>
      </ProfileContainer>
    </ProfileWrapper>
  );
};

export default Profile;
