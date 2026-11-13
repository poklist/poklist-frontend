export enum Category {
  OTHERS = 1,
  LIFESTYLE = 2,
  FOOD = 3,
  CULTURE = 4,
  TRAVELING = 5,
  ENTERTAINMENT = 6,
  TECHNOLOGY = 7,
  GROWTH = 8,
  HEALTH = 9,
}

export enum ListType {
  PUBLIC = 1,
  PRIVATE = 2,
}

export enum ListLockMethod {
  NONE = 'none',
  PASSWORD = 'password',
  QUESTION = 'question',
}

// BE §3：密碼／題目設定版本的啟用狀態，不代表名單是否刪除
export enum LockConfigStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

// BE §3：名額限制模式；判斷不限人數只看這個，不看 limitCount／remainingCount
export enum CapacityLimitMode {
  LIMITED = 'limited',
  UNLIMITED = 'unlimited',
}
