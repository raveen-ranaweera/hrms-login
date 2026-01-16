import React from 'react';
import { motion } from 'framer-motion';

const DashboardNav = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="p-2 mb-6 bg-white rounded-lg shadow-lg dark:bg-slate-800">
      <div className="flex gap-2 overflow-x-auto">
        {tabs.map((tab, index) => (
          <motion.button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center gap-2">
              {tab.icon}
              {tab.label}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default DashboardNav;