import { useFrame } from '@react-three/fiber'
import React, {useEffect, useRef, useState} from 'react'
import {DoubleSide, MathUtils} from 'three'
import Disc from './Disc'
// import Highlight from './Highlight'
// import Particles from './Particles'

// const disc_scale = 0.05

// const marker_scale = disc_scale

// const highlight_bottom_radius = 1
// const highlight_top_radius = 1
// const highlight_height = 1
// const highlight_count = 5000
// const highlight_scale = marker_scale * 0.5
// const highlight_height_scale = 0.5

// const positions = new Float32Array(highlight_count * 3)
// const speed = new Float32Array(highlight_count)
// const size = new Float32Array(highlight_count)

// const weightedRandom = (max, numDice) => {
//   let num = 0
//   for (let i = 0; i < numDice; i++){
//     num += Math.random() * (max/numDice)
//   }
//   return num
// }

// const createPoints = () => {

//   for (let i = 0; i < positions.length; i+=3) {
    
//     // Position
//     positions[i] = weightedRandom(highlight_bottom_radius, 2) - highlight_bottom_radius/2
//     positions[i + 1] = (Math.random() * highlight_height)
//     positions[i + 2] = weightedRandom(highlight_bottom_radius, 2) - highlight_bottom_radius/2

//     size[i/3] = Math.pow(1.2, 10 * (1.0 - (Math.max(Math.abs(positions[i]), Math.abs(positions[i + 2])))))
//     speed[i/3] = (Math.random() + 1)/size[i/3]
//   }
// }

// createPoints()

const Marker = ({position, center, index, selected, clicked,markerHoveredIndex, markerHoveredHandler, markerIndexHoveredHandler, markerSelected, isRotationCompleted}) => {  
  const markerRef = useRef()

  const [hovered, setHovered] = useState(false)

    useEffect(() => {
      if(!markerRef.current) return

      markerRef.current.lookAt(center)
    },[])

    useEffect(() => {
      if(!isRotationCompleted) return

      if(hovered){
        markerHoveredHandler(markerRef.current)
        markerIndexHoveredHandler(index)
        return
      }

      if(markerHoveredIndex === index){
        markerHoveredHandler(null)
        markerIndexHoveredHandler(-1)
        return
      }
      
    },[hovered, isRotationCompleted])

    useEffect(() => {
      if(!selected)return

      markerSelected(markerRef.current)
    }, [selected])

    const hoveredHandler = (isHovered) => {
      setHovered(isHovered)
    }

    const clickedHandler = (index) => {
      clicked(index)
    }

    const normalScale = 1
    const hoverScale = 1
    const selectScale = 2
    const dampFactor = 4

    useFrame((_, delta) => {

        markerRef.current.scale.x = MathUtils.damp(markerRef.current.scale.x, selected ? selectScale : hovered ? hoverScale : normalScale, dampFactor, delta)
        markerRef.current.scale.y = MathUtils.damp(markerRef.current.scale.y, selected ? selectScale : hovered ? hoverScale : normalScale, dampFactor, delta)
        markerRef.current.scale.z = MathUtils.damp(markerRef.current.scale.z, selected ? selectScale : hovered ? hoverScale : normalScale, dampFactor, delta)
    })

    // let highlight = null
// 
    // if(cardSelected || hovered){
    //   highlight = (
    //     <group
    //       style={{
    //         pointEvents: `none`
    //       }}
    //     >

    //       <Highlight
    //         bottomRadius={highlight_bottom_radius}
    //         height={highlight_height}
    //         rotation={[-Math.PI/2, 0, 0]}
    //         position={[0, 0, -(highlight_height * highlight_height_scale)/2]}
    //         scale={[highlight_scale/2, highlight_height_scale, highlight_scale/2]}
    //       />

    //       <Particles
    //         bottomRadius={highlight_bottom_radius}
    //         topRadius={highlight_top_radius}
    //         height={highlight_height}
    //         positionsData={positions}
    //         speedData={speed}
    //         sizeData={size}
    //         rotation={[Math.PI/2, 0, 0]}
    //         position={[0, 0, 0]}
    //         scale={[highlight_scale, highlight_height_scale, highlight_scale]}
    //       />

    //     </group>
    //   )
    // }

  return (
    <group
      ref={markerRef}
      position={position}
      onPointerEnter={() => hoveredHandler(true)}
      onPointerLeave={() => hoveredHandler(false)}
      onClick={() => clickedHandler(index)}
    >
      <Disc
        side={DoubleSide}          
        center={center}
        scale={0.0005}
        isSelected={selected}
        isHovered={hovered && isRotationCompleted}
      />
      {/* {highlight} */}
    </group>
  )
}

export default Marker
