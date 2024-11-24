import { ListCategory } from '@/types/enum';

export const ListCategoryWordingMap: Record<ListCategory, string> = {
  [ListCategory.OTHERS]: '其他',
  [ListCategory.LIFESTYLE]: '生活風格',
  [ListCategory.FOOD]: '美食',
  [ListCategory.CULTURE]: '文化',
  [ListCategory.TRAVELING]: '旅遊',
  [ListCategory.ENTERTAINMENT]: '娛樂',
  [ListCategory.TECHNOLOGY]: '數位科技',
  [ListCategory.GROWTH]: '個人成長',
  [ListCategory.HEALTH]: '健康與健身',
};
