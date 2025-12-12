import { useEffect, type FC } from 'react';

import styles from './NotificationItem.module.scss';

interface INotificationItemProps {
   id: string;
   text: string;
   onClose: (id: string) => void;
}

const NotificationItem: FC<INotificationItemProps> = ({ id, text, onClose }) => {
   useEffect(() => {
      const timer: ReturnType<typeof setTimeout> = setTimeout(() => {
         onClose(id);
      }, 5000);

      return () => clearTimeout(timer);
   }, [id, onClose])

   return (
      <div className={styles.itemContainer}>
         <p>{text}</p>
         <button onClick={() => onClose(id)} className={styles.button}>x</button>
      </div>
   )
}

export default NotificationItem;