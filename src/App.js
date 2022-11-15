
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom'

import React, { lazy, Suspense } from 'react';
import NotFound from './pages/NotFound';
import UIDataProvider from './store/UIDataProvider';

const Card = lazy(() => import('./components/card-panel/Card'))

function App() {
  //寫下所有路由設定
  return (
    <div className="App">
      <Router>

          <Suspense fallback={<h1> Loading </h1>}>
            <Routes>
              <Route path="/" element={<Navigate replace to="map"/>}
              />
              <Route path="/map" element={<UIDataProvider />}>
                {/* 點選了停車場：/map/:parkId */}
                <Route path=":parkId" element={<UIDataProvider />}>
                  {/* 右側欄：/map?nearby=true */}
                  {/* /map/:parkId?nearby=true */}
                  <Route path="?nearby=true" element={<Card />}></Route>
                </Route>
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>

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