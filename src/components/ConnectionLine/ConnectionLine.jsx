import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import gsap from "gsap";

const SVG = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  user-select: none;
  pointer-events: none;
`;

const ConnectionLine = ({ startPos }) => {
  const polylineRef = useRef();

  useEffect(() => {
    const animationDuration = 1;
    const tl = gsap.timeline();

    tl.fromTo(
      polylineRef.current,
      { strokeDashoffset: Math.max(1000, viewportWidth) },
      { strokeDashoffset: 0, duration: animationDuration }
    );

    return () => {
      tl.kill();
    };
  }, [startPos]);

  let top,
    height,
    width = 0;

  const viewportWidth = window.visualViewport.width;
  const infoTab = document.querySelector(`#InfoTab`);

  if (infoTab) {
    const rect = infoTab.getBoundingClientRect();
    top = rect.top;
    height = rect.height;
    width = rect.width;
  }
  const { x: x1, y: y1 } = startPos;
  const x3 = viewportWidth - width;

  // const x2 = viewportWidth - width - 50
  const x2 =
    (x3 - x1) * 0.5 > 50 ? (x3 + x1) * 0.5 : viewportWidth - width - 50;
  const y2 = top + height * 0.5;

  const points = [x1, y1, x2, y2, x3, y2];

  return (
    <SVG>
      <polyline
        ref={polylineRef}
        points={points}
        fill="none"
        stroke="white"
        strokeWidth="0.2rem"
        strokeDashoffset={Math.max(1000, viewportWidth)}
        strokeDasharray={Math.max(1000, viewportWidth)}
      />
    </SVG>
  );
};

export default ConnectionLine;
