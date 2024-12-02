import * as Crypto from "crypto-js";
import bcrypt from "bcryptjs-react";

export const hash = async (email, password) => {
  const salt = await bcrypt.genSalt(12);
  const hashDetails = Crypto.AES.encrypt(
    JSON.stringify({
      email,
      password,
    }),
    salt
  );
  localStorage.setItem("_user", hashDetails);
  localStorage.setItem("__user", salt);
};

export const unHash = async () => {
  const _user = localStorage.getItem("_user") ?? "_";
  const __user = localStorage.getItem("__user") ?? "_";
  const cred = Crypto.AES.decrypt(_user, __user);

  if (!Object.is(__user, '_'), !Object.is(_user, '_')) {
    return JSON.parse(cred.toString(Crypto.enc.Utf8) ?? "");
  }
};

export const clear = () => {
  localStorage.setItem("_user", "_");
  localStorage.setItem("__user", "_");
};
