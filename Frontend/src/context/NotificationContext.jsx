import { createContext, useCallback, useState } from 'react';

export const NotificationContext = createContext({
  notification: { open: false, message: '', severity: 'info' },
  showNotification: () => {},
  closeNotification: () => {},
});

export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

  const showNotification = useCallback(({ message, severity = 'info' }) => {
    setNotification({ open: true, message, severity });
  }, []);

  const closeNotification = useCallback(() => {
    setNotification((prev) => ({ ...prev, open: false }));
  }, []);

  return (
    <NotificationContext.Provider value={{ notification, showNotification, closeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}
