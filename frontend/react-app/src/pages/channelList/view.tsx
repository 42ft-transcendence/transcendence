import ChannelSearchItem from "@components/common/search/channelSearchItem";
import NavBar from "@components/common/navBar";
import ChattingSideBar from "@components/common/sideBar/chattingSideBar";
import { SearchBarPropsType } from "@components/common/search/searchBar";
import { ChannelType } from "@type";
import SearchList from "@components/common/search/searchList";

export interface ChannelListPageViewPropsType {
  searchBar: SearchBarPropsType;
  channels: ChannelType[];
}

const ChannelListPageView = ({
  searchBar,
  channels,
}: ChannelListPageViewPropsType) => {
  return (
    <>
      <NavBar />
      <ChattingSideBar />
      <SearchList searchBar={searchBar}>
        {channels.map((channel) => (
          <ChannelSearchItem key={channel.id} channel={channel} />
        ))}
      </SearchList>
    </>
  );
};

export default ChannelListPageView;
