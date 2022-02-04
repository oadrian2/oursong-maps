import styled from "@emotion/styled";
import { TokenColor } from "../api/types";

const colorMap: { [key in TokenColor]: string } = {
  red: '#d32f2f',
  green: '#00796b',
  blue: '#1976d2',
  yellow: '#ffeb3b',
  cyan: '#3bf8ff',
  magenta: '#ff3bf8',
};

export const BorderLayer = styled.div`
  position: absolute;

  border: 4px solid transparent;
  border-color: ${({ color }: { color: TokenColor }) => colorMap[color]};

  background: black;
  color: transparent;

  border-radius: 50%;

  width: 100%;
  height: 100%;
`;
