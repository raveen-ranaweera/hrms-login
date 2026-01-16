import React from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

const SalaryCard = ({ record }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 transition-shadow bg-white rounded-lg shadow-lg dark:bg-slate-800 hover:shadow-xl"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            {record.user_name || 'Salary Record'}
          </h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {format(new Date(record.payment_date), 'MMMM yyyy')}
          </p>
        </div>
        <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900/30">
          <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600 dark:text-slate-400">Base Salary</span>
          <span className="font-semibold text-slate-900 dark:text-white">
            ${record.base_salary.toLocaleString()}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
            <TrendingUp className="w-4 h-4 text-green-500" />
            Bonus
          </span>
          <span className="font-semibold text-green-600 dark:text-green-400">
            +${record.bonus.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
            <TrendingDown className="w-4 h-4 text-red-500" />
            Deductions
          </span>
          <span className="font-semibold text-red-600 dark:text-red-400">
            -${record.deductions.toLocaleString()}
          </span>
        </div>

        <div className="pt-3 mt-3 border-t dark:border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold text-slate-700 dark:text-slate-300">Net Salary</span>
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
              ${record.net_salary.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SalaryCard;