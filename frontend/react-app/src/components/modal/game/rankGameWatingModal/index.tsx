import Modal from "react-modal";

interface RankGameWatingModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const RankGameWatingModal = ({
  isOpen,
  setIsOpen,
}: RankGameWatingModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => setIsOpen(false)}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
        content: {
          width: "50%",
          height: "50%",
          margin: "auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
        },
      }}
    >
      <div>랭킹전 참가</div>
    </Modal>
  );
};
