import styles from './PiecesInventory.module.scss';
import {Box} from '@mui/material';
import React, {useCallback, useMemo, useState} from 'react';
import {IPieceInventory} from 'stores/EquipmentsRequirementStore';
import {EquipmentsById} from 'components/calculationInput/PiecesCalculationCommonTypes';
import InventoryUpdateDialog, {
  InventoryForm,
} from 'components/calculationInput/equipments/inventory/InventoryUpdateDialog';
import BuiButton from 'components/bui/BuiButton';
import {useStore} from 'stores/WizStore';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'next-i18next';
import {LabeledEquipmentCard} from '../LabeledEquipmentCard';
import {
  useChipForm, useEquipmentCategoryGroup, useEquipmentTierGroup,
} from 'components/calculationInput/common/ActionChips';
import {useWatch} from 'react-hook-form';
import {Equipment, EquipmentCompositionType} from 'model/Equipment';
import {
  Comparators, SortingOrder, buildArrayIndexComparator, buildComparator, reverseComparator,
} from 'common/sortUtils';
import {equipmentCategories} from '../EquipmentFilterChips';
import {ChipFormWithDetails} from 'components/calculationInput/common/ChipFormWithDetails';

export type PieceState = IPieceInventory & {
  needCount: number;
}

const summarize = (piece: PieceState) => ({
  isInStock: piece.inStockCount > 0,
  isNeeded: piece.needCount > 0,
  isEnough: piece.needCount <= piece.inStockCount,
});
type Predicate<T> = (item: T) => boolean;
const filterFuncs: Record<string, Predicate<PieceState>> = {
  default: (piece) => summarize(piece).isInStock,
  needed: (piece) => summarize(piece).isNeeded,
  lacking: (piece) => !summarize(piece).isEnough,
  all: () => true,
};

type Comparator<T> = (a: T, b: T) => number;
const EquipmentComparators = {
  idAscending: buildComparator((it: Equipment) => it.id, Comparators.numericStringAscending),
  idDescending: buildComparator((it: Equipment) => it.id, Comparators.numericStringDescending),
  tierAscending: buildComparator((it: Equipment) => it.tier, Comparators.numberAscending),
  tierDescending: buildComparator((it: Equipment) => it.tier, Comparators.numberDescending),
  categoryAscending: buildComparator(
      (equip: Equipment) => equip.category as typeof equipmentCategories[number],
      buildArrayIndexComparator(equipmentCategories, SortingOrder.Ascending),
  ),
  categoryDescending: buildComparator(
      (equip: Equipment) => equip.category as typeof equipmentCategories[number],
      buildArrayIndexComparator(equipmentCategories, SortingOrder.Descending),
  ),
};
const sortFuncs: Record<string, Comparator<readonly [PieceState, Equipment]>> = {
  default: buildComparator(([, equip]) => equip, EquipmentComparators.idAscending),
  status: buildComparator(
      ([piece]) => summarize(piece),
      (a, b) => Comparators.booleanDescending(a.isEnough, b.isEnough),
      (a, b) => Comparators.booleanAscending(a.isNeeded, b.isNeeded),
      (a, b) => Comparators.booleanAscending(a.isInStock, b.isInStock),
  ),
  tier: buildComparator(([, equip]) => equip, EquipmentComparators.tierAscending),
  category: buildComparator(([, equip]) => equip, EquipmentComparators.categoryDescending),
  needed: buildComparator(([piece]) => piece.needCount, Comparators.numberAscending),
  stock: buildComparator(([piece]) => piece.inStockCount, Comparators.numberAscending),
  lacking: buildComparator(
      ([piece]) => piece.needCount - piece.inStockCount,
      Comparators.numberAscending,
  ),
};

