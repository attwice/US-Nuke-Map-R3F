import React, {useMemo} from 'react'
import {Color, TextureLoader} from 'three'
import { useFrame, useLoader } from '@react-three/fiber'

import { ParticlesMaterial } from './ParticlesMaterial'

const Particles = (props) => {
  
    const particleTextureMap = useLoader(TextureLoader, `/textures/particles/particle_1.png`)

    const uniforms = useMemo(() => ({
      uTexture: { value: particleTextureMap},
      uTime: { value: 0.0 },
      uMaxHeight: { value: props.height},
      uColor: { value: new Color(`orange`) },
    }), [])
  
  useFrame(({clock})=>{
    const t = clock.getElapsedTime()
    uniforms['uTime'].value = t
  })

    return(
    <points
        sizeAttenuation={true}
        {...props}
    >
        <cylinderBufferGeometry
        args={[props.bottomRadius, props.topRadius, props.height, 32.0]}
        >
            <bufferAttribute attachObject={['attributes', 'position']} args={[props.positionsData, 3]} />
            <bufferAttribute attachObject={['attributes', 'aSpeed']} args={[props.speedData, 1]} />
            <bufferAttribute attachObject={['attributes', 'aSize']} args={[props.sizeData, 1]} />
        </cylinderBufferGeometry>
        
        <particlesMaterial
            uniforms={uniforms}
            depthWrite={false}
            transparent
        />
    </points>
  )
}

export default Particles