import React, {useContext, useEffect, useState} from 'react'
import styled from 'styled-components'
import { Canvas } from '@react-three/fiber'

import Scene from './Scene'
import ButtonContainer from './components/ButtonContainer/ButtonContainer'
import InfoPanel from './components/InfoPanel/InfoPanel'
import InfoTab from './components/Popup/InfoTab'
import PowerTab from './components/Popup/PowerTab/PowerTab'
import ConnectionLine from './components/ConnectionLine/ConnectionLine'

import { useContextBridge } from '@react-three/drei'
import { SelectedSiteContext } from './contexts/SelectedSiteContext'
import { RotationContext } from './contexts/RotationContext'

const Layout = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`

const Container = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
  display: grid;
  place-items: center;
`

const PopupHolder = styled.div`
  position: absolute;
  top: 1.5rem;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: end;
  row-gap: 0.2rem;
`

const PowerHolder = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;  
`

const ButtonLayout = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  row-gap: .5rem;
`

const Disclaimer = styled.h5`
  color: white;
  font-size: 0.65em;
  
  & a{
    color: orange;
  }
`

const Attribution = styled(Disclaimer)``

const PowerDate = styled(Disclaimer)`
  position: absolute;
  top: 0;
  right: 0;
`

const App = () => {

  const {isRotationCompleted} = useContext(RotationContext)
  const {allSiteData, hoveredSiteData, powerDataDate, selectedSiteIndex, selectedSiteData, selectedSitePositionData, selectedSiteIndexHandler} = useContext(SelectedSiteContext)
  
  const ContextBridge = useContextBridge(RotationContext, SelectedSiteContext)

  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)
  const [infoPanelShow, setInfoPanelShow] = useState(false)

  const selectorClickHandler = (selector) => {
        
    switch (selector) {
      case "prev":
        let prevIndex = selectedSiteIndex - 1
        if(prevIndex < 0) return
        selectedSiteIndexHandler(prevIndex)
        break;
    
      default:
        let nextIndex = selectedSiteIndex + 1
        if(nextIndex > allSiteData.length - 1) return
        selectedSiteIndexHandler(nextIndex)
        break;
    }
  }

  useEffect(() => {
    
    if(!allSiteData) return

    let indexToSet = selectedSiteIndex

    if(selectedSiteIndex <= 0) {
      setCanPrev(false)
      indexToSet = 0
    }else{
      setCanPrev(true)
    }

    if(selectedSiteIndex >= allSiteData.length - 1){
      setCanNext(false)
      indexToSet = allSiteData.length - 1
    }else{
      setCanNext(true)
    }

    selectedSiteIndexHandler(indexToSet)

  },[selectedSiteIndex])

  const infoPanelClickHandler = () => {
    setInfoPanelShow(false)
  }

  const infoTabClickHandler = () => {
    setInfoPanelShow(true)
  }

  let popupSelector = null
  let powerInfo = null
  let infoPanel = null

  if(selectedSiteData && isRotationCompleted){

    let name = selectedSiteData.site
    let code = selectedSiteData.code
    let pic = selectedSiteData.pic
    let state = selectedSiteData.stateAbrv
    let city = selectedSiteData.city
    let lat = selectedSiteData.latitude
    let long = selectedSiteData.longitude
    let region = selectedSiteData.region
    let units = selectedSiteData.units

    if(hoveredSiteData){
      name = hoveredSiteData.site
      code = hoveredSiteData.code
      pic = hoveredSiteData.pic
      state = hoveredSiteData.stateAbrv
      city = hoveredSiteData.city
      lat = hoveredSiteData.latitude
      long = hoveredSiteData.longitude
      region = hoveredSiteData.region
      units = hoveredSiteData.units
    }

    popupSelector = (      
      <InfoTab
          key={code}
          name={name}
          code={code}
          pic={pic}
          state={state}
          city={city}
          lat={lat}
          long={long}
          region={region}
          rotationCompleted={isRotationCompleted}
          clicked={infoTabClickHandler}
        />      
    )

    powerInfo = (
      <PowerHolder>
        {units.map((unitData, index) => {
          return (
            <PowerTab
              key={`${name}${unitData.unit}`}
              index={index}
              unit={unitData.unit}
              powerData={unitData.power}
              rotationCompleted={isRotationCompleted}
            />
          )
        })} 
      </PowerHolder>
    )
    
    infoPanel = (
      <InfoPanel
        key={selectedSiteData.code}
        isShown={infoPanelShow}
        closeClick={infoPanelClickHandler}
        data={selectedSiteData}
      />
    )
  }

  let lineConnection = null

  if(selectedSitePositionData && isRotationCompleted && popupSelector){
    lineConnection= (
      <ConnectionLine
        startPos={selectedSitePositionData}
      />
    )
  }

  return (
    <Layout>
      <Container>
        <Canvas
          camera={{
            fov: 20
          }}
        >
          <ContextBridge>
            <Scene/>
          </ContextBridge>
        </Canvas>
      </Container>

      <PowerDate>
        Power data is for:  <a href="https://www.nrc.gov/reading-rm/doc-collections/event-status/reactor-status/powerreactorstatusforlast365days.txt">{powerDataDate}</a>
      </PowerDate>

      {lineConnection}
      <PopupHolder
        id={`popup-holder`}
      >
        {popupSelector}
        {powerInfo}
      </PopupHolder>
      <ButtonLayout>
        <Attribution>
          State Icons made from <a href="http://www.onlinewebfonts.com/icon">Icon Fonts</a> is licensed by CC BY 3.0
        </Attribution>
        <ButtonContainer
          canPrev={canPrev}
          canNext={canNext}
          selectorClick={selectorClickHandler}
        />

      </ButtonLayout>
        {infoPanel}          
    </Layout>
  )
}

export default App
