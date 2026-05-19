import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { login } from '../../api/auth';
import { useAuth } from '../../hooks/useAuth';
import { useI18n } from '../../i18n/I18nProvider';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { loginSuccess } = useAuth();
  const { t, isRtl } = useI18n();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login({ email, password });
      const { accessToken, refreshToken, admin } = res.data.data;
      loginSuccess({ accessToken, refreshToken }, admin);
      toast.success(t('auth.success'));
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || t('auth.invalid'));
    } finally {
      setLoading(false);
    }
  };

  const inputIconClass = `absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-gray-400`;
  const inputClass = `w-full ${isRtl ? 'pr-9 pl-4' : 'pl-9 pr-4'} py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white`;
  const passwordInputClass = `w-full ${isRtl ? 'pr-9 pl-12' : 'pl-9 pr-12'} py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white`;
  const toggleClass = `absolute ${isRtl ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600`;

  return (
    <div className="min-h-screen bg-bg relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      <div className="absolute -top-24 -right-24 w-[28rem] h-[28rem] rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-[28rem] h-[28rem] rounded-full bg-secondary/10 blur-3xl" />

      <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-10">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 border border-gray-200 text-xs text-gray-700">
              {t('auth.badge')}
              <span className="text-gray-400">/</span>
              {t('auth.role')}
            </div>
            <h1 className="mt-5 text-4xl font-extrabold text-gray-900">{t('auth.headline')}</h1>
            <p className="mt-2 text-sm text-gray-600">{t('auth.description')}</p>
          </div>

          <div className="bg-white/85 backdrop-blur rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-extrabold text-gray-900">{t('auth.title')}</h2>
              <p className="mt-1 text-sm text-gray-500">{t('auth.subtitle')}</p>
            </div>

            
            <div className="mb-6 rounded-xl border border-primary/15 bg-primary/5 px-4 py-3 text-sm">
              <div className="font-semibold text-gray-800">{t('auth.credentialsTitle')}</div>
              <div className="mt-2 grid gap-1 text-gray-600">
                <div className="flex items-center justify-between gap-3">
                  <span>{t('auth.email')}</span>
                  <span className="font-mono text-xs text-gray-900">admin@propertyonline.com</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>{t('auth.password')}</span>
                  <span className="font-mono text-xs text-gray-900">admin123456</span>
                </div>
              </div>
            </div>
            

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.email')}</label>
                <div className="relative">
                  <Mail size={16} className={inputIconClass} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="admin@propertyonline.com"
                    className={inputClass}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.password')}</label>
                <div className="relative">
                  <Lock size={16} className={inputIconClass} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="********"
                    className={passwordInputClass}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className={toggleClass}
                    aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                {loading ? t('auth.submitting') : t('auth.submit')}
              </button>
            </form>
          </div>

          <div className="mt-6 text-center text-xs text-gray-400">
            (c) {new Date().getFullYear()} Property Online. {t('auth.rights')}
          </div>
        </div>
      </div>
    </div>
  );
}
