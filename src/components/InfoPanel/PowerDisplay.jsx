import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import gsap from "gsap";

const Layout = styled.div`
  user-select: none;
  position: relative;
  max-width: 15rem;
`;

const SVG = styled.svg`
  position: relative;
  width: 100%;
`;

const Path = styled.path`
  stroke-width: 1.5rem;
  stroke-miterlimit: round;
`;

const Text = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.75em;
  font-weight: 900;
`;

const PowerDisplay = ({ power = 0, delay = 0 }) => {
  const powerChartRef = useRef();
  const fullMeterRef = useRef();
  const levelMeterRef = useRef();
  const powerTextRef = useRef();

  const tl = gsap.timeline();

  const setPath = (path) => {
    const length = path.getTotalLength();
    path.style.strokeDashoffset = length;
    path.style.strokeDasharray = length;
    return length * ((100 - power) / 100);
  };

  useEffect(() => {
    const animationDuration = 0.5;
    const to = setPath(levelMeterRef.current);

    tl.to(powerChartRef.current, {
      opacity: 1,
      duration: animationDuration,
      delay: delay
    });
    if (power > 0) {
      tl.to(levelMeterRef.current, {
        strokeDashoffset: to,
        duration: animationDuration
      });
      tl.from(
        powerTextRef.current,
        {
          textContent: `0%`,
          duration: animationDuration,
          snap: {
            textContent: 1
          }
        },
        `-=${animationDuration}`
      );
    }
  }, []);

  useEffect(() => {}, [levelMeterRef]);

  return (
    <Layout ref={powerChartRef}>
      <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 180">
        <Path
          ref={fullMeterRef}
          stroke="rgb(100, 100, 100)"
          d="M41 149.5a77 77 0 1 1 117.93 0"
          fill="none"
        />
        <Path
          ref={levelMeterRef}
          stroke="rgb(0, 200, 255)"
          d="M41 149.5a77 77 0 1 1 117.93 0"
          fill="none"
        />
      </SVG>

      <Text ref={powerTextRef}>{power}%</Text>
    </Layout>
  );
};

export default PowerDisplay;
