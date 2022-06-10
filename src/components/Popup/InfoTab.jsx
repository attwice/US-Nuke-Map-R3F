import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import gsap from "gsap";

const transitionTime = `0.5s`;

const Layout = styled.div`
  position: relative;
  padding: 0.25rem;
  padding-right: 0;
  border-top-left-radius: 5rem;
  border-bottom-left-radius: 5rem;
  background: ${({ hovered }) =>
    hovered
      ? `orange`
      : `linear-gradient(to right ,white 50%, transparent 50%)`};
  background-size: 200% 100%;
  background-position: 100%;
  user-select: none;
  opacity: 0;
  overflow: hidden;
`;

const InnerWrapper = styled.button`
  position: relative;
  cursor: pointer;
  background: linear-gradient(
    to left,
    rgb(0, 0, 40),
    rgb(149, 147, 255),
    rgb(0, 0, 200),
    rgb(0, 0, 100)
  );
  background-size: 200% 100%;
  background-position: ${({ hovered }) => (hovered ? `0%` : `100%`)};
  box-sizing: border-box;
  border-top-left-radius: 5rem;
  border-bottom-left-radius: 5rem;
  color: ${({ hovered }) => (hovered ? `rgb(255, 94, 0)` : `white`)};
  text-shadow: 0rem 0rem 0.5rem ${({ hovered }) => (hovered ? `none` : `black`)};
  height: 6.5rem;
  width: 18.5rem;
  padding: 0.3rem;
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 0.5rem;
  border: none;
  transition: background ${transitionTime} ease,
    background-position ${transitionTime} ease, color ${transitionTime} ease,
    text-shadow ${transitionTime} ease;
`;

const ImageSection = styled.div`
  height: 100%;
  aspect-ratio: 1/1;
  border-radius: 50%;
  border-width: 0.25rem;
  border-style: solid;
  border-color: ${({ hovered }) =>
    hovered ? `rgb(255, 94, 0)` : `rgb(250, 250, 250)`};
  box-shadow: ${({ hovered }) => (hovered ? `0rem 0rem 0.5rem black` : `none`)};
  transition: border-color ${transitionTime} ease,
    box-shadow ${transitionTime} ease;
  overflow: hidden;
  display: grid;
  place-content: center;
  padding: 0;
  margin: 0;
`;

const SiteImg = styled.img`
  width: 100%;
  aspect-ratio: 1/1;
  border-radius: 50%;
  object-fit: cover;
`;

const InfoSection = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Title = styled.h3`
  text-align: left;
  font-size: 1.25em;
`;

const LocationInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: 0.35rem;
`;

const StateImg = styled.img`
  width: 2.5rem;
  filter: invert(81%) sepia(21%) saturate(742%) hue-rotate(69deg)
    brightness(81%) contrast(84%);
`;

const City = styled.h5`
  font-style: italic;
  text-align: center;
`;

const InfoTab = ({ name, pic, city, state, lat, long, region, clicked }) => {
  const tabRef = useRef();

  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      tabRef.current,
      { opacity: 0, x: `100%` },
      { opacity: 1, x: `0%`, duration: 0.25 }
    );
    tl.to(tabRef.current, {
      backgroundPositionX: `0%`,
      ease: "expo.out",
      duration: 1
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <Layout id={`InfoTab`} hovered={hovered} ref={tabRef}>
      <InnerWrapper
        onClick={clicked}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        hovered={hovered}
      >
        <ImageSection hovered={hovered}>
          <SiteImg src={`/pics/sites/${pic}.jpg`} hovered={hovered} />
        </ImageSection>
        <InfoSection>
          <Title>{name}</Title>

          <LocationInfo>
            <StateImg src={`/pics/states/${state}.svg`} />
            <City>{city}</City>
          </LocationInfo>
        </InfoSection>
      </InnerWrapper>
    </Layout>
  );
};

export default InfoTab;
