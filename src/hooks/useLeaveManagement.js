import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { differenceInDays, isWithinInterval, parseISO } from 'date-fns';

export const useLeaveManagement = () => {
  const { currentUser } = useAuth();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [leaveBalance, setLeaveBalance] = useState(null);

  useEffect(() => {
    if (currentUser) {
      loadLeaveRequests();
      loadLeaveBalance();
    }
  }, [currentUser]);

  const loadLeaveRequests = () => {
    const stored = localStorage.getItem(`leave_requests_${currentUser.id}`);
    if (stored) {
      setLeaveRequests(JSON.parse(stored));
    }
  };

  const loadLeaveBalance = () => {
    const year = new Date().getFullYear();
    const stored = localStorage.getItem(`leave_balance_${currentUser.id}_${year}`);
    if (stored) {
      setLeaveBalance(JSON.parse(stored));
    } else {
      const initialBalance = {
        id: `${currentUser.id}_${year}`,
        user_id: currentUser.id,
        total_days: 20,
        used_days: 0,
        remaining_days: 20,
        year: year,
        updated_at: new Date().toISOString()
      };
      localStorage.setItem(`leave_balance_${currentUser.id}_${year}`, JSON.stringify(initialBalance));
      setLeaveBalance(initialBalance);
    }
  };

  const submitLeaveRequest = (startDate, endDate, reason) => {
    const days = differenceInDays(parseISO(endDate), parseISO(startDate)) + 1;

    if (days > leaveBalance.remaining_days) {
      return { success: false, error: 'Insufficient leave balance' };
    }

    const hasOverlap = leaveRequests.some(req => {
      if (req.status === 'Rejected') return false;
      const reqStart = parseISO(req.start_date);
      const reqEnd = parseISO(req.end_date);
      const newStart = parseISO(startDate);
      const newEnd = parseISO(endDate);
      
      return isWithinInterval(newStart, { start: reqStart, end: reqEnd }) ||
             isWithinInterval(newEnd, { start: reqStart, end: reqEnd }) ||
             isWithinInterval(reqStart, { start: newStart, end: newEnd });
    });

    if (hasOverlap) {
      return { success: false, error: 'Leave request overlaps with existing request' };
    }

    const newRequest = {
      id: `leave_${Date.now()}`,
      user_id: currentUser.id,
      user_name: currentUser.full_name,
      start_date: startDate,
      end_date: endDate,
      reason: reason,
      status: 'Pending',
      requested_date: new Date().toISOString(),
      manager_id: null,
      created_at: new Date().toISOString(),
      days: days
    };

    const updatedRequests = [...leaveRequests, newRequest];
    setLeaveRequests(updatedRequests);
    localStorage.setItem(`leave_requests_${currentUser.id}`, JSON.stringify(updatedRequests));

    return { success: true };
  };

  const approveLeaveRequest = (requestId) => {
    const request = leaveRequests.find(req => req.id === requestId);
    if (!request) return { success: false, error: 'Request not found' };

    const updatedRequests = leaveRequests.map(req => 
      req.id === requestId ? { ...req, status: 'Approved', manager_id: currentUser.id } : req
    );
    setLeaveRequests(updatedRequests);
    localStorage.setItem(`leave_requests_${request.user_id}`, JSON.stringify(updatedRequests));

    const year = new Date().getFullYear();
    const balanceKey = `leave_balance_${request.user_id}_${year}`;
    const userBalance = JSON.parse(localStorage.getItem(balanceKey));
    if (userBalance) {
      const updatedBalance = {
        ...userBalance,
        used_days: userBalance.used_days + request.days,
        remaining_days: userBalance.remaining_days - request.days,
        updated_at: new Date().toISOString()
      };
      localStorage.setItem(balanceKey, JSON.stringify(updatedBalance));
    }

    return { success: true };
  };

  const rejectLeaveRequest = (requestId) => {
    const request = leaveRequests.find(req => req.id === requestId);
    if (!request) return { success: false, error: 'Request not found' };

    const updatedRequests = leaveRequests.map(req => 
      req.id === requestId ? { ...req, status: 'Rejected', manager_id: currentUser.id } : req
    );
    setLeaveRequests(updatedRequests);
    localStorage.setItem(`leave_requests_${request.user_id}`, JSON.stringify(updatedRequests));

    return { success: true };
  };

  const getAllLeaveRequests = () => {
    const allKeys = Object.keys(localStorage);
    const leaveKeys = allKeys.filter(key => key.startsWith('leave_requests_'));
    
    const allRequests = [];
    leaveKeys.forEach(key => {
      const requests = JSON.parse(localStorage.getItem(key));
      allRequests.push(...requests);
    });
    
    return allRequests.sort((a, b) => new Date(b.requested_date) - new Date(a.requested_date));
  };

  return {
    leaveRequests,
    leaveBalance,
    submitLeaveRequest,
    approveLeaveRequest,
    rejectLeaveRequest,
    getAllLeaveRequests,
    loadLeaveRequests
  };
};