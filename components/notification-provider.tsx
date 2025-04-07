import { useEffect } from 'react';
import useSound from 'use-sound';

interface NotificationComponentProps {
  notifications: any[]; // Replace 'any' with a more specific type if you have one
}

const NotificationComponent = ({ notifications }: NotificationComponentProps) => {
  const [play] = useSound('/blipp.mp3');

  useEffect(() => {
    if (notifications.length > 0) {
      play();
    }
  }, [notifications, play]);

  // Render your notifications
};