import React from 'react'
import styled from 'styled-components'
import {FaArrowAltCircleLeft, FaArrowAltCircleRight} from 'react-icons/fa'

const arrowIconSize = 50

const Layout = styled.div`
    width: 100%;
    display: grid;
    grid-auto-flow: rows;
    background: rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(0.5rem);
    z-index: 99;
`

const CardHolder = styled.div`    
    width: 100%;
    overflow: hidden;
`

const ButtonHolder = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.2rem;
`

const SelectorButton = styled.button`
    width: 100%;
    height: 5rem;
    cursor: pointer;
    color: rgb(255, 255, 255);
    background: transparent;
    border: 0.25rem solid rgb(255, 255, 255);
    /* border-radius: 1rem; */
    transition: 300ms all ease;

    &:disabled{
        cursor: not-allowed;
        color: rgba(50, 50, 50, 0.5);
        border-color: rgb(50, 50, 50);
    }

    &:not(:disabled){
        &:focus{
            color: lightblue;
            border-color: lightblue;
        }

        &:hover{
            color: orange;
            background: rgba(50, 50, 50, 0.5);
            border-color: orange;
        }

    }

`

const CardContainer = ({children, canPrev, canNext, selectorClick}) => {

    return (
    <Layout>
        <CardHolder>
            {children}
        </CardHolder>

        <ButtonHolder>
            <SelectorButton
                disabled={!canPrev}
                onClick={() => selectorClick('prev')}
            >
                <FaArrowAltCircleLeft size={arrowIconSize}/>
            </SelectorButton>        

            <SelectorButton
                disabled={!canNext}
                onClick={() => selectorClick('next')}
            >
                <FaArrowAltCircleRight size={arrowIconSize}/>
            </SelectorButton>
        </ButtonHolder>
    </Layout>
  )
}

export default CardContainer