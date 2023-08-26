import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import "jest-styled-components";
import Login, { LoginButton } from "@pages/login";
import { RecoilRoot } from "recoil";

describe("<LoginButton />", () => {
  it("props가 제대로 전달되는지 확인", () => {
    const { getByText, getByRole } = render(
      <LoginButton href="testHref" src="testSrc.png" type="42" />,
    );

    const link = getByRole("link");
    const image = getByRole("img");

    expect(link).toHaveAttribute("href", "testHref");
    expect(image).toHaveAttribute("src", "testSrc.png");
    expect(getByText("Sign in With 42")).toBeInTheDocument();
  });
});

describe("<Login />", () => {
  it("로그인 버튼이 두개 렌더링 되는지 확인", () => {
    const { getAllByRole } = render(
      <RecoilRoot>
        <Login />
      </RecoilRoot>,
    );

    const links = getAllByRole("link");

    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute("href");
    expect(links[1]).toHaveAttribute("href");
  });

  it("로고 이미지가 렌더링 되는지 확인", () => {
    const { getAllByRole } = render(
      <RecoilRoot>
        <Login />
      </RecoilRoot>,
    );

    const images = getAllByRole("img");
    const logoImage = images[0]; // 0번째 이미지가 로고 이미지

    expect(logoImage).toHaveAttribute("src", "src/assets/logos/ccpp_logo.png");
  });

  it("로고 이미지 크기 확인", () => {
    const { getAllByRole } = render(
      <RecoilRoot>
        <Login />
      </RecoilRoot>,
    );

    const images = getAllByRole("img");
    const logoImage = images[0];

    expect(logoImage).toHaveStyleRule("width", "300px");
    expect(logoImage).toHaveStyleRule("height", "300px");
  });

  it("버튼을 클릭하면 외부 링크로 이동하는지 확인", () => {
    const { getAllByRole } = render(
      <RecoilRoot>
        <Login />
      </RecoilRoot>,
    );

    const links = getAllByRole("link");
    const link42 = links[0];
    const linkGoogle = links[1];

    // TODO: 외부 링크로 이동하는지 확인하는 테스트 코드 작성
    // 기대값이 링크에 포함되어있는지 확인
    expect(link42).toHaveAttribute(
      "href",
      expect.stringContaining("https://api.intra.42.fr/oauth/authorize"),
    );
    expect(linkGoogle).toHaveAttribute(
      "href",
      expect.stringContaining("https://accounts.google.com/o/oauth2/v2/auth"),
    );
  });
});
