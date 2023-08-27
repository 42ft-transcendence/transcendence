import { allUserListState, showProfileState } from "@src/recoil/atoms/common";
import { ProfileModalOnClickHandler } from "@src/utils";
import { useRecoilState } from "recoil";
import * as S from "./index.styled";
import MedalGoldIcon from "@src/assets/icons/medal_gold.svg";
import MedalSilverIcon from "@src/assets/icons/medal_silver.svg";
import MedalBronzeIcon from "@src/assets/icons/medal_bronze.svg";
import { useState } from "react";

export const TopRankers = () => {
  const [, setShowProfile] = useRecoilState(showProfileState);
  const [userList] = useRecoilState(allUserListState);
  const [sortedUserList] = useState(
    [...userList].sort((a, b) => b.rating - a.rating),
  );
  const top3List = sortedUserList.slice(0, 3);
  const top3MedalIconList = [MedalGoldIcon, MedalSilverIcon, MedalBronzeIcon];

  return (
    <>
      {Array(3)
        .fill(null)
        .map((_, index) => {
          const user = top3List[index];

          return (
            <S.TopRankerContainer key={user?.id || index}>
              <div
                style={{
                  width: "170px",
                  alignItems: "center",
                  display: "flex",
                }}
              >
                {user ? (
                  <>
                    <S.TopRankerImg src={top3MedalIconList[index]} />
                    <S.TopRankerNickname
                      onClick={ProfileModalOnClickHandler(
                        setShowProfile,
                        true,
                        user,
                      )}
                    >
                      {user.nickname}
                    </S.TopRankerNickname>
                  </>
                ) : null}
              </div>
              {user ? (
                <S.TopRankerRating $ranking={index + 1}>
                  {user.rating} LP
                </S.TopRankerRating>
              ) : null}
            </S.TopRankerContainer>
          );
        })}
    </>
  );
};
