import React, {createContext, useEffect, useState} from 'react'

export const RotationContext = createContext()

const RotationContextProvider = ({children}) => {
  
    const [isRotationCompleted, setIsRotationCompleted] = useState(true)

    const rotationCompletionHandler = (isCompleted) => {
        setIsRotationCompleted(isCompleted)
    }
  
    return (
    <RotationContext.Provider
        value={{
            isRotationCompleted,
            rotationCompletionHandler
        }}
    >
        {children}
    </RotationContext.Provider>
  )
}

export default RotationContextProvider