import { Categories } from '@/enums/Lists/index.enum';
import { msg } from '@lingui/macro';

export const CategoriesI18n: Record<number, { id: string }> = {
  [Categories.others]: msg`Other`,
  [Categories.lifestyle]: msg`Lifestyle`,
  [Categories.food]: msg`Food & Drink`,
  [Categories.culture]: msg`Culture`,
  [Categories.traveling]: msg`Travel`,
  [Categories.entertainment]: msg`Entertainment`,
  [Categories.technology]: msg`Tech & Digital`,
  [Categories.growth]: msg`Personal Growth`,
  [Categories.health]: msg`Health & Fitness`,
};
