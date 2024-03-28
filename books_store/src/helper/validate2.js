import toast from "react-hot-toast";

/**Validate To Get OTP Page  */
export async function logInValidate2(values) {
  const error = logInVerify({}, values);

  return error;
}

/** Password Validation for OTP */
function logInVerify(error = {}, values) {
  if (values.password.length < 4) {
    error = toast.error("Password must be greater than 04 Character..... !");
  } else if (values.password !== values.confirmPassword) {
    error = toast.error("Password && Confrim Password must be same....!");
  }

  return error;
}
