// src/components/NotificationWrapper.tsx
'use client';
import { useNotification } from '@/context/NotificationContext';
import { NotificationContainer } from '@/components/ui/Notification';

export function NotificationWrapper() {
  const { notifications, removeNotification } = useNotification();
  return (
    <NotificationContainer
      notifications={notifications}
      onDismiss={removeNotification}
    />
  );
}