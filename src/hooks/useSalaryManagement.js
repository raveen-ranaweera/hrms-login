import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const useSalaryManagement = () => {
  const { currentUser } = useAuth();
  const [salaryRecords, setSalaryRecords] = useState([]);

  useEffect(() => {
    if (currentUser) {
      loadSalaryRecords();
    }
  }, [currentUser]);

  const loadSalaryRecords = () => {
    const stored = localStorage.getItem(`salary_records_${currentUser.id}`);
    if (stored) {
      setSalaryRecords(JSON.parse(stored));
    } else {
      // Create initial salary records for demonstration
      const mockRecords = generateMockSalaryRecords(currentUser);
      localStorage.setItem(`salary_records_${currentUser.id}`, JSON.stringify(mockRecords));
      setSalaryRecords(mockRecords);
    }
  };

  const generateMockSalaryRecords = (user) => {
    const baseSalaries = {
      Admin: 80000,
      Manager: 60000,
      User: 45000
    };

    const baseSalary = baseSalaries[user.role] || 45000;
    const records = [];
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    for (let month = 1; month <= currentMonth; month++) {
      const bonus = Math.floor(Math.random() * 5000);
      const deductions = Math.floor(Math.random() * 2000);
      const netSalary = baseSalary + bonus - deductions;

      records.push({
        id: `salary_${user.id}_${currentYear}_${month}`,
        user_id: user.id,
        user_name: user.full_name,
        base_salary: baseSalary,
        bonus: bonus,
        deductions: deductions,
        net_salary: netSalary,
        payment_date: `${currentYear}-${String(month).padStart(2, '0')}-28`,
        month: month,
        year: currentYear,
        created_at: new Date().toISOString()
      });
    }

    return records;
  };

  const getAllSalaryRecords = () => {
    const allKeys = Object.keys(localStorage);
    const salaryKeys = allKeys.filter(key => key.startsWith('salary_records_'));
    
    const allRecords = [];
    salaryKeys.forEach(key => {
      const records = JSON.parse(localStorage.getItem(key));
      allRecords.push(...records);
    });
    
    return allRecords.sort((a, b) => {
      if (b.year !== a.year) return b.year - a.year;
      return b.month - a.month;
    });
  };

  const updateSalaryRecord = (recordId, updates) => {
    const allRecords = getAllSalaryRecords();
    const record = allRecords.find(r => r.id === recordId);
    
    if (!record) return { success: false, error: 'Record not found' };

    const updatedRecord = {
      ...record,
      ...updates,
      net_salary: (updates.base_salary || record.base_salary) + 
                  (updates.bonus || record.bonus) - 
                  (updates.deductions || record.deductions)
    };

    const userRecords = allRecords.filter(r => r.user_id === record.user_id);
    const updatedUserRecords = userRecords.map(r => 
      r.id === recordId ? updatedRecord : r
    );

    localStorage.setItem(`salary_records_${record.user_id}`, JSON.stringify(updatedUserRecords));
    
    if (record.user_id === currentUser.id) {
      loadSalaryRecords();
    }

    return { success: true };
  };

  return {
    salaryRecords,
    getAllSalaryRecords,
    updateSalaryRecord,
    loadSalaryRecords
  };
};