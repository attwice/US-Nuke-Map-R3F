import React, {useRef} from 'react'
import {BackSide, Color, TextureLoader} from 'three'
import { useLoader } from '@react-three/fiber'

import { WorldAtmosphereMaterial } from './WorldAtmosphereMaterial'

const World = (props) => {
    const sphereScale = 1

    const earthRef = useRef()

    const [earthMap, earthBumpMap, earthSpecMap] = useLoader(TextureLoader, [`/textures/earth/earthmap2k.jpg`, `/textures/earth/earthbump2k.jpg`, `/textures/earth/earthspec2k.jpg`])
    
    return (
        


            <mesh
                ref={earthRef}
                scale={sphereScale}
                {...props}
            >
            <sphereBufferGeometry args={[props.radius, 64, 64]}/>
            <meshPhongMaterial
                map={earthMap}
                bumpMap={earthBumpMap}
                specularMap={earthSpecMap}
                transparent={false}
                />
            </mesh>
 
    )
}

export default World
