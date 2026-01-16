import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Calendar, DollarSign, History, Clock } from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';
import DashboardNav from '@/components/DashboardNav';
import CheckInOutButton from '@/components/CheckInOutButton';
import LeaveRequestCard from '@/components/LeaveRequestCard';
import SalaryCard from '@/components/SalaryCard';
import AttendanceTable from '@/components/AttendanceTable';
import Modal from '@/components/Modal';
import { Button } from '@/components/ui/button';
import { useAttendance } from '@/hooks/useAttendance';
import { useLeaveManagement } from '@/hooks/useLeaveManagement';
import { useSalaryManagement } from '@/hooks/useSalaryManagement';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('checkin');
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveForm, setLeaveForm] = useState({ startDate: '', endDate: '', reason: '' });

  const { 
    isCheckedIn, 
    currentDuration, 
    todayAttendance, 
    attendanceHistory, 
    checkIn, 
    checkOut 
  } = useAttendance();

  const { 
    leaveRequests, 
    leaveBalance, 
    submitLeaveRequest 
  } = useLeaveManagement();

  const { salaryRecords } = useSalaryManagement();
  const { toast } = useToast();

  const handleCheckIn = () => {
    const result = checkIn();
    if (result.success) {
      toast({
        title: 'Checked In',
        description: 'You have successfully checked in for today.',
      });
    }
  };

  const handleCheckOut = () => {
    const result = checkOut();
    if (result.success) {
      toast({
        title: 'Checked Out',
        description: `Session duration: ${Math.floor(result.duration / 60)}h ${result.duration % 60}m`,
      });
    }
  };

  const handleLeaveSubmit = () => {
    if (!leaveForm.startDate || !leaveForm.endDate || !leaveForm.reason) {
      toast({
        title: 'Incomplete Form',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    const result = submitLeaveRequest(leaveForm.startDate, leaveForm.endDate, leaveForm.reason);
    if (result.success) {
      toast({
        title: 'Leave Request Submitted',
        description: 'Your leave request has been submitted for approval.',
      });
      setShowLeaveModal(false);
      setLeaveForm({ startDate: '', endDate: '', reason: '' });
    } else {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      });
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const tabs = [
    { id: 'checkin', label: 'Check In/Out', icon: <Clock className="w-5 h-5" /> },
    { id: 'leave', label: 'Leave Management', icon: <Calendar className="w-5 h-5" /> },
    { id: 'salary', label: 'Salary', icon: <DollarSign className="w-5 h-5" /> },
    { id: 'history', label: 'History', icon: <History className="w-5 h-5" /> }
  ];

  return (
    <>
      <Helmet>
        <title>User Dashboard - Employee Management System</title>
        <meta name="description" content="Manage your attendance, leave requests, and view salary information" />
      </Helmet>

      <div className="min-h-screen p-6 bg-slate-50 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl">
          <DashboardHeader title="My Dashboard" />

          <DashboardNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'checkin' && (
              <div className="max-w-2xl mx-auto">
                <div className="p-8 bg-white rounded-lg shadow-lg dark:bg-slate-800">
                  <h2 className="mb-6 text-2xl font-bold text-center text-slate-900 dark:text-white">
                    Attendance Tracker
                  </h2>
                  
                  <CheckInOutButton
                    isCheckedIn={isCheckedIn}
                    onCheckIn={handleCheckIn}
                    onCheckOut={handleCheckOut}
                    currentDuration={currentDuration}
                  />

                  {todayAttendance && (
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700">
                        <p className="mb-1 text-sm text-slate-600 dark:text-slate-400">Check In</p>
                        <p className="text-lg font-semibold text-slate-900 dark:text-white">
                          {new Date(todayAttendance.check_in_time).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700">
                        <p className="mb-1 text-sm text-slate-600 dark:text-slate-400">Total Today</p>
                        <p className="text-lg font-semibold text-slate-900 dark:text-white">
                          {formatDuration(todayAttendance.duration_minutes || currentDuration)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'leave' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Leave Management
                  </h2>
                  <Button onClick={() => setShowLeaveModal(true)}>
                    Apply for Leave
                  </Button>
                </div>

                {leaveBalance && (
                  <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3">
                    <div className="p-6 bg-blue-100 rounded-lg dark:bg-blue-900/30">
                      <p className="mb-1 text-sm text-blue-800 dark:text-blue-200">Total Days</p>
                      <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {leaveBalance.total_days}
                      </p>
                    </div>
                    <div className="p-6 bg-orange-100 rounded-lg dark:bg-orange-900/30">
                      <p className="mb-1 text-sm text-orange-800 dark:text-orange-200">Used Days</p>
                      <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                        {leaveBalance.used_days}
                      </p>
                    </div>
                    <div className="p-6 bg-green-100 rounded-lg dark:bg-green-900/30">
                      <p className="mb-1 text-sm text-green-800 dark:text-green-200">Remaining Days</p>
                      <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                        {leaveBalance.remaining_days}
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {leaveRequests.map(request => (
                    <LeaveRequestCard key={request.id} request={request} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'salary' && (
              <div>
                <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">
                  Salary Information
                </h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {salaryRecords.map(record => (
                    <SalaryCard key={record.id} record={record} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div>
                <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">
                  Attendance History (Last 7 Days)
                </h2>
                {attendanceHistory.slice(0, 7).length > 0 ? (
                  <AttendanceTable data={attendanceHistory.slice(0, 7)} />
                ) : (
                  <div className="p-12 text-center bg-white rounded-lg shadow-lg dark:bg-slate-800">
                    <History className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                    <p className="text-slate-600 dark:text-slate-400">No attendance history found</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <Modal
        isOpen={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
        title="Apply for Leave"
      >
        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
              Start Date
            </label>
            <input
              type="date"
              value={leaveForm.startDate}
              onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
              className="w-full px-4 py-2 bg-white border rounded-lg dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
              End Date
            </label>
            <input
              type="date"
              value={leaveForm.endDate}
              onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
              className="w-full px-4 py-2 bg-white border rounded-lg dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
              Reason
            </label>
            <textarea
              value={leaveForm.reason}
              onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 bg-white border rounded-lg dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
              placeholder="Enter reason for leave..."
            />
          </div>
          <Button onClick={handleLeaveSubmit} className="w-full">
            Submit Request
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default UserDashboard;