import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { format, differenceInMinutes } from 'date-fns';

export const useAttendance = () => {
  const { currentUser } = useAuth();
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [currentDuration, setCurrentDuration] = useState(0);

  useEffect(() => {
    if (currentUser) {
      loadTodayAttendance();
      loadAttendanceHistory();
    }
  }, [currentUser]);

  useEffect(() => {
    let interval;
    if (isCheckedIn && todayAttendance?.check_in_time) {
      interval = setInterval(() => {
        const duration = differenceInMinutes(new Date(), new Date(todayAttendance.check_in_time));
        setCurrentDuration(duration);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCheckedIn, todayAttendance]);

  const loadTodayAttendance = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const stored = localStorage.getItem(`attendance_${currentUser.id}_${today}`);
    if (stored) {
      const attendance = JSON.parse(stored);
      setTodayAttendance(attendance);
      setIsCheckedIn(!attendance.check_out_time);
      if (attendance.check_out_time) {
        setCurrentDuration(attendance.duration_minutes);
      }
    }
  };

  const loadAttendanceHistory = () => {
    const allKeys = Object.keys(localStorage);
    const userAttendanceKeys = allKeys.filter(key => 
      key.startsWith(`attendance_${currentUser.id}_`)
    );
    
    const history = userAttendanceKeys.map(key => {
      return JSON.parse(localStorage.getItem(key));
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
    
    setAttendanceHistory(history);
  };

  const checkIn = () => {
    const now = new Date();
    const today = format(now, 'yyyy-MM-dd');
    
    const attendance = {
      id: `${currentUser.id}_${Date.now()}`,
      user_id: currentUser.id,
      user_name: currentUser.full_name,
      check_in_time: now.toISOString(),
      check_out_time: null,
      duration_minutes: 0,
      date: today,
      created_at: now.toISOString()
    };

    localStorage.setItem(`attendance_${currentUser.id}_${today}`, JSON.stringify(attendance));
    setTodayAttendance(attendance);
    setIsCheckedIn(true);
    return { success: true };
  };

  const checkOut = () => {
    if (!todayAttendance) {
      return { success: false, error: 'No check-in found' };
    }

    const now = new Date();
    const duration = differenceInMinutes(now, new Date(todayAttendance.check_in_time));
    
    const updatedAttendance = {
      ...todayAttendance,
      check_out_time: now.toISOString(),
      duration_minutes: duration
    };

    const today = format(new Date(), 'yyyy-MM-dd');
    localStorage.setItem(`attendance_${currentUser.id}_${today}`, JSON.stringify(updatedAttendance));
    setTodayAttendance(updatedAttendance);
    setIsCheckedIn(false);
    setCurrentDuration(duration);
    loadAttendanceHistory();
    return { success: true, duration };
  };

  const getAllAttendance = () => {
    const allKeys = Object.keys(localStorage);
    const attendanceKeys = allKeys.filter(key => key.startsWith('attendance_'));
    
    return attendanceKeys.map(key => JSON.parse(localStorage.getItem(key)))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  return {
    todayAttendance,
    attendanceHistory,
    isCheckedIn,
    currentDuration,
    checkIn,
    checkOut,
    getAllAttendance,
    loadAttendanceHistory
  };
};