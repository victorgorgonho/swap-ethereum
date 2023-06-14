import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  background-color: #194289;
  overflow: hidden;
`;

export const LeftContainer = styled.div`
  display: flex;
  width: 35%;
  height: 100%;
  padding: 56px 0;
  align-items: flex-start;
  justify-content: center;

  @media (max-width: 1060px) {
    display: none;
  }
`;

export const LeftContent = styled.div`
  display: flex;
  border-radius: 28px;
  border: 1px solid #5eb3e5;
  flex-direction: column;
  width: 350px;
  height: 70vh;
  padding: 24px 32px;
  background-color: #2b2b27;
  gap: 30px;

  position: relative;
`;

export const RightContainer = styled.div`
  display: flex;
  width: 65%;
  height: 100%;
  padding: 2rem;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  overflow: auto;

  @media (max-width: 1060px) {
    width: 100%;
    margin-bottom: 32px;
  }

  @media (max-width: 545px) {
    padding: 2rem 1rem;
  }

  @media (max-width: 400px) {
    padding: 2rem 0.5rem;
  }

  @media (max-width: 380px) {
    padding: 2rem 0.2rem;
  }
`;

export const RightHeader = styled.div`
  display: flex;
  width: 100%;
  height: 40px;
  align-self: flex-end;
  justify-self: flex-end;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;

  @media (max-width: 520px) {
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    height: fit-content;
  }
`;

export const RightContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 1.5rem;
  align-items: flex-start;
  justify-content: flex-start;

  @media (max-width: 1060px) {
    align-items: center;
    justify-content: center;
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }

  @media (max-width: 700px) {
    padding: 0.5rem;
  }

  @media (max-width: 680px) {
    padding: 0.25rem;
  }

  @media (max-width: 660px) {
    padding: 0;
  }
`;

export const RightSwap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 576px;
  height: 600px;
  margin-top: 0px;
  padding: 1rem;
  background: rgba(210, 210, 134, 0);

  @media (max-width: 660px) {
    padding: 0.5rem;
  }

  @media (max-width: 640px) {
    padding: 0.25rem;
  }

  @media (max-width: 630px) {
    padding: 1rem 0 0 0;

    width: initial;
    height: 900px;
  }

  @media (max-width: 485px) {
    width: 380px;
  }

  @media (max-width: 450px) {
    width: 320px;
  }
`;

export const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.align ? "center" : "inherit")};
  width: ${(props) =>
    props.width ? props.width : props.fluid ? "center" : "fit-content"};
  height: ${(props) => (props.height ? props.height : "50px")};
  border-radius: ${(props) => (props.radius ? props.radius : "8px")};
  padding: 12px;
  cursor: ${(props) => (props.pointer ? "pointer" : "default")};
  background-color: ${(props) =>
    props.active ? "#419edfD8" : props.color ?? "transparent"};
  border: ${(props) => (props.border ? props.border : "none")};
  color: #fff;

  ${({ hover }) =>
    hover &&
    `
    &:hover {
      background-color: #004da80c;
    }
  `}

  &:disabled {
    background-color: #2b2b27;
    color: #fff;
    cursor: not-allowed;
    opacity: 0.4;
  }
`;

export const Typography = styled.p`
  font-size: ${(props) => (props.size ? props.size : "16px")};
  font-weight: ${(props) => (props.weight ? props.weight : "normal")};
  color: ${(props) => (props.color ? props.color : "#fff")};
  margin: ${(props) => (props.margin ? props.margin : "0")};
  text-align: ${(props) => (props.align ? props.align : "left")};

  cursor: ${(props) => (props.pointer ? "pointer" : "default")};
`;

export const Input = styled.input`
  width: ${(props) => (props.width ? props.width : "100%")};
  min-width: 0px;
  outline: transparent solid 2px;
  outline-offset: 2px;
  position: relative;
  border: 0px;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: textfield;
  transition-property: background-color, border-color, color, fill, stroke,
    opacity, box-shadow, transform;
  transition-duration: 200ms;
  color: #fff;
  font-size: 20px;
  padding-inline: 0px;
  height: ${(props) => (props.height ? props.height : "58px")};
  background: transparent;
  line-height: 28px;
  writing-mode: horizontal-tb !important;
  display: flex;
  align-items: center;
  justify-content: flex-start;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    display: none;
  }
`;

export const Box = styled.div`
  display: flex;
  width: ${(props) => (props.width ? props.width : "100%")};
  height: ${(props) => (props.height ? props.height : "fit-content")};
  background-color: ${(props) => (props.color ? props.color : "transparent")};
  border: ${(props) => (props.border ? props.border : "none")};
  border-radius: ${(props) => (props.radius ? props.radius : "8px")};
  padding: ${(props) => (props.padding ? props.padding : "0")};
  margin: ${(props) => (props.margin ? props.margin : "0")};
  flex-direction: ${(props) => (props.direction ? props.direction : "row")};
  align-items: ${(props) => (props.align ? props.align : "center")};
  justify-content: ${(props) => (props.justify ? props.justify : "inherit")};
  gap: ${(props) => (props.gap ? props.gap : "0")};
  opacity: ${(props) => (props.opacity ? props.opacity : "1")};
`;
