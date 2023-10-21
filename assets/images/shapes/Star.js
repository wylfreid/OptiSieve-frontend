import * as React from "react";
import Svg, { G, Path, Defs, ClipPath, Rect } from "react-native-svg";

export default function Star(props) {
  return (
    <Svg {...props} viewBox="0 0 21 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M10.5 0L12.8574 7.25532H20.4861L14.3143 11.7394L16.6717 18.9947L10.5 14.5106L4.32825 18.9947L6.68565 11.7394L0.513906 7.25532H8.1426L10.5 0Z" fill="#0072F7"/>
    </Svg>
  );
}
