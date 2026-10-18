import { useState } from 'react';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { createUser } from '../feature/user/userSlice';

const Register = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Payload ready for Spring Security JWT registration:', credentials);
      
      await dispatch(createUser(credentials)).unwrap();

      Swal.fire({
        title: "Success",
        text: "Your account has been created successfully!",
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });

      setTimeout(() => {
        navigate('/login');
      }, 2000);

      setCredentials({ username: "", email: "", password: "" });
    } catch (error) {
      Swal.fire({
        title: "Registration Failed",
        text: "Could not create your account. Please try again.",
        icon: 'error',
        timer: 2000,
        showConfirmButton: false
      });
      console.error('Registration failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans dark:bg-slate-900 transition-colors duration-200">
      <div className="w-full sm:w-120 mx-auto">
        <div className="w-full">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 dark:text-white">
            Create an Account
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
            Join Expense Tracker to manage your finances
          </p>
        </div>

        <div className="mt-8 w-full">
          <div className="w-full bg-white dark:bg-slate-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-200 dark:border-slate-700">
            <form className="space-y-6 w-full" onSubmit={handleSubmit}>
              <div className="flex flex-col space-y-1.5">
                <label 
                  htmlFor="username" 
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={credentials.username}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-600 focus:border-blue-600 dark:bg-slate-900 dark:text-white sm:text-sm"
                  placeholder="johndoe"
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Email address
                </label>
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

              <div className="flex flex-col space-y-1.5">
                <label 
                  htmlFor="password" 
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={credentials.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-600 focus:border-blue-600 dark:bg-slate-900 dark:text-white sm:text-sm"
                  placeholder="••••••••"
                />
              </div>

              <div className="w-full">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-500 disabled:opacity-50 transition-colors"
                >
                  {isLoading ? 'Creating account...' : 'Register'}
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
                    Already have an account?
                  </span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Link 
                  to="/login" 
                  className="w-full flex justify-center py-2 px-4 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors"
                >
                  Sign in instead
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;