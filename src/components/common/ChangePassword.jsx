import { Grid } from "@mui/material";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { getAuthConfigSafe } from "../../utils/dateUtils";
import {config} from '@config';

function ChangePassword() {
  const backendUrl = config.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUpperCase: false,
    hasNumber: false,
    hasSpecialChar: false
  });

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Password validation function
  const validatePassword = (password) => {
    const validation = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };
    
    setPasswordValidation(validation);
    return Object.values(validation).every(Boolean);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.oldPassword) {
      newErrors.oldPassword = "Current password is required";
    }
    
    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (!validatePassword(formData.newPassword)) {
      newErrors.newPassword = "Please ensure your password meets all requirements";
    }
    
    if (!formData.confirmNewPassword) {
      newErrors.confirmNewPassword = "Please confirm your new password";
    } else if (formData.newPassword !== formData.confirmNewPassword) {
      newErrors.confirmNewPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'newPassword') {
      validatePassword(value);
    }

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
     const config = getAuthConfigSafe()

      const submitData = {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      };

      const response = await axios.post(
        `${backendUrl}/User/ChangePassword`,
        submitData,
        config
      );

      if (response.data && response.status === 201) {
        toast.success(
          "Password changed successfully! Please Login again with new credentials!!"
        );

        const shouldLogout = window.confirm(
          "Your password has been changed. Please re-login with your new password"
        );

        if (shouldLogout) {
          localStorage.removeItem("persist:root");
          sessionStorage.removeItem("currentUser");
          navigate("/login");
          window.location.reload();
        } else {
        }
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (error) {
      console.error("Password change error:", error);
      if (error.response) {
        const errorMessage =
          error.response.data || "Failed to change password. Please try again.";
        console.log(error.response);

        if (error.response?.data?.status === 400) {
          if (error.response.data?.includes("Old Password doesnot match")) {
            setErrors({
              oldPassword: "The current password is incorrect.",
            });
            toast.error("The current password is incorrect.");
          } else {
            toast.error(errorMessage);
          }
        } else {
          toast.error(errorMessage);
        }

        setErrors({
          submit: errorMessage,
        });
      } else if (error.request) {
        toast.error("No response from server. Please check your connection.");
        setErrors({
          submit: "Network error. Please check your connection.",
        });
      } else {
        toast.error("An error occurred. Please try again.");
        setErrors({
          submit: "An error occurred. Please try again.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPasswordField = (name, label, value) => (
    <div className="relative mt-6">
      <div className="relative">
        <input
          type={showPasswords[name] ? "text" : "password"}
          name={name}
          value={value}
          onChange={handleChange}
          className="w-full px-0 py-1 pr-10 mt-1 placeholder-transparent border-b-2 border-gray-300 peer focus:border-gray-500 focus:outline-none"
        />
        <button
          type="button"
          onClick={() => togglePasswordVisibility(name)}
          className="absolute right-0 text-gray-500 -translate-y-1/2 top-1/2 hover:text-gray-700"
        >
          {showPasswords[name] ? (
            <AiOutlineEyeInvisible size={20} />
          ) : (
            <AiOutlineEye size={20} />
          )}
        </button>
      </div>
      <label className="absolute top-0 left-0 text-sm text-gray-800 origin-left transform -translate-y-1/2 opacity-75 pointer-events-none">
        {label}
      </label>
      {errors[name] && (
        <p className="mt-1 text-xs text-red-500">{errors[name]}</p>
      )}
    </div>
  );

  // Check if form is valid for submission
  const isFormValid = Object.values(passwordValidation).every(Boolean) && 
                     formData.newPassword === formData.confirmNewPassword &&
                     formData.oldPassword.length > 0 &&
                     formData.newPassword.length > 0 &&
                     formData.confirmNewPassword.length > 0;

  return (
    <Grid container className="my-8">
      <Grid item mx="auto" sm={4}>
        <div className="relative w-full px-4 pt-4 pb-8 mx-auto bg-white shadow-xl ring-1 ring-gray-900/5 sm:rounded-xl sm:px-10">
          <div className="w-full">
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-[#1169bf]">
                Change Password
              </h1>
              <p className="mt-2 text-gray-500">
                Secure Your Account – Update Your Password
              </p>
            </div>
            <div className="mt-5">
              <form onSubmit={handleSubmit}>
                {renderPasswordField(
                  "oldPassword",
                  "Current Password",
                  formData.oldPassword
                )}
                {renderPasswordField(
                  "newPassword",
                  "New Password",
                  formData.newPassword
                )}

                {/* Password Requirements */}
                {formData.newPassword && (
                  <div className="p-3 mt-4 rounded-lg bg-gray-50">
                    <p className="mb-2 text-xs font-medium text-gray-600">
                      Password Requirements:
                    </p>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        {passwordValidation.minLength ? (
                          <FaCheckCircle className="text-xs text-green-500" />
                        ) : (
                          <FaTimesCircle className="text-xs text-red-500" />
                        )}
                        <span className={`text-xs ${passwordValidation.minLength ? 'text-green-600' : 'text-red-600'}`}>
                          At least 8 characters
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {passwordValidation.hasUpperCase ? (
                          <FaCheckCircle className="text-xs text-green-500" />
                        ) : (
                          <FaTimesCircle className="text-xs text-red-500" />
                        )}
                        <span className={`text-xs ${passwordValidation.hasUpperCase ? 'text-green-600' : 'text-red-600'}`}>
                          At least one uppercase letter
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {passwordValidation.hasNumber ? (
                          <FaCheckCircle className="text-xs text-green-500" />
                        ) : (
                          <FaTimesCircle className="text-xs text-red-500" />
                        )}
                        <span className={`text-xs ${passwordValidation.hasNumber ? 'text-green-600' : 'text-red-600'}`}>
                          At least one number
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {passwordValidation.hasSpecialChar ? (
                          <FaCheckCircle className="text-xs text-green-500" />
                        ) : (
                          <FaTimesCircle className="text-xs text-red-500" />
                        )}
                        <span className={`text-xs ${passwordValidation.hasSpecialChar ? 'text-green-600' : 'text-red-600'}`}>
                          At least one special character
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {renderPasswordField(
                  "confirmNewPassword",
                  "Confirm New Password",
                  formData.confirmNewPassword
                )}

                {errors.submit && (
                  <p className="mt-4 text-sm text-center text-red-500">
                    {errors.submit}
                  </p>
                )}

                <div className="my-6">
                  <button
                    type="submit"
                    disabled={isSubmitting || !isFormValid}
                    className="w-full rounded-md bg-[#1169bf] px-3 py-2 text-white focus:bg-gray-600 focus:outline-none disabled:bg-gray-400"
                  >
                    {isSubmitting ? "Changing Password..." : "Change Password"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Grid>
    </Grid>
  );
}

export default ChangePassword;