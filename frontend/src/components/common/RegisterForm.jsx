import { useState } from 'react';
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ReloadIcon, EyeOpenIcon, EyeClosedIcon } from "@radix-ui/react-icons";
import { registerUser } from "../../store/userReducer"; // Make sure this matches your export
import { Link } from 'react-router-dom';

const RegisterForm = () => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    watch,
    reset,
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  });

  const onSubmit = (data) => {
    // Only send required fields to backend
    const { username, email, password } = data;
    dispatch(registerUser({ username, email, password }));
    reset();
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center items-center min-h-screen"
    >
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Create an Account</CardTitle>
          <CardDescription>Join our community today</CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              {/* Username Field */}
              <div>
                <Label htmlFor="username" className="mb-2 block">Username</Label>
                <Input
                  id="username"
                  placeholder="Enter your username"
                  {...register("username", { 
                    required: "Username is required",
                    minLength: {
                      value: 3,
                      message: "Username must be at least 3 characters"
                    }
                  })}
                  className={errors.username ? "border-destructive" : ""}
                />
                {errors.username && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <Label htmlFor="email" className="mb-2 block">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  {...register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <Label htmlFor="password" className="mb-2 block">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password", { 
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters"
                      }
                    })}
                    className={`pr-10 ${errors.password ? "border-destructive" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('password')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeClosedIcon className="h-5 w-5" />
                    ) : (
                      <EyeOpenIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <Label htmlFor="confirmPassword" className="mb-2 block">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("confirmPassword", { 
                      required: "Please confirm your password",
                      validate: (value) => 
                        value === watch('password') || "Passwords do not match"
                    })}
                    className={`pr-10 ${errors.confirmPassword ? "border-destructive" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <EyeClosedIcon className="h-5 w-5" />
                    ) : (
                      <EyeOpenIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            {/* Form Error */}
            {error && (
              <div className="text-destructive text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>

            <div className="text-center text-sm text-gray-600">
              Already have an account? 
              <Link to="/login" className="ml-1 text-primary hover:underline">Sign in</Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RegisterForm;