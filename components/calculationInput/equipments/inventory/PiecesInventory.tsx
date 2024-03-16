import styles from './PiecesInventory.module.scss';
import {
  Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
  Popover, PopoverProps, useMediaQuery, useTheme,
} from '@mui/material';
import React, {useCallback, useMemo, useRef, useState} from 'react';
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
  ChipForm, useChipForm, useEquipmentCategoryGroup, useEquipmentTierGroup,
} from 'components/calculationInput/common/ActionChips';
import {useWatch} from 'react-hook-form';
import {Equipment, EquipmentCompositionType} from 'model/Equipment';
import {
  Comparators, SortingOrder, buildArrayIndexComparator, buildComparator, reverseComparator,
} from 'common/sortUtils';
import {equipmentCategories} from '../EquipmentFilterChips';

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
  const theme = useTheme();
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


  const defaultValues = {
    tier: [],
    category: [],
    filter: 'default' as const,
    sort: {key: 'default', order: 'dsc'} as const,
    display: 'needed' as const,
  };
  const [chipFormProps, formControls] = useChipForm(usePiecesFilterSpec(), {defaultValues});
  const [tierFilter, categoryFilter, filterMode, sortMode, displayMode] = useWatch({
    control: formControls.control,
    name: ['tier', 'category', 'filter', 'sort', 'display'],
  });

  const piecesToShow = useMemo(() => {
    const filter = filterFuncs[filterMode] || filterFuncs.default;
    const comparator = sortFuncs[sortMode.key] || sortFuncs.default;

    return pieces
        .filter(([, piece]) => (
          (!tierFilter.length || tierFilter.includes(piece.tier)) &&
            (!categoryFilter.length || categoryFilter.includes(piece.category as any))
        ))
        .filter(([piece]) => filter(piece))
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

  const isDialogMode = useMediaQuery(theme.breakpoints.down('sm'));
  const [isFilterDetailOpened, setFilterDetailOpened] = useState(false);
  const [dialogFormProps, dialogFormControls] = useChipForm(chipFormProps.spec, {defaultValues});
  const filterPopoverAnchor = useRef<PopoverProps['anchorEl']>(null);
  const callbacks = {
    handleOpenDetail: (e: React.MouseEvent<HTMLInputElement>) => {
      setFilterDetailOpened(true);
      if (isDialogMode) {
        dialogFormControls.reset(formControls.getValues(), {keepDefaultValues: true});
      } else {
        const rect = e.currentTarget?.getBoundingClientRect();
        filterPopoverAnchor.current = {getBoundingClientRect: () => rect, nodeType: 1} as any;
      }
    },
    handlePopoverClose: () => {
      setFilterDetailOpened(false);
    },
    handleResetFilter: () => {
      formControls.reset();
    },
    handleDialogReset: () => {
      dialogFormControls.reset();
    },
    handleDialogCancel: () => {
      setFilterDetailOpened(false);
    },
    handleDialogClose: () => {
      formControls.reset(dialogFormControls.getValues(), {keepDefaultValues: true});
      setFilterDetailOpened(false);
    },
  };

  const filterChips = <>
    <Box width='100%' marginBottom='1rem'>
      <ChipForm {...chipFormProps} variant='default'>
        <Box role='group' className={styles.additionalChips}>
          <Chip color='primary' size='small' variant='outlined' label='詳細'
            onClick={callbacks.handleOpenDetail} />
          <Chip color='error' size='small' variant='outlined' label='リセット'
            onClick={callbacks.handleResetFilter} />
        </Box>
      </ChipForm>
    </Box>
    {isDialogMode ? <Dialog open={isFilterDetailOpened}>
      <DialogTitle>
        タイトル
      </DialogTitle>
      <DialogContent>
        <ChipForm {...dialogFormProps} variant='dialog' />
      </DialogContent>
      <DialogActions>
        <Button onClick={callbacks.handleDialogReset}>リセット</Button>
        <Button onClick={callbacks.handleDialogCancel}>キャンセル</Button>
        <Button onClick={callbacks.handleDialogClose}>Ok</Button>
      </DialogActions>
    </Dialog> : <Popover open={isFilterDetailOpened} onClose={callbacks.handlePopoverClose}
      anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
      transformOrigin={{vertical: -16, horizontal: 'center'}}
      anchorEl={filterPopoverAnchor.current}
      disableScrollLock>
      <ChipForm {...chipFormProps} className={styles.filterPopover} variant='collapse' />
    </Popover>}
  </>;

  return <>
    {
      isUpdateInventoryDialogOpened ? <InventoryUpdateDialog pieces={piecesToUpdate}
        onCancel={handleCancelUpdateInventory}
        onUpdate={handleUpdateInventory}
        equipmentsById={equipmentsById}
        isOpened={isUpdateInventoryDialogOpened} /> : null
    }
    {filterChips}
    {visiblePieces.map(([inventory], index) => (
      <LabeledEquipmentCard key={index} index={inventory}
        showStockCount showCheckIfEnough
        showNeedCount={displayMode === 'needed'}
        showShortageCount={displayMode === 'lacking'}
        onClick={openSinglePieceUpdateDialog}
        equipById={equipmentsById} pieceState={inventory} />
    ))}
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

const usePiecesFilterSpec = () => ({
  tier: useEquipmentTierGroup({
    type: 'check', hide: true,
    title: 'Tier',
    minTier: 2, maxTier: 9,
  }),
  category: useEquipmentCategoryGroup({
    type: 'check', hide: true,
    title: 'カテゴリ',
  }),
  filter: {
    type: 'radio',
    title: '在庫状態',
    uncheckable: false,
    options: [
      {value: 'default', label: '所持のみ'},
      {value: 'needed', label: '必要のみ'},
      {value: 'lacking', label: '不足のみ'},
      {value: 'all', label: 'すべて'},
    ],
  },
  sort: {
    type: 'sort',
    title: '並べ替え',
    uncheckable: false,
    options: [
      {value: 'default', label: 'デフォルト'},
      {value: 'status', label: '在庫状況'},
      {value: 'tier', label: 'Tier', hide: true},
      {value: 'category', label: 'カテゴリ', hide: true},
      {value: 'needed', label: '必要数', hide: true},
      {value: 'lacking', label: '不足数', hide: true},
      {value: 'stock', label: '在庫数', hide: true},
    ],
  },
  display: {
    type: 'radio',
    title: 'ラベルの表示',
    uncheckable: false,
    options: [
      {value: 'needed', label: '必要数'},
      {value: 'lacking', label: '不足数'},
    ],
  },
} as const);
