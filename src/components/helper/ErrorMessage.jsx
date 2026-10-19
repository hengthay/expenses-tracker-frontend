import { FiAlertCircle } from 'react-icons/fi';

const ErrorMessage = ({ message }) => {

  if (!message) return null;

  return (
    <div 
      role="alert"
      className="flex items-center justify-between gap-3 p-4 my-4 bg-rose-50/80 border border-rose-200/80 rounded-2xl text-rose-900 shadow-xs animate-in fade-in slide-in-from-top-1 duration-200"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
          <FiAlertCircle className="text-lg" />
        </div>

        <div className="min-w-0">
          <p className="text-xs sm:text-sm font-semibold text-rose-800 wrap-break-word leading-snug">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;