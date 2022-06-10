import { useFrame } from "@react-three/fiber";
import { Instance } from "@react-three/drei";
import React, { useEffect, useRef, useState } from "react";
import { MathUtils } from "three";

const NppMarker = ({
  position,
  color,
  index,
  selected,
  clicked,
  markerHoveredIndex,
  markerHoveredHandler,
  markerIndexHoveredHandler,
  markerSelected,
  isRotationCompleted
}) => {
  const markerRef = useRef();

  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!markerRef.current) return;
    markerRef.current.rotation.y = Math.PI / 2.25;
  }, []);

  useEffect(() => {
    if (!isRotationCompleted) return;

    if (hovered) {
      markerHoveredHandler(markerRef.current);
      markerIndexHoveredHandler(index);
      return;
    }

    if (markerHoveredIndex === index) {
      markerHoveredHandler(null);
      markerIndexHoveredHandler(-1);
      return;
    }
  }, [hovered, isRotationCompleted]);

  useEffect(() => {
    if (!selected) return;

    markerSelected(markerRef.current);
  }, [selected]);

  const hoveredHandler = (isHovered) => {
    setHovered(isHovered);
  };

  const clickedHandler = (index) => {
    clicked(index);
  };

  const normalScale = 0.01;
  const hoverScale = normalScale * 1.2;
  const selectScale = normalScale * 2;
  const dampFactor = 4;

  useFrame((_, delta) => {
    markerRef.current.scale.x = MathUtils.damp(
      markerRef.current.scale.x,
      selected ? selectScale : hovered ? hoverScale : normalScale,
      dampFactor,
      delta
    );
    markerRef.current.scale.y = MathUtils.damp(
      markerRef.current.scale.y,
      selected ? selectScale : hovered ? hoverScale : normalScale,
      dampFactor,
      delta
    );
    markerRef.current.scale.z = MathUtils.damp(
      markerRef.current.scale.z,
      selected ? selectScale : hovered ? hoverScale : normalScale,
      dampFactor,
      delta
    );
    markerRef.current.color.lerp(
      color.set(
        selected
          ? `rgb(255, 100, 0)`
          : hovered
          ? `rgb(0, 100, 255)`
          : `rgb(200, 200, 200)`
      ),
      0.25
    );
  });

  return (
    <Instance
      ref={markerRef}
      position={position}
      onPointerEnter={(e) => {
        e.stopPropagation();
        hoveredHandler(true);
      }}
      onPointerLeave={(e) => hoveredHandler(false)}
      onClick={() => clickedHandler(index)}
      scale={normalScale}
      isSelected={selected}
      isHovered={hovered && isRotationCompleted}
    />
  );
};

export default NppMarker;
