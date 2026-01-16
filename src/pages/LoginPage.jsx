import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, isAuthenticated, userRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      const roleRoutes = {
        Admin: '/admin-dashboard',
        Manager: '/manager-dashboard',
        User: '/user-dashboard'
      };
      navigate(roleRoutes[userRole] || '/', { replace: true });
    }
  }, [isAuthenticated, userRole, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      toast({
        title: 'Login Successful',
        description: `Welcome back, ${result.user.full_name}!`,
      });
      
      const roleRoutes = {
        Admin: '/admin-dashboard',
        Manager: '/manager-dashboard',
        User: '/user-dashboard'
      };
      navigate(roleRoutes[result.user.role] || '/', { replace: true });
    } else {
      setError(result.error);
      toast({
        title: 'Login Failed',
        description: result.error,
        variant: 'destructive',
      });
    }
  };

  const sampleCredentials = [
    { role: 'Admin', email: 'admin@company.com', password: 'admin123' },
    { role: 'Manager', email: 'manager@company.com', password: 'manager123' },
    { role: 'User', email: 'user@company.com', password: 'user123' }
  ];

  return (
    <>
      <Helmet>
        <title>Login - Employee Management System</title>
        <meta name="description" content="Login to access your employee dashboard" />
      </Helmet>

      <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="p-8 bg-white shadow-2xl dark:bg-slate-800 rounded-2xl">
            <div className="mb-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600"
              >
                <LogIn className="w-8 h-8 text-white" />
              </motion.div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Welcome Back
              </h1>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                Sign in to your account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-3 p-4 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/30 dark:border-red-800"
                >
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                </motion.div>
              )}

              <div>
                <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute w-5 h-5 -translate-y-1/2 left-3 top-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full py-3 pl-10 pr-4 bg-white border rounded-lg dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 dark:text-white placeholder:text-slate-400"
                    placeholder="you@company.com"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute w-5 h-5 -translate-y-1/2 left-3 top-1/2 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full py-3 pl-10 pr-4 bg-white border rounded-lg dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 dark:text-white placeholder:text-slate-400"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full py-3 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={loading}
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-6 h-6 border-2 border-white rounded-full border-t-transparent"
                  />
                ) : (
                  <>
                    <LogIn className="w-5 h-5 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            <div className="pt-8 mt-8 border-t dark:border-slate-700">
              <p className="mb-4 text-sm text-center text-slate-600 dark:text-slate-400">
                Sample Credentials for Testing:
              </p>
              <div className="space-y-2">
                {sampleCredentials.map((cred, index) => (
                  <motion.div
                    key={cred.role}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50"
                  >
                    <p className="mb-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {cred.role}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Email: {cred.email}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Password: {cred.password}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default LoginPage;