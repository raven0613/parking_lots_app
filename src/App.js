import Map from './components/Map'
import Speech from './components/Speech'
import { createContext, useEffect, useRef } from 'react';



function App() {
  // const [speechResult, setSpeechResult] = useState()
  const speechRef = useRef()
  const AppContext = createContext(null)
  //Provider包覆元件
  const contextValue = {
    speechRef
  }
  useEffect(() => {
    console.log(speechRef.current)
  }, [speechRef])
  
  return (
    <div className="App">
      <AppContext.Provider value={contextValue} >
        <Speech speechRef={speechRef}></Speech>
        <Map className="map" speechRef={speechRef}></Map>
      </AppContext.Provider>
      
    </div>
  );
}

export default App;
