import React, {useEffect, useRef} from 'react'
import styled from 'styled-components'
import gsap from 'gsap'
import {BsLightningFill} from 'react-icons/bs'

const Layout = styled.div`
    position: absolute;
    user-select: none;
    top: 0;
    right: 0.5rem;
    opacity: 0;
    width: 15.5rem;
    height: 3rem;
    display: flex;
    flex-direction: row;
    justify-content: end;
    padding: 0rem 0.5rem;
`

const UnitLabel = styled.div`
    position: absolute;
    top: 50%;
    left: 0;
    height: 80%;
    aspect-ratio: 1/1;
    background: blue;
    border-radius: 50%;
    display: grid;
    place-content: center;
    color: white;
    border: 0.2rem solid white;
    transform: translateY(-50%);
    font-weight: 900;
`

const BarArea = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    width: 80%;
    background: linear-gradient(to left, rgb(0, 0, 90), rgb(102, 99, 255));
    border-radius: 0.5rem;
    border: 0.2rem solid white;
    transform: skewX(-15deg);
    overflow: hidden;
`

const Bar = styled.div`    
    height: 100%;
    width: 100%;
    background: black;
    transform-origin: left center;
`

const PowerLabel = styled.div`
    position: absolute;
    width: 4rem;
    top: 0;
    right: 0;
    color: white;
    border-bottom-left-radius: 0.5rem;
    border: 0.2rem solid white;
    border-right: none;
    border-top: none;
    background: blue;
    font-size: 1.2em;
    font-weight: 900;
    display: grid;
    place-content: center;
`

const PowerTab = ({index, unit = 'N/A', powerData = 0}) => {
  
    const ref = useRef()
    const barRef = useRef()
    const numberRef = useRef()
    
    const startPosition = 100 + 100 * index
    const endPosition = index * 80
    const scaleFactor = 100 - powerData

    useEffect(() => {
        const tl = gsap.timeline()

        const duration = 0.25
        const delay = 0.25 * index

        tl.fromTo(ref.current,
            {opacity: 0, y: `${startPosition}%`},
            {opacity: 1, y: `${endPosition}%`, duration: duration, delay: delay}
            )
        tl.fromTo(barRef.current,
            {scaleX: `100%` },
            {scaleX: `${scaleFactor}%`, duration: duration, delay: 0.1}
            )
        tl.from(numberRef.current,
                {
                    textContent: `0%`,
                    duration: duration,
                    snap: {
                        textContent: 1
                    }
                    
                },`-=0.5`
            )
        return () => {
            tl.kill()
        }
    }, [])
  
    return (
    <Layout index={index} ref={ref}>
        <UnitLabel>{unit}</UnitLabel>
        <BarArea>
        <Bar ref={barRef}/>
        <PowerLabel ref={numberRef}>
            {powerData}%
        </PowerLabel>
         <BsLightningFill style={{
             position: `absolute`,
             top: `50%`,
             left: `5%`,
             color: `rgb(255, 255, 0)`,
             textShadow: `0rem 0rem 0.5rem black`,
             transform: `translateY(-50%)`
             }}/>
        </BarArea>
    </Layout>
  )
}

export default PowerTab