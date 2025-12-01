import { useMemo, type FC } from 'react';
import clsx from 'clsx';
import { useCellsStore } from '../../store/useCellsStore';

import styles from './Cell.module.scss';

interface ICellProps {
   id: string;
}

const Cell: FC<ICellProps> = ({ id }) => {
   const { cells, toggleSelectCell } = useCellsStore();

   const currCell = useMemo(() => {
      for (const row of cells) {
         const currCell = row.find((cell) => cell.id === id);

         if (currCell) return currCell;
      }
   }, [cells, id]);

   if (!currCell) {
      return null;
   }

   const { hasShip, isDamaged, isSelected } = currCell;

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