"use client";

/**
 * In-memory profile store using localStorage for persistence.
 * In production this would be backed by the API.
 */

import { generateProfile, type BrowserProfile } from "./fingerprint-types";

const STORAGE_KEY = "cykani_profiles";

function loadProfiles(): BrowserProfile[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as BrowserProfile[]) : [];
  } catch {
    return [];
  }
}

function saveProfiles(profiles: BrowserProfile[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
}

export function getAllProfiles(): BrowserProfile[] {
  return loadProfiles();
}

export function createProfile(os: BrowserProfile["os"], name?: string): BrowserProfile {
  const profile = generateProfile(os, name);
  const existing = loadProfiles();
  saveProfiles([profile, ...existing]);
  return profile;
}

export function deleteProfile(id: string): void {
  const existing = loadProfiles();
  saveProfiles(existing.filter((p) => p.id !== id));
}

export function cloneProfile(id: string): BrowserProfile | null {
  const existing = loadProfiles();
  const original = existing.find((p) => p.id === id);
  if (!original) return null;
  const cloned = generateProfile(original.os, `${original.name} (copy)`);
  saveProfiles([cloned, ...existing]);
  return cloned;
}

export function updateProfileName(id: string, name: string): void {
  const existing = loadProfiles();
  const updated = existing.map((p) => (p.id === id ? { ...p, name } : p));
  saveProfiles(updated);
}

export function updateProfileProxy(id: string, proxy: string): void {
  const existing = loadProfiles();
  const updated = existing.map((p) => (p.id === id ? { ...p, proxy } : p));
  saveProfiles(updated);
}
