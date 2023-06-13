
export default function chekForm(input) {
  /* warning message */
  //input email
  const email = document.querySelector("#email");
  if (input.email === '') {
    email.classList.add("warning");
  } else {
    email.classList.remove("warning");
  }

  //input password
  const password = document.querySelector("#password");

  if (input.password === '') {
    password.classList.add("warning");
  } else {
    password.classList.remove("warning");
  }

  //input re-password
  const rePassword = document.querySelector("#rePassword");

  //check re-password
  if (input.password !== input.rePassword) {
    rePassword.classList.add("warning");
  } else if (input.password === input.rePassword) {
    rePassword.classList.remove("warning");
  }
}
