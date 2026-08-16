import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout } from 'lucide-react';
import { motion } from 'motion/react';

export function Signup() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center">
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center border border-emerald-200">
            <Sprout className="w-6 h-6 text-emerald-600" />
          </div>
        </motion.div>
        <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900">
          Create an account
        </motion.h2>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-8 px-4 shadow-2xl shadow-slate-200 sm:rounded-2xl sm:px-10 border border-slate-200 text-center">
          <p className="text-slate-600 mb-6 text-sm">
            This is a demonstration environment. For the preview, please use the Login page to access the application.
          </p>
          <Link to="/login" className="inline-flex justify-center items-center py-4 min-h-[56px] text-lg min-h-[48px] px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-slate-900 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-lg shadow-emerald-600/30 transition-colors">
            Go to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
