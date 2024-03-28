import toast from "react-hot-toast";

/**Validate OTP Page  */
export async function logInValidate4(values) {
  const error = logInVerify({}, values);

  return error;
}

/** OTP Validation */
function logInVerify(error = {}, values) {
  if (!values.otp) {
    error = toast.error("OTP Required..... !");
  } else if (values.otp.length < 4) {
    error = toast.error("Invalid Otp....!");
  }

  return error;
}
