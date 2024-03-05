import {Equipment} from 'model/Equipment';
import {useCallback} from 'react';
import {useWatch} from 'react-hook-form';
import {
  useChipForm, useEquipmentCategoryGroup, useEquipmentTierGroup,
} from '../common/ActionChips';


const isNully = (x: unknown): x is null | undefined => x === null || x === undefined;

export const equipmentCategories = [
  'Hat', 'Gloves', 'Shoes',
  'Bag', 'Badge', 'Hairpin',
  'Charm', 'Watch', 'Necklace',
] as const;
type EquipmentCategory = typeof equipmentCategories[number];

export const useEquipmentFilterChips = ({
  minTier = 1, maxTier,
  categories = equipmentCategories,
}: {
  minTier?: number, maxTier: number,
  categories?: readonly EquipmentCategory[],
}) => {
  const [chipFormProps, {control}] = useChipForm({
    tier: useEquipmentTierGroup({type: 'radio', uncheckable: true, minTier, maxTier}),
    category: useEquipmentCategoryGroup({type: 'radio', uncheckable: true, categories}),
  }, {
    defaultValues: {
      tier: null,
      category: null,
    },
  });
  const [tier, category] = useWatch({control, name: ['tier', 'category']});
  const filterEnabled = [tier, category].some((x) => !isNully(x));
  const filterFunc = useCallback((equipment: Equipment) => {
    return (isNully(tier) || equipment.tier === tier) &&
      (isNully(category) || equipment.category === category);
  }, [category, tier]);

  return [chipFormProps, filterFunc, filterEnabled] as const;
};
