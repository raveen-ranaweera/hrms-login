import React, { useState } from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

const AttendanceTable = ({ data }) => {
  const [sortField, setSortField] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  const sortedData = [...data].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    const multiplier = sortOrder === 'asc' ? 1 : -1;
    
    if (aValue < bValue) return -1 * multiplier;
    if (aValue > bValue) return 1 * multiplier;
    return 0;
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="overflow-hidden bg-white rounded-lg shadow-lg dark:bg-slate-800">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-100 dark:bg-slate-700">
            <tr>
              <th 
                className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase cursor-pointer text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600"
                onClick={() => handleSort('user_name')}
              >
                Employee
              </th>
              <th 
                className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase cursor-pointer text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600"
                onClick={() => handleSort('date')}
              >
                Date
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase text-slate-700 dark:text-slate-200">
                Check In
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase text-slate-700 dark:text-slate-200">
                Check Out
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase text-slate-700 dark:text-slate-200">
                Duration
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {sortedData.map((record, index) => (
              <motion.tr
                key={record.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-slate-900 dark:text-white">
                  {record.user_name}
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap text-slate-600 dark:text-slate-300">
                  {format(new Date(record.date), 'MMM dd, yyyy')}
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap text-slate-600 dark:text-slate-300">
                  {format(new Date(record.check_in_time), 'hh:mm a')}
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap text-slate-600 dark:text-slate-300">
                  {record.check_out_time ? (
                    format(new Date(record.check_out_time), 'hh:mm a')
                  ) : (
                    <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                      <Clock className="w-4 h-4" />
                      Active
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap text-slate-600 dark:text-slate-300">
                  {record.duration_minutes ? formatDuration(record.duration_minutes) : '-'}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceTable;