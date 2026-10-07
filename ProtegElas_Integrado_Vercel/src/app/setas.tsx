// Setas ("Avançar"/"Próximo") e futuramente outros símbolos

import Svg, { Path } from "react-native-svg";

export default function Setas() {
  return (
    <Svg width={75} height={55} viewBox="0 0 75 55">
      <Path
        d="M10 8 L30 27.5 L10 47"
        fill="none"
        stroke="#66268C"
        strokeWidth={8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <Path
        d="M35 8 L55 27.5 L35 47"
        fill="none"
        stroke="#66268C"
        strokeWidth={8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
