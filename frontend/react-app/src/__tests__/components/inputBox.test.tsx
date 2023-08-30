import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import "jest-styled-components";
import InputBox from "@components/inputBox";

describe("<InputBox />", () => {
  it("텍스트가 제대로 입력되는지 확인", () => {
    const mockOnChange = jest.fn();
    const mockOnKeyPress = jest.fn();
    const { getByPlaceholderText } = render(
      <InputBox onChange={mockOnChange} onKeyPress={mockOnKeyPress} />,
    );

    const input = getByPlaceholderText(
      "닉네임을 입력하세요",
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "testNickname" } });

    expect(input.value).toBe("testNickname");
    expect(mockOnChange).toHaveBeenCalledWith("testNickname");
  });

  it("엔터키를 누르면 onKeyPress가 호출되는지 확인", () => {
    const mockOnChange = jest.fn();
    const mockOnKeyPress = jest.fn();
    const { getByPlaceholderText } = render(
      <InputBox onChange={mockOnChange} onKeyPress={mockOnKeyPress} />,
    );

    const input = getByPlaceholderText("닉네임을 입력하세요");
    fireEvent.keyPress(input, { key: "Enter", code: "Enter", charCode: 13 });

    expect(mockOnKeyPress).toHaveBeenCalledTimes(1);
  });

  it("입력 길이 제한이 10글자로 설정되어 있는지 확인", () => {
    const mockOnChange = jest.fn();
    const mockOnKeyPress = jest.fn();
    const { getByPlaceholderText } = render(
      <InputBox onChange={mockOnChange} onKeyPress={mockOnKeyPress} />,
    );

    const input = getByPlaceholderText("닉네임을 입력하세요");
    expect(input).toHaveAttribute("maxLength", "10");
  });
});
