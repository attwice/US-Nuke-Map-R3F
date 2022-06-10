import { Instances, useGLTF } from '@react-three/drei'
import React from "react"
import {Color, DoubleSide} from 'three'
import NppMarker from './NppMarker'

const Markers = ({data, selected, clicked ,markerHoveredIndex, markerHoveredHandler, markerIndexHoveredHandler, markerSelected, isRotationCompleted}) => {
    const { nodes } = useGLTF('/models/npp/npp.gltf')
    const color = new Color()

    return (
    <Instances
        range={data.length}
        geometry={nodes.Plant.geometry}
    >
        <meshLambertMaterial
            side={DoubleSide}
        />

        {data.map(({name, code, position}, index) => {
            return (
                <NppMarker
                    key={name}
                    rotation={[Math.PI, 0, 0]}
                    index={index}
                    position={position}
                    color={color}
                    selected={code === selected}
                    clicked={clicked}
                    markerHoveredIndex={markerHoveredIndex}
                    markerHoveredHandler={markerHoveredHandler}
                    markerIndexHoveredHandler={markerIndexHoveredHandler}
                    markerSelected={markerSelected}
                    isRotationCompleted={isRotationCompleted}
                />
            )
        })}        
    </Instances>
  )
}

export default Markers

useGLTF.preload('/models/npp/npp.gltf')