import React from 'react'
import { Bloom, EffectComposer } from '@react-three/postprocessing'

const Effect = () => {
  return (
    <EffectComposer
    >
        <Bloom
        />
    </EffectComposer>
    )
}

export default Effect
