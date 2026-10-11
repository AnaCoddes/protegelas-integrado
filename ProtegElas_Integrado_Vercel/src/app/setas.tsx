// Setas ("Avançar"/"Próximo") e futuramente outros símbolos

import Svg, { Path } from "react-native-svg";

type SetasProps = {
  width?: number;
  height?: number;
  color?: string;
};

export default function Setas ({
  width = 75,
  height = 55,
  color = "#66268C",
}: SetasProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 75 55">
      <Path
        d="M10 8 L30 27.5 L10 47"
        fill="none"
        stroke= {color}
        strokeWidth={8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <Path
        d="M35 8 L55 27.5 L35 47"
        fill="none"
        stroke={color}
        strokeWidth={8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
