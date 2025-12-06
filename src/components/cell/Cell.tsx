import { type FC } from 'react';
import clsx from 'clsx';
import { useGameStore } from '../../store/useGameStore';

import styles from './Cell.module.scss';
import type { ICellItem } from '../../types/types';

interface ICellProps {
   cellData: ICellItem;
   id: string;
}

const Cell: FC<ICellProps> = ({ cellData, id }) => {
   const { toggleSelectCell } = useGameStore();

   const { hasShip, isDamaged, isSelected } = cellData;

   return (
      <div 
         onClick={() => toggleSelectCell(id)}
         className={
            clsx(
               styles.cell, 
               hasShip && styles.ship, 
               isDamaged && styles.damaged, 
               isSelected && styles.selected
            )
      } />
   )
}

export default Cell;