import { type FC } from 'react';
import clsx from 'clsx';

import GameResult from './game-result/GameResult';
import ShipsField from '../ships-field/ShipsField';
import { useGameStore } from '../../store/useGameStore';
import type { User } from '../../types/types';

import styles from './InfoBar.module.scss';

interface IInfoFieldProps {
   user: User;
}

const InfoField: FC<IInfoFieldProps> = ({ user }) => {
   const { currTurn, gameStatus } = useGameStore();
   const isPlayersTurn: boolean = !!(currTurn === 'player');

   return (
      <div className={styles.container}>
         <p className={clsx(styles.turnInfo, isPlayersTurn && styles.player)}>
            {user === 'player' && gameStatus === 'in progress' ? (
               isPlayersTurn ? 'Вы ходите' : 'Ход врага'
            ) : ''}
         </p>
         <ShipsField user={user} />
         {user === 'player' && 
            <GameResult />
         }
      </div>
   )
}

export default InfoField;