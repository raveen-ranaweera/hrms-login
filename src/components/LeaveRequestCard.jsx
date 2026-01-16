import React from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LeaveRequestCard = ({ request, onApprove, onReject, showActions = false }) => {
  const statusConfig = {
    Pending: {
      icon: <Clock className="w-5 h-5" />,
      color: 'text-orange-600 dark:text-orange-400',
      bg: 'bg-orange-100 dark:bg-orange-900/30'
    },
    Approved: {
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-100 dark:bg-green-900/30'
    },
    Rejected: {
      icon: <XCircle className="w-5 h-5" />,
      color: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-100 dark:bg-red-900/30'
    }
  };

  const status = statusConfig[request.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 transition-shadow bg-white rounded-lg shadow-lg dark:bg-slate-800 hover:shadow-xl"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            {request.user_name}
          </h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {format(new Date(request.start_date), 'MMM dd, yyyy')} - {format(new Date(request.end_date), 'MMM dd, yyyy')}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {request.days} {request.days === 1 ? 'day' : 'days'}
          </p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${status.bg} ${status.color}`}>
          {status.icon}
          <span className="font-medium">{request.status}</span>
        </div>
      </div>

      <div className="mb-4">
        <p className="mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">Reason:</p>
        <p className="text-sm text-slate-600 dark:text-slate-400">{request.reason}</p>
      </div>

      {showActions && request.status === 'Pending' && (
        <div className="flex gap-2">
          <Button
            onClick={() => onApprove(request.id)}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Approve
          </Button>
          <Button
            onClick={() => onReject(request.id)}
            variant="destructive"
            className="flex-1"
          >
            <XCircle className="w-4 h-4 mr-2" />
            Reject
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default LeaveRequestCard;