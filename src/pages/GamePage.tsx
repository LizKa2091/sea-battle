import { type FC } from 'react';

import Field from '../components/field/Field';
import Notifications from '../components/notifications/Notifications';
import ActionButton from '../components/action-button/ActionButton';
import InfoBar from '../components/info-bar/InfoBar';
import { useGameStore } from '../store/useGameStore';
import { usePlaceRandomShips } from '../hooks/usePlaceRandomShips';

import styles from './GamePage.module.scss';

const GamePage: FC = () => {
   const { playerCells, enemyCells, resetGame } = useGameStore();
   const { placeRandomShips } = usePlaceRandomShips();

   const handleRestartGame = () => {
      resetGame();
      placeRandomShips();
   }

   return (
      <div className='pageContainer'>
         <Notifications />
         <ActionButton 
            text='Начать игру заново' 
            onClick={handleRestartGame} 
         />
         <div className={styles.fields}>
            <Field cells={playerCells} user='player' /> 
            <div className={styles.infoBars}>
               <InfoBar user='player' />
               <InfoBar user='enemy' />
            </div>
            <Field cells={enemyCells} user='enemy' /> 
         </div>
      </div>
   )
}

export default GamePage;