import { type FC } from 'react'

import Cell from '../cell/Cell';
import Actions from '../actions/Actions';
import ShipsField from '../ships-field/ShipsField';
import type { ICellItem, User } from '../../types/types';

import styles from './Field.module.scss';

interface IFieldProps {
   cells: ICellItem[][];
   user: User;
}

const Field: FC<IFieldProps> = ({ cells, user }) => {
   if (!cells.length) {
      return null;
   }

   return (
      <div className={styles.container}>
         <div className={styles.fieldContainer}>
            <p className={styles.filedUser}>
               {user === 'player' ? 'Твоё поле' : 'Поле врага'}
            </p>
            <div className={styles.fieldRows}>
               {cells.map((row, index) => 
                  <div key={index} className={styles.row}>
                     {row.map((cell) => (
                        <Cell key={cell.id} id={cell.id} cellData={cell} />
                     ))}
                  </div>
               )}
            </div>
            <Actions user={user} />
         </div>
         <ShipsField user={user} />
      </div>
   )
}

export default Field;