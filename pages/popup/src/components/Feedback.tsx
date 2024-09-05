// pages/popup/src/components/Feedback.tsx

import React, { useState, useEffect } from 'react';

interface FeedbackProps {
  message: string;
  type: 'error' | 'success' | 'info';
  duration?: number;
}

const Feedback: React.FC<FeedbackProps> = ({ message, type, duration = 3000 }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  const bgColor = type === 'error' ? 'bg-red-500' : type === 'success' ? 'bg-green-500' : 'bg-blue-500';

  return <div className={`fixed bottom-4 right-4 p-4 rounded ${bgColor} text-white`}>{message}</div>;
};

export default Feedback;
