import React from 'react';
import { motion } from 'framer-motion';
import { Clock, LogIn, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CheckInOutButton = ({ isCheckedIn, onCheckIn, onCheckOut, currentDuration }) => {
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const secs = Math.floor((currentDuration % 1) * 60);
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="text-center">
      {isCheckedIn && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6"
        >
          <div className="p-6 text-white rounded-lg shadow-lg bg-gradient-to-br from-green-500 to-green-600">
            <Clock className="w-12 h-12 mx-auto mb-3" />
            <p className="mb-2 text-sm font-medium">Current Session</p>
            <p className="font-mono text-4xl font-bold">
              {formatDuration(currentDuration)}
            </p>
          </div>
        </motion.div>
      )}

      <Button
        onClick={isCheckedIn ? onCheckOut : onCheckIn}
        size="lg"
        className={`w-full h-20 text-xl font-semibold ${
          isCheckedIn
            ? 'bg-red-600 hover:bg-red-700'
            : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {isCheckedIn ? (
          <>
            <LogOut className="w-6 h-6 mr-2" />
            Check Out
          </>
        ) : (
          <>
            <LogIn className="w-6 h-6 mr-2" />
            Check In
          </>
        )}
      </Button>
    </div>
  );
};

export default CheckInOutButton;