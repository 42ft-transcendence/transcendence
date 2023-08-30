// SortDropdownComponent.tsx
import { useEffect, useRef } from "react";
import * as S from "./index.styled"; // 경로를 수정해주세요.

interface Props {
  sortState: string;
  showDropdown: boolean;
  setSortState: (value: string) => void;
  setShowDropdown: (show: boolean) => void;
  setIsOpenDropdown: (open: boolean) => void;
  options: string[];
  isOpenDropdown: boolean;
  mode: string;
  style?: React.CSSProperties;
}

export const SortDropdownComponent: React.FC<Props> = ({
  sortState,
  showDropdown,
  setShowDropdown,
  setSortState,
  setIsOpenDropdown,
  options,
  isOpenDropdown,
  mode,
  style,
}) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
        setIsOpenDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSortSelection = (selectedSort: string) => {
    setSortState(selectedSort);
    setShowDropdown(false);
    setTimeout(() => {
      setIsOpenDropdown(false);
    }, 0); // 0ms 지연으로 다음 리렌더링 사이클에서 호출되도록 설정
  };

  return (
    <S.SortContainer
      onClick={() => {
        setShowDropdown(!showDropdown);
        setIsOpenDropdown(true);
      }}
      mode={mode}
      style={style}
    >
      {showDropdown && (
        <S.SortDropdown ref={dropdownRef} mode={mode}>
          {options.map((option, index) => (
            <S.SortOption
              key={index}
              onClick={() => handleSortSelection(option)}
              mode={mode}
            >
              {option}
            </S.SortOption>
          ))}
        </S.SortDropdown>
      )}
      <span style={{ cursor: "pointer" }}>{sortState}</span>
      <S.SortArrowIcon $isOpen={isOpenDropdown} mode={mode} />
    </S.SortContainer>
  );
};