// For performance reason, shows the first 20 pieces only by default.
const defaultMaxVisiblePiecesCount = 20;
const PiecesInventory = (
    {
      piecesState,
      equipmentsById,
    } : {
      piecesState: Map<string, PieceState>
      equipmentsById: EquipmentsById,
    }
) => {
  const {t} = useTranslation('home');
  const store = useStore();
  const inventoryStore = store.equipmentsRequirementStore.piecesInventory;

  const pieces = useMemo(() => (
    Array.from(equipmentsById.values())
        .filter((it) => it.equipmentCompositionType === EquipmentCompositionType.Piece)
        .sort(buildComparator(
            (equip) => equip,
            EquipmentComparators.tierDescending,
            EquipmentComparators.categoryAscending,
            EquipmentComparators.idAscending,
        ))
        .map((piece) => {
          const state = piecesState.get(piece.id) ?? {
            pieceId: piece.id,
            inStockCount: inventoryStore.get(piece.id)?.inStockCount ?? 0,
            needCount: 0,
          };
          return [state, piece] as const;
        })
  ), [equipmentsById, inventoryStore, piecesState]);
  const [piecesToUpdate, setPiecesToUpdate] = useState<PieceState[]>([]);
  const [showAllPieces, setShowAllPieces] = useState(false);

  const [isUpdateInventoryDialogOpened, setIsUpdateInventoryDialogOpened] = useState(false);


  const maxTier = useMemo(() => Math.max(...pieces.map(([, equip]) => equip.tier)), [pieces]);
  const [chipFormProps, formControls] = useChipForm(usePiecesFilterSpec(maxTier), {
    defaultValues: {
      tier: [],
      category: [],
      filter: 'default' as const,
      sort: {key: 'default', order: 'dsc'} as const,
      display: 'needed' as const,
    },
  });
  const [tierFilter, categoryFilter, filterMode, sortMode, displayMode] = useWatch({
    control: formControls.control,
    name: ['tier', 'category', 'filter', 'sort', 'display'],
  });

  const piecesToShow = useMemo(() => {
    const comparator = sortFuncs[sortMode.key] || sortFuncs.default;

    return pieces
        .filter(([pieceState, piece]) => (
          (!tierFilter.length || tierFilter.includes(piece.tier)) &&
            (!categoryFilter.length || categoryFilter.includes(piece.category)) &&
            (filterFuncs[filterMode] || filterFuncs.default)(pieceState)
        ))
        .sort(reverseComparator(comparator, sortMode.order === 'dsc'));
  }, [filterMode, sortMode, pieces, tierFilter, categoryFilter]);

  const visiblePieces = piecesToShow
      .slice(0, showAllPieces ? undefined : defaultMaxVisiblePiecesCount);

  const openSinglePieceUpdateDialog = useCallback((_: unknown, inventory: PieceState) =>{
    setPiecesToUpdate([inventory]);
    setIsUpdateInventoryDialogOpened(true);
  }, []);

  const openAllInventoryUpdateDialog = useCallback(() => {
    setPiecesToUpdate(piecesToShow.map(([piece]) => piece));
    setIsUpdateInventoryDialogOpened(true);
  }, [piecesToShow]);

  const handleCancelUpdateInventory = () => {
    setIsUpdateInventoryDialogOpened(false);
  };
  const handleUpdateInventory = (inventoryForm: InventoryForm) => {
    store.equipmentsRequirementStore.updateInventory(inventoryForm);
    setIsUpdateInventoryDialogOpened(false);
  };
  const toggleShowAllPieces = () => {
    setShowAllPieces(!showAllPieces);
  };

  return <>
    {
      isUpdateInventoryDialogOpened ? <InventoryUpdateDialog pieces={piecesToUpdate}
        onCancel={handleCancelUpdateInventory}
        onUpdate={handleUpdateInventory}
        equipmentsById={equipmentsById}
        isOpened={isUpdateInventoryDialogOpened} /> : null
    }
    <Box width='100%' marginBottom='1rem'>
      <ChipFormWithDetails {...chipFormProps} controls={formControls} />
    </Box>
    {visiblePieces.map(([inventory], index) => (
      <LabeledEquipmentCard key={index} index={inventory}
        showTier showStockCount showCheckIfEnough
        showNeedCount={displayMode === 'needed'}
        showShortageCount={displayMode === 'lacking'}
        onClick={openSinglePieceUpdateDialog}
        equipById={equipmentsById} pieceState={inventory} />
    ))}
    {!visiblePieces.length && <Box alignSelf='center'>{t('filterResultEmpty')}</Box>}
    {
      piecesToShow.length > defaultMaxVisiblePiecesCount ? <div className={styles.editButton}>
        <BuiButton variant={'text'} color={'baTextButtonPrimary'} onClick={toggleShowAllPieces}
          disabled={pieces.length === 0}>
          <div>{showAllPieces ? t('showFewerButton') : t('showAllButton')}</div>
        </BuiButton>
      </div>: null
    }
    <div className={styles.editButton}>
      <BuiButton color={'baButtonSecondary'} onClick={openAllInventoryUpdateDialog}
        disabled={pieces.length === 0}>
        <div>{t('editButton')}</div>
      </BuiButton>
    </div>
  </>;
};

export default observer(PiecesInventory);

const usePiecesFilterSpec = (maxTier: number) => {
  const {t} = useTranslation();
  return {
    tier: useEquipmentTierGroup({
      type: 'check', hide: true,
      title: t('piecesFilter.filter.byTier'),
      minTier: 2, maxTier: 9,
    }),
    category: useEquipmentCategoryGroup({
      type: 'check', hide: true,
      title: t('piecesFilter.filter.byCategory'),
    }),
    filter: {
      type: 'radio',
      title: t('piecesFilter.filter.byStockStatus'),
      uncheckable: false,
      options: [
        {value: 'default', label: t('piecesFilter.filter.inStock')},
        {value: 'needed', label: t('piecesFilter.filter.required')},
        {value: 'lacking', label: t('piecesFilter.filter.insufficient')},
        {value: 'all', label: t('piecesFilter.filter.all')},
      ],
    },
    sort: {
      type: 'sort',
      title: t('piecesFilter.sortBy.title'),
      uncheckable: false,
      options: [
        {value: 'default', label: t('piecesFilter.sortBy.default')},
        {value: 'status', label: t('piecesFilter.sortBy.stockStatus')},
        {value: 'tier', label: t('piecesFilter.sortBy.tier'), hide: true},
        {value: 'category', label: t('piecesFilter.sortBy.category'), hide: true},
        {value: 'needed', label: t('piecesFilter.sortBy.required'), hide: true},
        {value: 'lacking', label: t('piecesFilter.sortBy.shortage'), hide: true},
        {value: 'stock', label: t('piecesFilter.sortBy.stock'), hide: true},
      ],
    },
    display: {
      type: 'radio',
      title: t('piecesFilter.amountLabel.title'),
      uncheckable: false,
      options: [
        {value: 'needed', label: t('piecesFilter.amountLabel.required')},
        {value: 'lacking', label: t('piecesFilter.amountLabel.shortage')},
      ],
    },
  } as const;
};
