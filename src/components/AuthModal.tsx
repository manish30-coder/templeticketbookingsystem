import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Shield, Crown, User as UserIcon, Lock, Mail, Phone, IdCard, AlertCircle } from 'lucide-react';
import { Role } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { loginWithPassword, loginAsRole, registerUser, setActiveView } = useApp();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('devotee@divyayatra.org');
  const [password, setPassword] = useState('DevoteePassword@123');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Register Form
  const [regForm, setRegForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    idProofType: 'AADHAAR',
    idProofNumber: '',
  });

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      const res = await loginWithPassword(email, password);
      if (res.success) {
        onClose();
      } else {
        setErrorMsg(res.message || 'Login failed.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      await registerUser(regForm);
      onClose();
      setActiveView('devotee');
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickRole = (role: Role) => {
    loginAsRole(role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 border-2 border-[#D4AF37] shadow-2xl relative space-y-5 text-[#2A0808]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1">
          <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-tr from-[#C5A059] to-[#F4E8C1] flex items-center justify-center text-[#240206] shadow-md">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold font-cinzel text-[#3B040B] pt-1">
            {isRegisterMode ? 'Devotee Registration' : 'Sacred Portal Sign In'}
          </h2>
          <p className="text-xs text-stone-500 font-sans">
            {isRegisterMode
              ? 'Register for verified pilgrimage passes and tokens'
              : 'Access your reservations, verification desk, or admin suite'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Quick Demo Login Buttons */}
        {!isRegisterMode && (
          <div className="p-3.5 bg-[#FAF7EE] rounded-xl border border-dashed border-[#C5A059] space-y-2">
            <span className="text-[11px] font-bold text-[#5C0612] uppercase tracking-wider block font-cinzel">
              One-Click Demo Credentials:
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickRole('DEVOTEE')}
                className="p-1.5 rounded bg-white hover:bg-amber-100 border border-amber-300 text-[11px] font-bold text-stone-800 flex flex-col items-center gap-0.5 transition-colors"
              >
                <UserIcon className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Devotee</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickRole('STAFF')}
                className="p-1.5 rounded bg-white hover:bg-amber-100 border border-amber-300 text-[11px] font-bold text-stone-800 flex flex-col items-center gap-0.5 transition-colors"
              >
                <Shield className="w-3.5 h-3.5 text-orange-600" />
                <span>Staff Officer</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickRole('ADMIN')}
                className="p-1.5 rounded bg-white hover:bg-amber-100 border border-amber-300 text-[11px] font-bold text-stone-800 flex flex-col items-center gap-0.5 transition-colors"
              >
                <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Admin</span>
              </button>
            </div>
          </div>
        )}

        {/* Login Form */}
        {!isRegisterMode ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-amber-300 bg-[#FAF7EE] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  placeholder="name@domain.org"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-amber-300 bg-[#FAF7EE] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-[#3B040B] hover:bg-[#5C0612] text-amber-50 font-bold font-cinzel text-xs tracking-wider transition-colors disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In to Portal'}
            </button>

            <div className="text-center pt-2 text-stone-500 text-xs">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setIsRegisterMode(true)}
                className="text-[#5C0612] font-bold underline"
              >
                Register as Devotee
              </button>
            </div>
          </form>
        ) : (
          /* Registration Form */
          <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs font-sans">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={regForm.fullName}
                onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                placeholder="e.g. Meenakshi Sundaram"
                className="w-full px-3 py-1.5 rounded-lg border border-amber-300 bg-[#FAF7EE] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={regForm.email}
                  onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                  placeholder="devotee@domain.org"
                  className="w-full px-3 py-1.5 rounded-lg border border-amber-300 bg-[#FAF7EE] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Mobile Phone *</label>
                <input
                  type="text"
                  required
                  value={regForm.phone}
                  onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                  placeholder="+91 9876543210"
                  className="w-full px-3 py-1.5 rounded-lg border border-amber-300 bg-[#FAF7EE] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Photo ID Type *</label>
                <select
                  value={regForm.idProofType}
                  onChange={(e) => setRegForm({ ...regForm, idProofType: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-amber-300 bg-[#FAF7EE] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                >
                  <option value="AADHAAR">Aadhaar Card</option>
                  <option value="PASSPORT">Passport</option>
                  <option value="VOTER_ID">Voter ID</option>
                  <option value="PAN">PAN Card</option>
                  <option value="DRIVING_LICENSE">Driving License</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">ID Number *</label>
                <input
                  type="text"
                  required
                  value={regForm.idProofNumber}
                  onChange={(e) => setRegForm({ ...regForm, idProofNumber: e.target.value })}
                  placeholder="e.g. 1234-5678-9012"
                  className="w-full px-3 py-1.5 rounded-lg border border-amber-300 bg-[#FAF7EE] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-[#3B040B] hover:bg-[#5C0612] text-amber-50 font-bold font-cinzel text-xs tracking-wider transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? 'Creating Account...' : 'Complete Devotee Registration'}
            </button>

            <div className="text-center pt-1 text-stone-500 text-xs">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setIsRegisterMode(false)}
                className="text-[#5C0612] font-bold underline"
              >
                Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
