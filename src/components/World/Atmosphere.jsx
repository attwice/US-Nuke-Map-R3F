import React from 'react'
import {AdditiveBlending, BackSide} from 'three'

import { WorldAtmosphereMaterial } from './WorldAtmosphereMaterial'

const World = (props) => {
    
    return (      
        <mesh
            {...props}
        >
            <sphereBufferGeometry args={[props.radius, 64, 64]}/>
            <worldAtmosphereMaterial
                blending={AdditiveBlending}
                side={BackSide}
                transparent
            />
        </mesh>
 
    )
}

export default World