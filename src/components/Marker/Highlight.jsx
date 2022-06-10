import { useFrame } from '@react-three/fiber'
import React, {useMemo} from 'react'
import {Color, DoubleSide} from 'three'

import { HighlightMaterial } from './HighlightMaterial'

const Highlight = (props) => {
  
    const uniforms = useMemo(() => ({
        uTime: {value: 0.0},
        uColor: { value: new Color(`orange`)}
    }), [])
  
    useFrame(({clock}) => {
        const t = clock.getElapsedTime()
        uniforms.uTime.value = t
    })

    return (
      <group
        {...props}
      >
        <mesh>
          <coneBufferGeometry
            args={[props.bottomRadius, props.height, 16, 32, true]}
          />
          <highlightMaterial
            side={DoubleSide}
            uniforms={uniforms}
            transparent
          />
          <mesh
            scale={[0.5, 0.5, 0.5]}
            position={[0, -0.25, 0]}
            
          >
            <coneBufferGeometry
              args={[props.bottomRadius, props.height, 16, 8]}
            />
            <meshBasicMaterial
              color={`white`}
            />
          </mesh>
        </mesh>
        </group>
    )
};

export default Highlight;
