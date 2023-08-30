import * as DS from "../index.styled";
import RateDoughnutChart from "@src/components/charts/rateDoughnutChart";
import { useRecoilState } from "recoil";
import { userDataState } from "@src/recoil/atoms/common";
import { TopRankers } from "./containers";

const RankingSideBar = () => {
  const [userData] = useRecoilState(userDataState);

  return (
    <DS.Container>
      <DS.TitleBox>Top 3</DS.TitleBox>
      <TopRankers />
      <DS.TitleBox style={{ marginTop: "70px", marginBottom: "10px" }}>
        내 전적
      </DS.TitleBox>
      <RateDoughnutChart userData={userData} />
    </DS.Container>
  );
};

export default RankingSideBar;
