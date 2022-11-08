
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom'

import React, { useState } from 'react';
import Home from './pages/Home';
import Parks from './pages/Parks';
import ParkDetail from './pages/ParkDetail';


function App() {
  //寫下所有路由設定
  return (
    <div className="App">
      <Router>
            
          <Routes>
            <Route path="/" 
            element={<Navigate replace to="map"/>}
            />
            <Route path="/map/*" 
            element={<Home />}>
              {/* 點選了停車場：/map/:parkId */}
              <Route path=":parkId" element={<Home />}>
                {/* 右側欄：/map?nearby=true */}
                {/* /map/:parkId?nearby=true */}
                <Route path="?nearby=true" element={<Home />}></Route>
              </Route>
            </Route>

            <Route path="/parks/*" 
            element={<Parks />}>
              {/* 停車場詳細頁面：/parks/:parkId */}
              <Route path=":parkId" element={<ParkDetail />}>
                
              </Route>
              
            </Route>
          </Routes>

      </Router>
    </div>
    

  );
}

export default App;

//nav
//MAP(map__container)
//  map(map)
//  mapUI(map__ui)
//footer