
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom'

import React, { lazy, Suspense } from 'react';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Provider from './utils/Provider';

const Card = lazy(() => import('./components/card-panel/Card'))

function App() {
  //寫下所有路由設定
  return (
    <div className="App">
      <Router>
        
        {/* <Provider> */}
          <Suspense fallback={<h1> Loading </h1>}>
            <Routes>
              <Route path="/" element={<Navigate replace to="map"/>}
              />
              <Route path="/map" element={<Provider />}>
                {/* 點選了停車場：/map/:parkId */}
                <Route path=":parkId" element={<Provider />}>
                  {/* 右側欄：/map?nearby=true */}
                  {/* /map/:parkId?nearby=true */}
                  {/* <Route path="?nearby=true" element={<Card />}></Route> */}
                </Route>
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        {/* </Provider> */}

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