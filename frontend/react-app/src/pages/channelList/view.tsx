import ChannelSearchItem from "@components/channel/channelSearchItem";
import NavBar from "@components/common/navBar";
import SearchList from "@components/common/searchList";
import ChattingSideBar from "@components/common/sideBar/chattingSideBar";
import { ChannelType } from "@type";

export interface ChannelListPageViewPropsType {
  onChannelSearch: (keyword: string) => void;
  channels: ChannelType[];
}

const ChannelListPageView = ({
  onChannelSearch,
  channels,
}: ChannelListPageViewPropsType) => {
  return (
    <>
      <NavBar />
      <ChattingSideBar />
      <SearchList onSearch={onChannelSearch}>
        {channels.map((channel) => (
          <ChannelSearchItem key={channel.id} channel={channel} />
        ))}
      </SearchList>
    </>
  );
};

export default ChannelListPageView;
