import { useFrame, useLoader } from "@react-three/fiber"
import React, { useMemo, useRef } from "react"
import {DoubleSide, MathUtils} from 'three'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader'

const Disc = (props) => {

    const discRef = useRef()
    const markerRef = useRef()
    const outlineRef = useRef()

    const [markerSVG, outlineSVG] = useLoader(SVGLoader, ['/textures/marker/marker.svg', '/textures/marker/outline.svg'])

    const [markerSVGPath] = markerSVG.paths
    const [outlineSVGPath] = outlineSVG.paths

    const markerShape = useMemo(() => SVGLoader.createShapes(markerSVGPath),[])

    const outlineGeometry = useMemo(() => SVGLoader.pointsToStroke(outlineSVGPath.subPaths[0].getPoints(), outlineSVGPath.userData.style),[])

    const dampFactor = 4

    useFrame(({clock}, delta) => {
        const time = clock.getElapsedTime()
        const scale = Math.sin(time * 2) * 0.15 + 1.2
        markerRef.current.position.z = MathUtils.damp(markerRef.current.position.z, props.isSelected ? 0.1 : 0, dampFactor, delta)

        outlineRef.current.scale.x = props.isSelected ? scale : 1
        outlineRef.current.scale.y = props.isSelected ? scale : 1
    })

  return (
    <group
        ref={discRef}
        rotation={[Math.PI, 0, 0]}
        {...props}
      >
        <mesh
            ref={markerRef}
        >
            <shapeBufferGeometry
                args={markerShape}
            />
            <meshBasicMaterial
                color={props.isSelected ? `orange` : props.isHovered? `rgb(140, 138, 255)` : `white`}                
                side={DoubleSide}
                transparent
            />
        </mesh>
        <mesh
            geometry={outlineGeometry}
            ref={outlineRef}
        >
            <meshBasicMaterial
                color={props.isSelected ? `rgb(255, 0, 255)` : props.isHovered ? `rgb(250, 250, 255)` : `blue`}
            />
        </mesh>
    </group>
  )
}

export default Disc;
