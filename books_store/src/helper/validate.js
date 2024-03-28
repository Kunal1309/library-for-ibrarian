import toast from "react-hot-toast";

/**Validate Log in Page  */
export async function logInValidate(values) {
  const error = logInVerify({}, values);

  return error;
}

/** LogIn Validation (Email & Password) */
function logInVerify(error = {}, values) {
  if (!values.email) {
    error = toast.error("Email Required..... !");
  } else if (values.email.includes(" ")) {
    error = toast.error("Invalid Email....!");
  } else if (!values.password) {
    error = toast.error("Password Required....!");
  } else if (values.password.includes(" ")) {
    error = toast.error("Invalid Password....!");
  }

  return error;
}
