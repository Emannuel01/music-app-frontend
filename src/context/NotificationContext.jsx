import React, { createContext, useState, useContext, useCallback } from 'react';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);

  const showNotification = useCallback((message, type = 'success') => {
    // Se já houver uma notificação, limpa o timer dela antes de mostrar a nova
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    // Define a nova notificação
    setNotification({ message, type });

    // Define um timer para limpar a notificação após 4 segundos
    const newTimeoutId = setTimeout(() => {
      setNotification(null);
    }, 4000);
    setTimeoutId(newTimeoutId);
  }, [timeoutId]); // Depende do timeoutId para poder limpá-lo

  return (
    <NotificationContext.Provider value={{ notification, showNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);