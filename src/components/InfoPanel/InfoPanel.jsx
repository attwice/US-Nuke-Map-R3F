import { BsBoxArrowInLeft } from "react-icons/bs";
import React, { useRef } from "react";
import styled from "styled-components";

import PowerDisplay from "./PowerDisplay";

const showDelay = 0.5;

const Layout = styled.div`
  position: absolute;
  padding: 0.2rem;
  top: 0;
  left: ${(props) => (props.shown ? `0` : `-100%`)};
  width: 100%;
  height: 100%;
  color: white;
  background: rgba(25, 25, 25, 0.8);
  backdrop-filter: blur(0.9rem);
  z-index: 99;
  display: grid;
  grid-template-areas:
    "info"
    "units";
  grid-template-columns: 100%;
  grid-template-rows: auto 1fr;
  gap: 0.25rem;
  opacity: ${(props) => (props.shown ? 1 : 0)};
  overflow: hidden;
  transition: all ${showDelay}s ease;
`;

const Display = styled.div`
  border-radius: 0.5rem;
`;

const InformationDisplay = styled.div`
  width: 100%;
  grid-area: info;
  display: grid;
  grid-template-areas: "img title";
  gap: 0.25rem;
  grid-template-columns: auto 1fr;

  @media (max-width: 500px) {
    grid-template-areas:
      "img"
      "title";
    grid-template-columns: 100%;
    grid-template-rows: repeat(2, auto);
  }
`;

const ImageDisplay = styled(Display)`
  position: relative;
  grid-area: img;
  max-width: 15rem;
  border: 0.2rem solid white;
  overflow: hidden;
  margin: 0 auto;
`;

const LocationDisplay = styled(Display)`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  padding: 0.25rem;
  grid-area: loc;
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 0;
`;

const StateImg = styled.img`
  width: 2.5rem;
  filter: invert(81%) sepia(21%) saturate(742%) hue-rotate(69deg)
    brightness(81%) contrast(84%);
`;

const TitleDisplay = styled(Display)`
  grid-area: title;
  width: 100%;
  padding: 1rem;
  display: grid;
  place-content: center;
  border: 0.2rem solid white;
  text-align: center;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0.25%;
  right: 0.25%;
  padding: 0.25rem 0.75rem;
  cursor: pointer;
  border-radius: 0.5rem;
  border: 0.2rem solid white;
  background: rgb(255, 0, 0);
  color: white;
  transition: all 300ms ease;

  &:hover,
  &:focus {
    background: orange;
  }
`;

const UnitInformationDisplayArea = styled.div`
  grid-area: units;
  width: 100%;
  height: 100%;
  display: flex;
  margin-left: auto;
  margin-right: auto;
  overflow-x: auto;
`;

const UnitInformationDisplayWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-right: auto;
  margin-left: auto;
  column-gap: 0.5rem;
  height: 100%;
`;

const UnitInformationDisplay = styled.div`
  height: 100%;
  width: min(80vw, 20rem);
  display: grid;
  grid-auto-flow: row;
  grid-template-rows: auto 1fr;
  grid-template-columns: auto;
  border-radius: 0.5rem;
  border: 0.2rem solid white;
`;

const UnitLabelHead = styled.a`
  display: grid;
  place-content: center;
  width: 100%;
  padding: 0.5rem 0.2rem;
  background: rgb(0, 0, 255);
  text-decoration: none;
  color: rgb(255, 255, 255);
  transition: background 300ms ease, color 300ms ease;

  &:hover {
    background: orange;
    color: rgb(0, 0, 255);
  }
`;

const UnitLabel = styled.h3`
  font-size: 1.5em;
  font-weight: 900;
`;

const UnitInformationBody = styled.div`
  padding: 0.5rem 0.2rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InfoPanel = ({ isShown, closeClick, data }) => {
  const ref = useRef();

  let headerInfo = null;
  let dataDisplay = null;

  if (data && isShown) {
    headerInfo = (
      <InformationDisplay>
        <ImageDisplay>
          <img
            src={`/pics/sites/${data.pic}.jpg`}
            width={`100%`}
            alt={data.site}
          />
          <LocationDisplay>
            <StateImg src={`/pics/states/${data.stateAbrv}.svg`} />
            <p>{data.city}</p>
          </LocationDisplay>
        </ImageDisplay>
        <TitleDisplay>
          <h2>{data.site}</h2>
        </TitleDisplay>
      </InformationDisplay>
    );

    dataDisplay = data.units.map((unit, index) => {
      return (
        <UnitInformationDisplay key={`${data.code}${unit.unit}`}>
          <UnitLabelHead
            href={`${unit.link}`}
            target={`_blank`}
            rel={`noreferrer noopener`}
          >
            <UnitLabel>UNIT {unit.unit}</UnitLabel>
          </UnitLabelHead>

          <UnitInformationBody>
            <PowerDisplay power={unit.power} delay={showDelay + 0.25 * index} />
          </UnitInformationBody>
        </UnitInformationDisplay>
      );
    });
  }

  return (
    <Layout shown={isShown} ref={ref}>
      {headerInfo}
      <CloseButton onClick={() => closeClick()}>
        <BsBoxArrowInLeft size={40} />
      </CloseButton>
      <UnitInformationDisplayArea>
        <UnitInformationDisplayWrapper>
          {dataDisplay}
        </UnitInformationDisplayWrapper>
      </UnitInformationDisplayArea>
    </Layout>
  );
};

export default InfoPanel;
