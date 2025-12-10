import { type FC } from 'react';
import clsx from 'clsx';
import { useGameStore } from '../../store/useGameStore';
import type { ICellItem, User } from '../../types/types';

import styles from './Cell.module.scss';

interface ICellProps {
   cellData: ICellItem;
   id: string;
   user: User;
}

const Cell: FC<ICellProps> = ({ cellData, id, user }) => {
   const { toggleSelectCell } = useGameStore();

   const { hasShip, isDamaged, isSelected } = cellData;

   return (
      <div 
         onClick={() => toggleSelectCell(id)}
         className={
            clsx(
               styles.cell, 
               user === 'enemy' && styles.enemyShip,
               hasShip && isDamaged && styles.damagedShip,
               hasShip && styles.ship, 
               isDamaged && styles.damaged, 
               isSelected && styles.selected
            )
      } />
   )
}

export default Cell;