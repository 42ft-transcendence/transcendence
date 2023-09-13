import ChannelSearchItem from "@components/channel/channelSearchItem";
import NavBar from "@components/common/navBar";
import ChattingSideBar from "@components/common/sideBar/chattingSideBar";
import SearchBar, { SearchBarPropsType } from "@components/common/searchBar";
import { ChannelType } from "@type";

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
      <SearchBar
        id={searchBar.id}
        search={searchBar.search}
        setSearch={searchBar.setSearch}
        sortState={searchBar.sortState}
        setSortState={searchBar.setSortState}
        sortOptions={searchBar.sortOptions}
        placeholder={searchBar.placeholder}
      />
      {channels.map((channel) => (
        <ChannelSearchItem key={channel.id} channel={channel} />
      ))}
    </>
  );
};

export default ChannelListPageView;
