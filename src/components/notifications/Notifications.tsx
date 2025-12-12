import { type FC } from 'react';

import { useGameStore } from '../../store/useGameStore';
import NotificationItem from '../notification-item/NotificationItem';

import styles from './Notifications.module.scss';

const Notifications: FC = () => {
   const { notificationMessages, removeMessage } = useGameStore();

   return (
      <div className={styles.container}>
         {notificationMessages.map((msg) => (
            <NotificationItem 
               key={msg.id} 
               id={msg.id} 
               text={msg.text} 
               onClose={removeMessage}
            />
         ))}
      </div>
   )
}

export default Notifications;