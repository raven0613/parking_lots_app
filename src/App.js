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
  
  return (
    <div className="App">
        

        <Map className="map__container" speechRef={speechRef}></Map>
        {/* <Speech speechRef={speechRef}></Speech> */}
    </div>
  );
}

export default App;

//nav
//MAP(map__container)
//  map(map)
//  mapUI(map__ui)
//footer