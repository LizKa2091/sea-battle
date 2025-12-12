import { useEffect, type FC } from 'react';

import ActionButton from '../../action-button/ActionButton';
import { useGameResult } from '../../../hooks/useGameResult';
import { useGameStore } from '../../../store/useGameStore';
import { usePlaceRandomShips } from '../../../hooks/usePlaceRandomShips';

const GameResult: FC = () => {
   const { gameStatus, resetGame, setFinalStatus } = useGameStore();
   const { getGameResult } = useGameResult(gameStatus);
   const { placeRandomShips } = usePlaceRandomShips();
   const currGameResult = getGameResult();

   useEffect(() => {
      if (currGameResult && gameStatus === 'in progress') {
         setFinalStatus(currGameResult);
      }
   }, [currGameResult, gameStatus, setFinalStatus]);

   const handleRestartGame = () => {
      resetGame();
      placeRandomShips();
   }

   if (gameStatus !== 'triumph' && gameStatus !== 'defeat') {
      return null;
   }

   return (
      <div>
         <p>
            {gameStatus === 'triumph' ? 'Поздравляем с победой!' : 'К сожалению, вы проиграли'}
         </p>
         <ActionButton text='Начать новую игру' onClick={handleRestartGame} />
      </div>
   )
}

export default GameResult;