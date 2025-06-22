import React from 'react';
import { useNotification } from '../context/NotificationContext';
import './Notification.css';

function Notification() {
  const { notification } = useNotification();

  // Se não houver notificação, não renderiza nada
  if (!notification) {
    return null;
  }

  // A classe do container muda de acordo com o tipo ('success' ou 'error')
  return (
    <div className={`notification-toast ${notification.type}`}>
      {notification.message}
    </div>
  );
}

export default Notification;