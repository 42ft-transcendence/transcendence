import { ProfileButtonContainer } from "./index.styled";
import { profileRoleButtonMapping } from "./data";
import { useRecoilState } from "recoil";
import {
  addBlock,
  addFriend,
  deleteBlock,
  deleteFriend,
  getBlockList,
  getFriendList,
  offerBattle,
} from "@src/api";
import { useEffect, useState } from "react";
import { RoleType, UserType } from "@src/types";
import { IconButton } from "@src/components/buttons";
import { showProfileState, userDataState } from "@src/recoil/atoms/common";
import { ProfileModalOnClickHandler } from "@src/utils";
import BattleIcon from "@src/assets/icons/battle.svg";
import AddFriendIcon from "@src/assets/icons/addFriend.svg";
import DeleteFriendIcon from "@src/assets/icons/deleteFriend.svg";
import BlockIcon from "@src/assets/icons/block.svg";
import UnblockIcon from "@src/assets/icons/unblock.svg";
import SendMessageIcon from "@src/assets/icons/sendMessage.svg";
import ShowRecordIcon from "@src/assets/icons/showRecord.svg";
import BanChatIcon from "@src/assets/icons/banChat.svg";
import UnbanChatIcon from "@src/assets/icons/unbanChat.svg";
import KickIcon from "@src/assets/icons/kick.svg";
import SetAdminIcon from "@src/assets/icons/setAdmin.svg";
import UnsetAdminIcon from "@src/assets/icons/unsetAdmin.svg";
import sha256 from "crypto-js/sha256";
import { gameRoomInfoState } from "@src/recoil/atoms/game";
import { gameSocket } from "@src/router/socket/gameSocket";

interface ProfileButtonActionsProps {
  role: RoleType; // "self" | "attendee" | "owner" | "admin"
}

interface ProfileButtonProps {
  buttons: { label: string; action: () => void; src: string }[];
}

const ProfileButtons: React.FC<ProfileButtonProps> = ({ buttons }) => {
  return (
    <ProfileButtonContainer>
      {buttons.map((button) => (
        <IconButton
          key={button.label}
          title={button.label}
          theme="LIGHT"
          onClick={button.action}
          iconSrc={button.src}
        />
      ))}
    </ProfileButtonContainer>
  );
};

const hashTitle = (title: string): string => {
  const hash = sha256(title);
  return hash.toString(); // 해시 값을 문자열로 반환
};

export const ProfileButtonActions = ({ role }: ProfileButtonActionsProps) => {
  const [userData, setUserData] = useRecoilState(userDataState);
  // 상대 프로필 유저
  const [user, setShowProfile] = useRecoilState(showProfileState);
  const [isFriend, setIsFriend] = useState<boolean>(false);
  const [isBlocked, setIsBlocked] = useState<boolean>(false);
  const [gameRoomInfo, setGameRoomInfo] = useRecoilState(gameRoomInfoState);

  // 친구 상태인지 확인

  const checkFriend = async (): Promise<void> => {
    try {
      const response = await getFriendList();
      const friendList = response.data;
      console.log("friendList", friendList);
      const isFriend = friendList.some((friend) => friend.id === user.user.id);
      setIsFriend(isFriend);
    } catch (error) {
      console.log(error);
    }
  };

  // 차단 상태인지 확인
  const checkBlock = async (): Promise<void> => {
    try {
      const response = await getBlockList();
      const blockList = response.data;
      const isBlocked = blockList.some((block) => block.id === user.user.id);
      setIsBlocked(isBlocked);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddFriend = async (): Promise<void> => {
    try {
      const response = await addFriend(user.user.id);
      setIsFriend(true);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteFriend = async (): Promise<void> => {
    try {
      const response = await deleteFriend(user.user.id);
      setIsFriend(false);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddBlock = async (): Promise<void> => {
    try {
      await addBlock(user.user.id);
      setIsBlocked(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteBlock = async (): Promise<void> => {
    try {
      const response = await deleteBlock(user.user.id);
      setIsBlocked(false);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleBattleOffer = async (): Promise<void> => {
    try {
      const currentTime: Date = new Date();
      const roomURL = currentTime + userData.id;
      const hashedTitle = hashTitle(roomURL);
      setUserData({
        ...userData,
        gameRoomURL: hashedTitle,
      });
      console.log("hashedTitle", hashedTitle);
      gameSocket.emit("offerBattle", {
        awayUser: user.user,
        myData: userData,
        gameRoomURL: hashedTitle,
        roomType: "PROTECTED",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const profileButtonData = [
    {
      label: "대전 신청",
      action: handleBattleOffer,
      src: BattleIcon,
    },
    {
      label: "친구 추가",
      action: handleAddFriend,
      src: AddFriendIcon,
    },
    {
      label: "친구 삭제",
      action: handleDeleteFriend,
      src: DeleteFriendIcon,
    },
    {
      label: "차단 하기",
      action: handleAddBlock,
      src: BlockIcon,
    },
    {
      label: "차단 해제",
      action: handleDeleteBlock,
      src: UnblockIcon,
    },
    {
      label: "DM 보내기",
      action: () => console.log("handleActionSendMessage"),
      src: SendMessageIcon,
    },
    {
      label: "전적 보기",
      action: () => {
        window.location.href = `/profile/${user.user.id}`;
        ProfileModalOnClickHandler(setShowProfile, false, {} as UserType);
      },
      src: ShowRecordIcon,
    },
    {
      label: "채팅 금지",
      action: () => console.log("handleActionBanChat"),
      src: BanChatIcon,
    },
    {
      label: "채팅 금지 해제",
      action: () => console.log("handleActionUnbanChat"),
      src: UnbanChatIcon,
    },
    {
      label: "강제 퇴장",
      action: () => console.log("handleActionKick"),
      src: KickIcon,
    },
    {
      label: "관리자 설정",
      action: () => console.log("handleActionSetAdmin"),
      src: SetAdminIcon,
    },
    {
      label: "관리자 해제",
      action: () => console.log("handleActionUnsetAdmin"),
      src: UnsetAdminIcon,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        await checkFriend();
        await checkBlock();
      } catch (error) {
        console.log(error);
      }
    };

    fetchData().catch((error) => console.log(error));
  }, [isFriend, isBlocked]);

  // 초기 상태 설정
  let filteredButtons = profileButtonData.filter((button) =>
    profileRoleButtonMapping[role].includes(button.label),
  );
  if (isFriend) {
    filteredButtons = filteredButtons.filter(
      (button) => button.label !== "친구 추가",
    );
  } else {
    filteredButtons = filteredButtons.filter(
      (button) => button.label !== "친구 삭제",
    );
  }

  if (isBlocked) {
    filteredButtons = filteredButtons.filter(
      (button) => button.label !== "차단 하기",
    );
    filteredButtons = filteredButtons.filter(
      (button) => button.label !== "친구 추가",
    );
    filteredButtons = filteredButtons.filter(
      (button) => button.label !== "친구 삭제",
    );
  } else {
    filteredButtons = filteredButtons.filter(
      (button) => button.label !== "차단 해제",
    );
  }

  return <ProfileButtons buttons={filteredButtons} />;
};
