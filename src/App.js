import Map from './components/Map'


import React, { useState } from 'react';

export const allContext = React.createContext('')

function App() {
  const [parkingLots, setParkingLots] = useState()
  const contextValue = {
    parkingLots, setParkingLots
  }

  
  return (
    <div className="App">
      <allContext.Provider value={contextValue}>
          <Map className="map__container"/>
      </allContext.Provider>
      
    </div>
  );
}

export default App;

//nav
//MAP(map__container)
//  map(map)
//  mapUI(map__ui)
//footer