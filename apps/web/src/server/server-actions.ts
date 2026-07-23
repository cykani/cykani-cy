"use server";

import { cookies } from "next/headers";

import {
  PREFERENCE_DEFAULTS,
  type PreferenceKey,
  type PreferenceValueMap,
} from "@/lib/preferences/preferences-config";

/**
 * Read a preference value from cookies on the server.
 * Falls back to the default value if the cookie is not set.
 */
export async function getPreference<K extends PreferenceKey>(
  key: K,
  validValues: readonly string[],
  defaultValue: PreferenceValueMap[K],
): Promise<PreferenceValueMap[K]> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(`pref_${key}`)?.value;

  if (raw && validValues.includes(raw)) {
    return raw as PreferenceValueMap[K];
  }

  return (PREFERENCE_DEFAULTS[key] ?? defaultValue) as PreferenceValueMap[K];
}

/**
 * Read a raw cookie value by name.
 */
export async function getValueFromCookie(name: string): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(name)?.value ?? null;
}

/**
 * Set a cookie value (server action).
 */
export async function setValueToCookie(name: string, value: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(name, value, {
    path: "/",
    httpOnly: false,
    sameSite: "lax",
  });
}
