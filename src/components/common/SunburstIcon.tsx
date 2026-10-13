import React from 'react';
import Svg, { Circle, Line, G } from 'react-native-svg';
import { colors } from '../../theme/tokens';

type Props = {
  size?: number;
  color?: string;
};

export const SunburstIcon: React.FC<Props> = ({ size = 38, color = colors.tangerine }) => {
  const center = size / 2;
  const radius = size * 0.17;
  const innerRay = size * 0.25;
  const outerLongRay = size * 0.46;
  const outerShortRay = size * 0.37;

  const rayCount = 16;
  const rays = Array.from({ length: rayCount }, (_, i) => {
    const angle = (i * 2 * Math.PI) / rayCount;
    const isLong = i % 2 === 0;
    const outerRay = isLong ? outerLongRay : outerShortRay;
    const x1 = center + innerRay * Math.cos(angle);
    const y1 = center + innerRay * Math.sin(angle);
    const x2 = center + outerRay * Math.cos(angle);
    const y2 = center + outerRay * Math.sin(angle);
    return (
      <Line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={size * (isLong ? 0.065 : 0.055)}
        strokeLinecap="round"
      />
    );
  });

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Circle cx={center} cy={center} r={radius} fill={color} />
      <G>{rays}</G>
    </Svg>
  );
};
