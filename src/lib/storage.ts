import { LocalStorageKey } from '@/enums/index.enum';
import { getLocalStorage, setLocalStorage } from '@/lib/utils';
import { z } from 'zod';

// Define the current version of localStorage schema
export const STORAGE_VERSION = '0.3.10';

// Define the schema for version check
const versionSchema = z.string().regex(/^\d+\.\d+\.\d+$/);

/**
 * Check and migrate localStorage data based on version
 * This function should be called when the app initializes
 */
export const checkAndMigrateStorage = (): boolean => {
  const currentVersion = getLocalStorage(
    LocalStorageKey.VERSION_KEY,
    versionSchema
  );

  // If no version exists or version doesn't match, clear all storage
  if (
    !currentVersion ||
    !versionSchema.safeParse(currentVersion).success ||
    currentVersion !== STORAGE_VERSION
  ) {
    if (currentVersion === undefined) {
      setLocalStorage(
        LocalStorageKey.VERSION_KEY,
        STORAGE_VERSION,
        versionSchema
      );
      return false;
    }

    console.warn(
      `[STORAGE] currentVersion=${currentVersion} is outdated (expectedVersion=${STORAGE_VERSION}), need to clear all storage`
    );
    // Clear all localStorage data
    localStorage.clear();

    // Set the new version
    setLocalStorage(
      LocalStorageKey.VERSION_KEY,
      STORAGE_VERSION,
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
