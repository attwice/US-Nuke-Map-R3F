import { Html } from '@react-three/drei'
import React from 'react'
import styled from 'styled-components'

const Layout = styled.div`
    padding: 0.25rem;
    border-radius: 5rem;
    border: 0.3rem solid rgb(50, 50, 50);
    background: rgb(200, 200, 200);
    height: 5rem;
    width: 17.5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: start;
    gap: 0.2rem;
`

const SiteImg = styled.img`
    border-radius: 50%;
    height: 100%;
    aspect-ratio: 1 / 1;
    border: 0.2rem solid rgb(120, 120, 120);
`

const Title = styled.h3`
    text-align: left;
`

const Popup = (props) => {
  
    return (
  <Html
    // transform
    // sprite
    // distanceFactor={0.75}
    // position={[0.75, 0.25, 0.5]}
    
    style={{
        visibility:`${props.visible ? `visible` : `hidden`}`,
        userSelect: `none`,
        transform: `translate(-100%, -125%)`,
        opacity: `${props.visible ? 1 : 0}`,
        transition: `opacity 300ms ease 300ms`
    }}
  >
      <Layout>
        <SiteImg src={`/pics/sites/${props["Pic File"]}.jpg`} />
        <Title>{props.name}</Title>
      </Layout>
      
  </Html>
  )
}

export default Popup;
