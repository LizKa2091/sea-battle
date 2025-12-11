import { useEffect, type FC } from 'react';

import ActionButton from '../../action-button/ActionButton';
import { useGameResult } from '../../../hooks/useGameResult';
import { useGameStore } from '../../../store/useGameStore';
import { useNavigate } from 'react-router-dom';

const GameResult: FC = () => {
   const { gameStatus, resetGame, setFinalStatus } = useGameStore();
   const { getGameResult } = useGameResult(gameStatus);
   const currGameResult = getGameResult();
   const navigate = useNavigate();

   useEffect(() => {
      if (currGameResult && gameStatus === 'in progress') {
         setFinalStatus(currGameResult);
      }
   }, [currGameResult, gameStatus, setFinalStatus]);

   const handleMainMenu = () => {
      resetGame();

      navigate('/')
   }

   if (gameStatus !== 'triumph' && gameStatus !== 'defeat') {
      return null;
   }

   return (
      <div>
         <p>
            {gameStatus === 'triumph' ? 'Поздравляем с победой!' : 'К сожалению, вы проиграли'}
         </p>
         <ActionButton text='Главное меню' onClick={handleMainMenu} />
      </div>
   )
}

export default GameResult;