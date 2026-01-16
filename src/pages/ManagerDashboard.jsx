import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Users, Calendar, DollarSign, UserCheck } from 'lucide-react';
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

const ManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState('attendance');
  const { getAllAttendance } = useAttendance();
  const { getAllLeaveRequests, approveLeaveRequest, rejectLeaveRequest } = useLeaveManagement();
  const { getAllSalaryRecords } = useSalaryManagement();
  const { toast } = useToast();

  const teamAttendance = getAllAttendance();
  const teamLeaveRequests = getAllLeaveRequests();
  const teamSalaryRecords = getAllSalaryRecords();

  const pendingApprovals = teamLeaveRequests.filter(req => req.status === 'Pending').length;
  const teamSize = new Set(teamAttendance.map(a => a.user_id)).size;
  const teamAttendanceRate = teamAttendance.length > 0
    ? Math.round((teamAttendance.filter(a => a.check_out_time).length / teamAttendance.length) * 100)
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
    { id: 'attendance', label: 'Team Attendance', icon: <UserCheck className="w-5 h-5" /> },
    { id: 'leave', label: 'Leave Approvals', icon: <Calendar className="w-5 h-5" /> },
    { id: 'salary', label: 'Team Salary', icon: <DollarSign className="w-5 h-5" /> }
  ];

  return (
    <>
      <Helmet>
        <title>Manager Dashboard - Employee Management System</title>
        <meta name="description" content="Manage your team's attendance, leave requests, and view salary information" />
      </Helmet>

      <div className="min-h-screen p-6 bg-slate-50 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl">
          <DashboardHeader title="Manager Dashboard" />

          <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-3">
            <SummaryCard
              title="Team Size"
              value={teamSize}
              icon={<Users className="w-8 h-8" />}
              color="blue"
            />
            <SummaryCard
              title="Pending Approvals"
              value={pendingApprovals}
              icon={<Calendar className="w-8 h-8" />}
              color="orange"
            />
            <SummaryCard
              title="Team Attendance"
              value={`${teamAttendanceRate}%`}
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
                  Team Attendance Records
                </h2>
                {teamAttendance.length > 0 ? (
                  <AttendanceTable data={teamAttendance} />
                ) : (
                  <div className="p-12 text-center bg-white rounded-lg shadow-lg dark:bg-slate-800">
                    <UserCheck className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                    <p className="text-slate-600 dark:text-slate-400">No attendance records found</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'leave' && (
              <div>
                <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">
                  Leave Approval Requests
                </h2>
                {teamLeaveRequests.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {teamLeaveRequests.map(request => (
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
                  Team Salary Information
                </h2>
                {teamSalaryRecords.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {teamSalaryRecords.map(record => (
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
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default ManagerDashboard;