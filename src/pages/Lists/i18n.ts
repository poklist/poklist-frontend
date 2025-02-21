import { Category } from '@/enums/Lists/index.enum';
import { msg } from '@lingui/macro';

export const CategoriesI18n: Record<number, { id: string }> = {
  [Category.OTHERS]: msg`Other`,
  [Category.LIFESTYLE]: msg`Lifestyle`,
  [Category.FOOD]: msg`Food & Drink`,
  [Category.CULTURE]: msg`Culture`,
  [Category.TRAVELING]: msg`Travel`,
  [Category.ENTERTAINMENT]: msg`Entertainment`,
  [Category.TECHNOLOGY]: msg`Tech & Digital`,
  [Category.GROWTH]: msg`Personal Growth`,
  [Category.HEALTH]: msg`Health & Fitness`,
};
