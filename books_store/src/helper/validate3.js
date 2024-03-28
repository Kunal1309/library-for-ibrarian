import toast from "react-hot-toast";

/**Validate OTP Page  */
export async function logInValidate3(values) {
  const error = logInVerify({}, values);

  return error;
}

/** Email Validation To Send OTP*/
function logInVerify(error = {}, values) {
  if (!values.email) {
    error = toast.error("Email Required..... !");
  } else if (values.email.includes(" ")) {
    error = toast.error("Invalid Email....!");
  }

  return error;
}
