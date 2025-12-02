import { type FC } from 'react'

import Cell from '../cell/Cell';
import Actions from '../actions/Actions';
import ShipsField from '../ships-field/ShipsField';
import { useCellsStore } from '../../store/useCellsStore';

import styles from './Field.module.scss';

const Field: FC = () => {
   const { cells } = useCellsStore();

   if (!cells.length) {
      return null;
   }

   return (
      <div className={styles.container}>
         <div className={styles.fieldContainer}>
            <div className={styles.fieldRows}>
               {cells.map((row, index) => 
                  <div key={index} className={styles.row}>
                     {row.map((cell) => (
                        <Cell key={cell.id} id={cell.id} />
                     ))}
                  </div>
               )}
            </div>
            <Actions />
         </div>
         <ShipsField />
      </div>
   )
}

export default Field;