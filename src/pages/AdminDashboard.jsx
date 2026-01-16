import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Users, Calendar, DollarSign, FileText, UserCheck } from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';
import DashboardNav from '@/components/DashboardNav';
import SummaryCard from '@/components/SummaryCard';
import AttendanceTable from '@/components/AttendanceTable';
import LeaveRequestCard from '@/components/LeaveRequestCard';
import SalaryCard from '@/components/SalaryCard';
import { useAttendance } from '@/hooks/useAttendance';
import { useLeaveManagement } from '@/hooks/useLeaveManagement';
import { useSalaryManagement } from '@/hooks/useSalaryManagement';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('attendance');
  const { getAllAttendance } = useAttendance();
  const { getAllLeaveRequests, approveLeaveRequest, rejectLeaveRequest } = useLeaveManagement();
  const { getAllSalaryRecords } = useSalaryManagement();
  const { toast } = useToast();

  const allAttendance = getAllAttendance();
  const allLeaveRequests = getAllLeaveRequests();
  const allSalaryRecords = getAllSalaryRecords();

  const pendingLeaves = allLeaveRequests.filter(req => req.status === 'Pending');
  const uniqueUsers = new Set(allAttendance.map(a => a.user_id)).size;
  const attendanceRate = allAttendance.length > 0 
    ? Math.round((allAttendance.filter(a => a.check_out_time).length / allAttendance.length) * 100)
    : 0;

  const handleApprove = (requestId) => {
    const result = approveLeaveRequest(requestId);
    if (result.success) {
      toast({
        title: 'Leave Approved',
        description: 'The leave request has been approved successfully.',
      });
    } else {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      });
    }
  };

  const handleReject = (requestId) => {
    const result = rejectLeaveRequest(requestId);
    if (result.success) {
      toast({
        title: 'Leave Rejected',
        description: 'The leave request has been rejected.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      });
    }
  };

  const tabs = [
    { id: 'attendance', label: 'Attendance', icon: <UserCheck className="w-5 h-5" /> },
    { id: 'leave', label: 'Leave Management', icon: <Calendar className="w-5 h-5" /> },
    { id: 'salary', label: 'Salary Management', icon: <DollarSign className="w-5 h-5" /> },
    { id: 'users', label: 'User Management', icon: <Users className="w-5 h-5" /> }
  ];

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Employee Management System</title>
        <meta name="description" content="Manage employees, attendance, leave requests, and salaries" />
      </Helmet>

      <div className="min-h-screen p-6 bg-slate-50 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl">
          <DashboardHeader title="Admin Dashboard" />

          <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-3">
            <SummaryCard
              title="Total Employees"
              value={uniqueUsers}
              icon={<Users className="w-8 h-8" />}
              color="blue"
            />
            <SummaryCard
              title="Pending Leaves"
              value={pendingLeaves.length}
              icon={<Calendar className="w-8 h-8" />}
              color="orange"
            />
            <SummaryCard
              title="Attendance Rate"
              value={`${attendanceRate}%`}
              icon={<UserCheck className="w-8 h-8" />}
              color="green"
            />
          </div>

          <DashboardNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'attendance' && (
              <div>
                <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">
                  All Attendance Records
                </h2>
                {allAttendance.length > 0 ? (
                  <AttendanceTable data={allAttendance} />
                ) : (
                  <div className="p-12 text-center bg-white rounded-lg shadow-lg dark:bg-slate-800">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                    <p className="text-slate-600 dark:text-slate-400">No attendance records found</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'leave' && (
              <div>
                <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">
                  Leave Requests
                </h2>
                {allLeaveRequests.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {allLeaveRequests.map(request => (
                      <LeaveRequestCard
                        key={request.id}
                        request={request}
                        onApprove={handleApprove}
                        onReject={handleReject}
                        showActions={request.status === 'Pending'}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center bg-white rounded-lg shadow-lg dark:bg-slate-800">
                    <Calendar className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                    <p className="text-slate-600 dark:text-slate-400">No leave requests found</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'salary' && (
              <div>
                <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">
                  Salary Records
                </h2>
                {allSalaryRecords.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {allSalaryRecords.map(record => (
                      <SalaryCard key={record.id} record={record} />
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center bg-white rounded-lg shadow-lg dark:bg-slate-800">
                    <DollarSign className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                    <p className="text-slate-600 dark:text-slate-400">No salary records found</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'users' && (
              <div className="p-12 text-center bg-white rounded-lg shadow-lg dark:bg-slate-800">
                <Users className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                <p className="mb-2 text-slate-600 dark:text-slate-400">User Management</p>
                <p className="text-sm text-slate-500 dark:text-slate-500">
                  🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;