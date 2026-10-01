import { Category } from '@/enums/Lists/index.enum';
import { msg } from '@lingui/macro';

export const CategoriesI18n: Record<number, { id: string }> = {
  [Category.OTHERS]: msg`其他`,
  [Category.LIFESTYLE]: msg`生活風格`,
  [Category.FOOD]: msg`美食`,
  [Category.CULTURE]: msg`文化`,
  [Category.TRAVELING]: msg`旅遊`,
  [Category.ENTERTAINMENT]: msg`娛樂`,
  [Category.TECHNOLOGY]: msg`數位科技`,
  [Category.GROWTH]: msg`個人成長`,
  [Category.HEALTH]: msg`健康與健身`,
};
