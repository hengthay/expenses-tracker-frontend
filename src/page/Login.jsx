import { useState } from 'react';
import Swal from 'sweetalert2';
import { loginUser, selectUserToken } from '../feature/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Login = () => {

  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector(selectUserToken);

  console.log(userData);
  
  const handleChange = (e) => {
    const { name, value } = e.target;

    setCredentials((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  
  console.log(credentials);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Payload ready for Spring Security JWT authentication:', credentials);
      
      await dispatch(loginUser(credentials)).unwrap();

      Swal.fire({
        title: "Successfully",
        text: "Your login is successfully!",
        icon: 'success',
        timer: 2000,
      })

      const timeOut = setTimeout(() => {
        navigate('/');
      }, 2000);

      // Clear form
      setCredentials({email: "", password: ""})

      return () => clearTimeout(timeOut);
    } catch (error) {
      Swal.fire({
        title: "Login Failed",
        text: "Your login is not success!",
        icon: 'error',
        timer: 2000,
      })
      console.error('Authentication failed', error);
    } finally {
      setIsLoading(false);
      setCredentials({
        email: "",
        password: ""
      })
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans dark:bg-slate-900 transition-colors duration-200">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 dark:text-white">
          Expense Tracker
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
          Sign in to access your financial dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-200 dark:border-slate-700">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={credentials.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-600 focus:border-blue-600 dark:bg-slate-900 dark:text-white sm:text-sm"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={credentials.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-600 focus:border-blue-600 dark:bg-slate-900 dark:text-white sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-500 disabled:opacity-50 transition-colors"
              >
                {isLoading ? 'Authenticating...' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300 dark:border-slate-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                  Don't have an account?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <a 
                href="/register" 
                className="w-full flex justify-center py-2 px-4 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors"
              >
                Register a new account
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;