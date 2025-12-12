import { type FC } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import MainPage from "./pages/MainPage";
import GamePage from "./pages/GamePage";

import './styles/reset.scss';
import './styles/global.scss';

const App: FC = () => {
   const location = useLocation();
   const state = location.state as { modal?: Location };

   return (
      <>
         <Routes>
            <Route path='/' element={<MainPage />} />
         </Routes>
         {state?.modal && (
            <Routes>
               <Route path='/game' element={<GamePage />} />
            </Routes>
         )}
      </>
   )
}

export default App;