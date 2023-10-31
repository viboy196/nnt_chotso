export function validatePhoneNumber(number: string | undefined): boolean {
  console.log('number', number);

  if (number === undefined) {
    return true;
  }
  const input = number?.replace(/-/g, '');
  return /([\+84|84|0|0084]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/.test(input);
}

export function validateName(name: string | undefined): boolean {
  if (name === undefined) {
    return true;
  }
  return name.length >= 2;
}

export function validatePassword(name: string | undefined): boolean {
  if (name === undefined) {
    return true;
  }
  return /^(?=.*[a-zA-Z])([a-zA-Z0-9]{6,})\b/.test(name);
}

export function validatePasswordReDo(
  pass: string | undefined,
  passRedo: string | undefined,
): boolean {
  if (pass === undefined && passRedo === undefined) {
    return true;
  }
  return pass === passRedo;
}

// function ValidateEmail(email: string): Boolean {
//   return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
// }
