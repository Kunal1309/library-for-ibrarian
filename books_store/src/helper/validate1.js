import toast from "react-hot-toast";

/**Validate Registration Page  */
export async function logInValidate1(values) {
  const emailList = await fetch(`${window.location.origin}/login/listofemail`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const emailJsonList = await emailList.json();
  const error = logInVerify({}, values, emailJsonList);

  return error;
}

/** LogIn Validation */
function logInVerify(error = {}, values, emailJsonList) {
  if (!values.name) {
    error = toast.error("Name Required..... !");
  } else if (!values.email) {
    error = toast.error("Email Required..... !");
  } else if (values.email.includes(" ")) {
    error = toast.error("Invalid Email....!");
  } else if (emailJsonList.includes(values.email)) {
    error = toast.error("Email already registered....!");
  } else if (values.mobile.includes(" ")) {
    error = toast.error("Invalid Mobile No.....!");
  } else if (!values.mobile) {
    error = toast.error("Mobile no. Required....!");
  } else if (!values.password) {
    error = toast.error("Password Required....!");
  } else if (values.password.includes(" ")) {
    error = toast.error("Invalid Password....!");
  } else if (!values.conpassword) {
    error = toast.error("Password Required....!");
  } else if (values.conpassword.includes(" ")) {
    error = toast.error("Invalid Confirm Password....!");
  } else if (values.password !== values.conpassword) {
    error = toast.error("Confirm Password not match with Password");
  }

  return error;
}
