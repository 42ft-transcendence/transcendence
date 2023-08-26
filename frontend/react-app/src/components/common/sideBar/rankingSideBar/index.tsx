import * as DS from "../index.styled";
import RateDoughnutChart from "@src/components/charts/rateDoughnutChart";
import { useRecoilState } from "recoil";
import { userDataState } from "@src/recoil/atoms/common";

const RankingSideBar = () => {
  const [userData] = useRecoilState(userDataState);

  // TODO: 랭킹 top 3 가져오기

  return (
    <DS.Container>
      <DS.TitleBox>Top 3</DS.TitleBox>
      <br />
      <DS.TitleBox>향후 구현 예정</DS.TitleBox>
      {/* TODO: top 3 랭킹 보여주기 */}
      <br />
      <br />
      <br />
      <DS.TitleBox>내 전적</DS.TitleBox>
      <RateDoughnutChart userData={userData} />
    </DS.Container>
  );
};

export default RankingSideBar;
