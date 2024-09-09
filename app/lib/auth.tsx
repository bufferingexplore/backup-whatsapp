"use server";

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { jwtVerify } from "jose";
const SECRET_KEY = new TextEncoder().encode("mahirushiina");

export const setLoginSession = async (res, user, rememberMe) => {
  const expiresIn = rememberMe ? "30d" : "4h"; // 30 hari jika diingat, 1 jam jika tidak
  const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
    expiresIn,
  });
  async function setCookie(data) {
    cookies().set("accessToken", data, {
      httpOnly: true,
      path: "/",
      maxAge: expiresIn === "30d" ? 30 * 24 * 60 * 60 : undefined,
    });
  }
  return setCookie(token);
};

export const verifyToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload;
  } catch (error) {
    return null;
  }
};

export const getLoginSession = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (!token) return null;
  const decoded = await verifyToken(token);
  return decoded;
};
