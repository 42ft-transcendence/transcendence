import { ChangeEvent, useState } from "react";
import { InputBoxWrapper } from "./index.styled";

interface InputBoxProps {
  onChange: (value: string) => void;
  onKeyPress: () => void;
}

const InputBox: React.FC<InputBoxProps> = ({ onChange, onKeyPress }) => {
  const [nickname, setNickname] = useState<string>("");

  const handleNicknameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newNickname = event.target.value;
    setNickname(newNickname);
    onChange(newNickname); // 입력한 텍스트를 부모 컴포넌트로 전달
  };

  return (
    <InputBoxWrapper
      type="text"
      placeholder="닉네임을 입력하세요"
      id="nickname"
      value={nickname}
      onChange={handleNicknameChange}
      onKeyPress={(event) => {
        if (event.key === "Enter") {
          // 엔터키를 누르면
          onKeyPress(); // 부모 컴포넌트로 엔터키를 눌렀음을 전달
        }
      }}
      // 글자 수 제한
      maxLength={10}
    />
  );
};

export default InputBox;
