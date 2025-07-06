import { useState } from 'react';
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReloadIcon, EyeOpenIcon, EyeClosedIcon } from "@radix-ui/react-icons";
import { loginUser } from "../../store/userReducer";

const LoginForm = () => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = (data) => {
    dispatch(loginUser(data));
    reset();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
          <CardTitle className="text-2xl">Login to Your Account</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
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

              {/* Password Field with Toggle */}
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
                    onClick={togglePasswordVisibility}
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
                  Logging in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
            {/* Register Link */}
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="text-primary hover:underline">
                Register
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LoginForm;