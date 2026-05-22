import { LocalStorageKey } from '@/enums/index.enum';
import { setLocalStorage } from '@/lib/utils';
import { z } from 'zod';

// Define the schema for version check
const versionSchema = z.string().regex(/^\d+\.\d+\.\d+$/);

// Define the current version of localStorage schema (synced from package.json via next.config.mjs)
export const STORAGE_VERSION = versionSchema.parse(
  process.env.NEXT_PUBLIC_APP_VERSION
);

/**
 * Check and migrate localStorage data based on version
 * This function should be called when the app initializes
 */
export const checkAndMigrateStorage = (): boolean => {
  // NOTE: 這裡不要用 getLocalStorage
  const rawVersion = localStorage.getItem(LocalStorageKey.VERSION_KEY);

  // no version exists
  if (rawVersion === null) {
    setLocalStorage(
      LocalStorageKey.VERSION_KEY,
      STORAGE_VERSION,
      versionSchema
    );
    return false;
  }

  let currentVersion = rawVersion;

  // 處理帶引號的線上資料
  if (
    (currentVersion.startsWith('"') && currentVersion.endsWith('"')) ||
    (currentVersion.startsWith(`'`) && currentVersion.endsWith(`'`))
  ) {
    try {
      currentVersion = versionSchema.parse(JSON.parse(currentVersion));
    } catch (e) {
      console.error(e);
    }
  }
  //  or version doesn't match, clear all storage
  if (
    !versionSchema.safeParse(currentVersion).success ||
    currentVersion !== STORAGE_VERSION
  ) {
    console.warn(
      `[STORAGE] currentVersion=${currentVersion} is outdated (expectedVersion=${STORAGE_VERSION}), need to clear all storage`
    );
    // Clear all localStorage data
    localStorage.clear();

    // Set the new version
    setLocalStorage(
      LocalStorageKey.VERSION_KEY,
      JSON.stringify(STORAGE_VERSION),
      versionSchema
    );

    // You can add specific migration logic here if needed
    // For example:
    // if (currentVersion === '0.9.0') {
    //   migrateFromV0_9_0();
    // }
    return true;
  }
  return false;
};
