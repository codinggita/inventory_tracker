import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/useAuth';
import { User, Mail, Lock, ShoppingBag, ArrowRight, AlertCircle, Loader2, Store, FileText, UserCheck } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Helmet } from 'react-helmet-async';

const Signup = () => {
  const { register, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required'),
    role: Yup.string().required('Role is required'),
    shopName: Yup.string().when('role', {
      is: 'admin',
      then: (schema) => schema.required('Shop name is required'),
      otherwise: (schema) => schema.notRequired(),
    }),
    licenseNo: Yup.string().when('role', {
      is: 'admin',
      then: (schema) => schema.required('License number is required'),
      otherwise: (schema) => schema.notRequired(),
    }),
    ownerName: Yup.string().when('role', {
      is: 'admin',
      then: (schema) => schema.required('Owner name is required'),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'user',
      shopName: '',
      licenseNo: '',
      ownerName: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      clearError();
      try {
        const userData = {
          email: values.email.toLowerCase().trim(),
          name: values.username.trim(),
          password: values.password,
          role: values.role === 'admin' ? 'dealer' : 'user',
          shopName: values.role === 'admin' ? values.shopName.trim() : null,
          licenseNo: values.role === 'admin' ? values.licenseNo.trim() : null,
          ownerName: values.role === 'admin' ? values.ownerName.trim() : null,
          verified: values.role === 'admin' ? true : false,
        };

        const result = await register(userData);
        if (result.payload?.user) {
          toast.success('Account created successfully!');
          if (userData.role === 'dealer') {
            navigate('/admin');
          } else {
            navigate('/dashboard');
          }
        } else if (result.error) {
          toast.error(result.payload || 'Registration failed');
        }
      } catch (err) {
        console.error(err);
      }
    },
  });

  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  return (
    <>
      <Helmet>
        <title>Sign Up | Shelf Scout</title>
        <meta name="description" content="Join Shelf Scout today and start your real-time shopping journey." />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6 font-sans relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-teal-200/20 rounded-full blur-3xl animate-pulse delay-700" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="max-w-2xl w-full bg-white/80 backdrop-blur-2xl rounded-[48px] shadow-2xl p-10 md:p-12 space-y-10 border border-white/60 relative z-10"
        >
          <div className="text-center space-y-4">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: -5 }}
              className="w-20 h-20 bg-emerald-600 rounded-[24px] flex items-center justify-center mx-auto shadow-2xl shadow-emerald-200"
            >
              <ShoppingBag className="w-10 h-10 text-white" />
            </motion.div>
            <div className="space-y-1">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Join Shelf Scout</h2>
              <p className="text-slate-500 font-bold">Start your real-time shopping journey today</p>
            </div>
          </div>

          <AnimatePresence>
            {(error || Object.keys(formik.errors).length > 0) && formik.submitCount > 0 && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-start gap-3 bg-red-50 text-red-700 px-6 py-4 rounded-2xl text-sm font-bold border border-red-100"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  {error || "Please check the form for errors."}
                  {Object.values(formik.errors).map((err, i) => (
                    <p key={i} className="text-xs mt-1">• {err}</p>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form className="space-y-8" onSubmit={formik.handleSubmit}>
            <div className="space-y-3">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1 text-center">I am a…</label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: 'user', label: '🛍️ Customer', sub: 'Find & reserve' },
                  { value: 'admin', label: '🏢 Store Admin', sub: 'Manage inventory' },
                ].map(opt => (
                  <motion.button
                    key={opt.value}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => formik.setFieldValue('role', opt.value)}
                    className={`p-5 rounded-[24px] border-2 text-left transition-all ${
                      formik.values.role === opt.value
                        ? 'border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-100'
                        : 'border-slate-100 bg-slate-50 hover:border-slate-200'
                    }`}
                  >
                    <p className="font-black text-sm text-slate-800">{opt.label}</p>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-wider">{opt.sub}</p>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    className="block w-full pl-14 pr-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-[20px] focus:bg-white focus:border-emerald-500 outline-none transition-all text-slate-900 font-bold"
                    placeholder="ScoutMaster"
                    {...formik.getFieldProps('username')}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    className="block w-full pl-14 pr-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-[20px] focus:bg-white focus:border-emerald-500 outline-none transition-all text-slate-900 font-bold"
                    placeholder="scout@mail.com"
                    {...formik.getFieldProps('email')}
                  />
                </div>
              </div>

              <AnimatePresence>
                {formik.values.role === 'admin' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100"
                  >
                    <div className="col-span-full pb-2">
                      <p className="text-xs font-black text-emerald-600 uppercase tracking-[0.2em]">Retail Verification Details</p>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Shop Name</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                          <Store className="h-5 w-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                        </div>
                        <input
                          type="text"
                          name="shopName"
                          className="block w-full pl-14 pr-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-[20px] focus:bg-white focus:border-emerald-500 outline-none transition-all text-slate-900 font-bold"
                          placeholder="Elite Electronics"
                          {...formik.getFieldProps('shopName')}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Business License No.</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                          <FileText className="h-5 w-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                        </div>
                        <input
                          type="text"
                          name="licenseNo"
                          className="block w-full pl-14 pr-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-[20px] focus:bg-white focus:border-emerald-500 outline-none transition-all text-slate-900 font-bold"
                          placeholder="LIC-998877"
                          {...formik.getFieldProps('licenseNo')}
                        />
                      </div>
                    </div>
                    <div className="space-y-2 col-span-full">
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Owner Name</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                          <UserCheck className="h-5 w-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                        </div>
                        <input
                          type="text"
                          name="ownerName"
                          className="block w-full pl-14 pr-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-[20px] focus:bg-white focus:border-emerald-500 outline-none transition-all text-slate-900 font-bold"
                          placeholder="John Doe"
                          {...formik.getFieldProps('ownerName')}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    className="block w-full pl-14 pr-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-[20px] focus:bg-white focus:border-emerald-500 outline-none transition-all text-slate-900 font-bold"
                    placeholder="••••••••"
                    {...formik.getFieldProps('password')}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    className={`block w-full pl-14 pr-5 py-4 bg-slate-50 border-2 rounded-[20px] focus:bg-white outline-none transition-all text-slate-900 font-bold ${
                      formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-300 focus:border-red-500' : 'border-slate-50 focus:border-emerald-500'
                    }`}
                    placeholder="••••••••"
                    {...formik.getFieldProps('confirmPassword')}
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
                  <span>{formik.values.role === 'admin' ? 'Verify & Register Business' : 'Create Account'}</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          <p className="text-center text-slate-500 font-bold">
            Already a scout? <Link to="/login" className="text-emerald-600 font-black hover:underline underline-offset-4">Log in here</Link>
          </p>
        </motion.div>
      </div>
    </>
  );
};

export default Signup;
