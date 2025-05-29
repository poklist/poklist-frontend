import { z } from 'zod';

// Define the current version of localStorage schema
export const STORAGE_VERSION = '0.1.5';

// Define the version key in localStorage
const VERSION_KEY = '_storage_version';

// Define the schema for version check
const versionSchema = z.string();

/**
 * Check and migrate localStorage data based on version
 * This function should be called when the app initializes
 */
export const checkAndMigrateStorage = (): boolean => {
  const currentVersion = localStorage.getItem(VERSION_KEY);

  // If no version exists or version doesn't match, clear all storage
  if (
    !currentVersion ||
    !versionSchema.safeParse(currentVersion).success ||
    currentVersion !== STORAGE_VERSION
  ) {
    console.log(
      `[STORAGE] currentVersion=${currentVersion} is outdated (expectedVersion=${STORAGE_VERSION}), need to clear all storage`
    );
    // Clear all localStorage data
    localStorage.clear();

    // Set the new version
    localStorage.setItem(VERSION_KEY, STORAGE_VERSION);

    // You can add specific migration logic here if needed
    // For example:
    // if (currentVersion === '0.9.0') {
    //   migrateFromV0_9_0();
    // }
    return true;
  }
  return false;
};
