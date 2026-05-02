import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/useAuth';
import { Mail, Lock, ShoppingBag, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Helmet } from 'react-helmet-async';

const Login = () => {
  const { login, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(4, 'Password must be at least 4 characters')
      .required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      clearError();
      try {
        const result = await login(values.email.toLowerCase().trim(), values.password);
        // login returns the action object from createAsyncThunk
        if (result.payload?.user) {
          const account = result.payload.user;
          toast.success(`Welcome back, ${account.name}!`);
          if (account.role === 'admin' || account.role === 'dealer') {
            navigate('/admin');
          } else {
            navigate('/dashboard');
          }
        } else if (result.error) {
          toast.error(result.payload || 'Login failed');
        }
      } catch (err) {
        console.error(err);
      }
    },
  });

  // Clear errors on unmount
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  return (
    <>
      <Helmet>
        <title>Login | Shelf Scout</title>
        <meta name="description" content="Login to your Shelf Scout account to manage your inventory and reservations." />
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6 font-sans relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-emerald-200/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-teal-200/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="max-w-md w-full bg-white/80 backdrop-blur-2xl rounded-[48px] shadow-2xl p-10 md:p-12 space-y-10 border border-white/60 relative z-10"
        >
          {/* Logo + Heading */}
          <div className="text-center space-y-4">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-20 h-20 bg-emerald-600 rounded-[24px] flex items-center justify-center mx-auto shadow-2xl shadow-emerald-200"
            >
              <ShoppingBag className="w-10 h-10 text-white" />
            </motion.div>
            <div className="space-y-1">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Welcome Back</h2>
              <p className="text-slate-500 font-bold">Sign in to your Shelf Scout account</p>
            </div>
          </div>

          {/* Error Alert */}
          <AnimatePresence>
            {(error || (formik.touched.email && formik.errors.email) || (formik.touched.password && formik.errors.password)) && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-start gap-3 bg-red-50 text-red-700 px-6 py-4 rounded-2xl text-sm font-bold border border-red-100"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  {error || formik.errors.email || formik.errors.password}
                  {error?.includes('sign up') && (
                    <Link to="/signup" className="block mt-2 text-emerald-600 font-black hover:underline">
                      Create an account now →
                    </Link>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className={`block w-full pl-14 pr-5 py-4 bg-slate-50 border-2 ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-slate-50'} rounded-[20px] focus:bg-white focus:border-emerald-500 outline-none transition-all text-slate-900 font-bold`}
                    placeholder="name@example.com"
                    {...formik.getFieldProps('email')}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className={`block w-full pl-14 pr-5 py-4 bg-slate-50 border-2 ${formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-slate-50'} rounded-[20px] focus:bg-white focus:border-emerald-500 outline-none transition-all text-slate-900 font-bold`}
                    placeholder="••••••••"
                    {...formik.getFieldProps('password')}
                  />
                </div>
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-emerald-600 text-white rounded-[24px] font-black text-lg shadow-xl shadow-emerald-200 hover:bg-emerald-700 disabled:opacity-50 transition-all flex items-center justify-center space-x-3 group"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          <p className="text-center text-slate-500 font-bold">
            New here? <Link to="/signup" className="text-emerald-600 font-black hover:underline underline-offset-4">Create an account</Link>
          </p>
        </motion.div>
      </div>
    </>
  );
};

export default Login;
