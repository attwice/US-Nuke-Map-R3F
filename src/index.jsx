import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { Loader } from '@react-three/drei'
import SelectedSiteContextProvider from './contexts/SelectedSiteContext'
import RotationContextProvider from './contexts/RotationContext'

ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback={null}>
      <SelectedSiteContextProvider>
        <RotationContextProvider>
          <App />
        </RotationContextProvider>
      </SelectedSiteContextProvider>
    </Suspense>
    <Loader/>
  </React.StrictMode>,
  document.getElementById('root')
)
