import React, { useContext, useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { AdditiveBlending, BackSide, Euler, MathUtils, Vector3 } from "three";
import { degToRad } from "three/src/math/MathUtils";

import { SelectedSiteContext } from "./contexts/SelectedSiteContext";

import World from "./components/World/World";
import Atmosphere from "./components/World/Atmosphere";
import Markers from "./components/Marker/Markers";

import Effect from "./components/Effect";
import { Stars } from "@react-three/drei";
import { RotationContext } from "./contexts/RotationContext";

const Scene = () => {
  const worldRadius = 2.5;
  const initialRotation = new Euler(Math.PI * 0.2, Math.PI * 0.225, -0.2);

  const {
    allSiteData,
    selectedSiteData,
    selectedSiteIndexHandler,
    selectedSitePositionDataHandler,
    hoveredSiteIndexHandler
  } = useContext(SelectedSiteContext);
  const { isRotationCompleted, rotationCompletionHandler } = useContext(
    RotationContext
  );

  const worldRef = useRef();

  const [data, setData] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [rotation, setRotation] = useState(new Euler(0, 0, 0));
  const [hoveredMarkerRef, setHoveredMarkerRef] = useState(null);
  const [hoveredMarkerIndex, setHoveredMarkerIndex] = useState(-1);
  const [markerSelected, setMarkerSelected] = useState(null);

  const { camera, viewport, size } = useThree();
  const scaleFactor = viewport.width / 2.5;
  const maxScale = 0.5;
  const minScale = 0.32;
  const scale =
    scaleFactor >= maxScale
      ? maxScale
      : scaleFactor <= minScale
      ? minScale
      : scaleFactor;

  const worldCenter = new Vector3(
    -viewport.width * 0.25,
    -viewport.height * 0.25,
    0
  );

  const adjustLatLong = (latitude, longitude) => {
    const phi = degToRad(90 - latitude);
    const theta = degToRad(180 + longitude);
    return { phi, theta };
  };

  const calculatePosition = (latitude, longitude) => {
    const { phi, theta } = adjustLatLong(latitude, longitude);

    const x = -Math.sin(phi) * Math.cos(theta);
    const y = Math.cos(phi);
    const z = Math.sin(phi) * Math.sin(theta);

    return new Vector3(x, y, z);
  };

  const hoveredMarkerIndexHandler = (markerIndex) => {
    setHoveredMarkerIndex(markerIndex);
  };

  const hoveredMarkerHandler = (markerRef) => {
    setHoveredMarkerRef(markerRef);
  };

  useEffect(() => {
    if (!allSiteData) return;
    setData(
      allSiteData.map((site) => {
        const latitude = parseFloat(site.latitude);
        const longitude = parseFloat(site.longitude);

        const position = calculatePosition(latitude, longitude).multiplyScalar(
          worldRadius + 0.03
        );
        const angles = adjustLatLong(latitude, longitude);
        const obj = {
          name: site.site,
          code: site.code,
          position: position,
          angles: angles,
          pic: site.pic
        };

        return obj;
      })
    );
    setDataLoaded(true);
  }, [allSiteData]);

  const worldPositionToScreenPosition = (position) => {
    const { width: sizeWidth, height: sizeHeight } = size;

    const pos = position.clone();

    pos.project(camera);

    const x = (pos.x + 1) * sizeWidth * 0.5;
    const y = (-pos.y + 1) * sizeHeight * 0.5;

    return { x: x, y: y };
  };

  const markerSelectedHandler = (markerRef) => {
    setMarkerSelected(markerRef);
  };

  useEffect(() => {
    if (!dataLoaded) return;
    const positionData = data.find(
      (site) => site.code === selectedSiteData.code
    );
    let x,
      y,
      z = 0;

    if (positionData) {
      const { phi, theta } = positionData.angles;

      x = -Math.round(Math.cos(2.25 - phi) * 1000) / 1000;
      y = Math.round(Math.cos(theta + 0.35) * 1000) / 1000;
      z = 0;
    }
    setRotation(new Euler(x, y, z));
    rotationCompletionHandler(false);
  }, [selectedSiteData, dataLoaded]);

  useEffect(() => {
    const positionVec = new Vector3();

    if (hoveredMarkerRef) {
      hoveredMarkerRef.getWorldPosition(positionVec);
    } else {
      if (!markerSelected) return;
      markerSelected.getWorldPosition(positionVec);
    }

    selectedSitePositionDataHandler(worldPositionToScreenPosition(positionVec));
  }, [hoveredMarkerRef]);

  useEffect(() => {
    hoveredSiteIndexHandler(hoveredMarkerIndex);
  }, [hoveredMarkerIndex]);

  useEffect(() => {
    if (!isRotationCompleted) {
      selectedSitePositionDataHandler(null);
    } else {
      if (!markerSelected) return;
      const positionVec = new Vector3();
      markerSelected.getWorldPosition(positionVec);
      selectedSitePositionDataHandler(
        worldPositionToScreenPosition(positionVec)
      );
    }
    rotationCompletionHandler(isRotationCompleted);
  }, [isRotationCompleted, viewport.width, viewport.height]);

  const dampeningFactor = 8;

  useFrame((_, delta) => {
    if (worldRef.current) {
      const xRot = MathUtils.damp(
        worldRef.current.rotation.x,
        rotation._x,
        dampeningFactor,
        delta
      );
      const yRot = MathUtils.damp(
        worldRef.current.rotation.y,
        rotation._y,
        dampeningFactor,
        delta
      );
      const zRot = MathUtils.damp(
        worldRef.current.rotation.z,
        rotation._z,
        dampeningFactor,
        delta
      );

      worldRef.current.rotation.x = xRot;
      worldRef.current.rotation.y = yRot;
      worldRef.current.rotation.z = zRot;

      if (!isRotationCompleted) {
        if (
          Math.round(worldRef.current.rotation.x * 1000) / 1000 ===
            rotation._x &&
          Math.round(worldRef.current.rotation.y * 1000) / 1000 ===
            rotation._y &&
          Math.round(worldRef.current.rotation.z * 1000) / 1000 === rotation._z
        ) {
          rotationCompletionHandler(true);
        }
      }
    }
  });

  return (
    <>
      <ambientLight intensity={0.35} color={`#aaaadd`} />
      <directionalLight
        position={[2, 3, 4]}
        intensity={0.75}
        color={`#ffffff`}
      />
      <Atmosphere
        radius={worldRadius}
        position={worldCenter}
        scale={scale + 0.035}
      />

      <group rotation={initialRotation} position={worldCenter} scale={scale}>
        <group ref={worldRef}>
          <World radius={worldRadius} />
          <Markers
            data={data}
            center={worldCenter}
            selected={selectedSiteData?.code}
            clicked={selectedSiteIndexHandler}
            markerHoveredIndex={hoveredMarkerIndex}
            markerHoveredHandler={hoveredMarkerHandler}
            markerIndexHoveredHandler={hoveredMarkerIndexHandler}
            markerSelected={markerSelectedHandler}
            isRotationCompleted={isRotationCompleted}
          />
        </group>
      </group>
      <Stars radius={10} depth={60} count={1000} factor={6} fade />
      {/* <Effect/> */}
    </>
  );
};

export default Scene;
