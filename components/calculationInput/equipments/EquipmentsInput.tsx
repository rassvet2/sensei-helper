import styles from './EquipmentsInput.module.scss';
import BuiLinedText from 'components/bui/text/BuiLinedText';
import BuiButton from 'components/bui/BuiButton';
import React, {useCallback, useMemo, useState} from 'react';
import EquipmentsSelectionDialog
  from 'components/calculationInput/equipments/EquipmentsSelectionDialog';
import {Equipment} from 'model/Equipment';
import {EquipmentsById} from 'components/calculationInput/PiecesCalculationCommonTypes';
import {observer} from 'mobx-react-lite';
import {IWizStore} from 'stores/WizStore';
import {
  EquipmentInfoToEdit, IRequirementByEquipment, IRequirementByEquipmentIn,
} from 'stores/EquipmentsRequirementStore';
import {Box, Tooltip} from '@mui/material';
import PiecesInventory, {PieceState}
  from 'components/calculationInput/equipments/inventory/PiecesInventory';
import IconButton from '@mui/material/IconButton';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import variables from 'scss/variables.module.scss';
import {useTranslation} from 'next-i18next';
import {
  checkRequirementsSatisfied, calculateRequiredPieces,
} from './inventory/piecesStateCalculator';
import {LabeledEquipmentCard} from './LabeledEquipmentCard';
import {KeyboardDoubleArrowUp} from '@mui/icons-material';
import {
  useChipForm, useEquipmentCategoryGroup, useEquipmentTierGroup,
} from '../common/ActionChips';
import {useWatch} from 'react-hook-form';
import {
  Comparators, SortingOrder, buildArrayIndexComparator,
  buildComparator, reverseComparator,
} from 'common/sortUtils';
import {equipmentCategories} from './EquipmentFilterChips';
import {ChipFormWithDetails} from '../common/ChipFormWithDetails';

export interface TierCategoryKey{
  tier: number;
  category: string;
}

export const hashTierAndCategoryKey = (key: TierCategoryKey) => `${key.tier}-${key.category}`;

export type EquipmentsByTierAndCategory = Map<string, Equipment>;

const EquipmentsInput = (
    {
      store,
      piecesState,
      equipmentsByTier,
      equipmentsById,
      equipmentsByTierAndCategory,
    }:
        {
          store:IWizStore,
          piecesState: Map<string, PieceState>,
          equipmentsByTier: Map<number, Equipment[]>,
          equipmentsById: EquipmentsById,
          equipmentsByTierAndCategory: EquipmentsByTierAndCategory,
        }
) => {
  const {t} = useTranslation('home');
  const [isAddEquipDialogOpened, setIsAddEquipDialogOpened] = useState(false);

  const [equipInfoToEdit, setEquipInfoToEdit] = useState<EquipmentInfoToEdit|null>(null);

  const handleClickOpen = () => {
    setIsAddEquipDialogOpened(true);
  };

  const handleCloseEquipmentRequirementDialog = () => {
    setIsAddEquipDialogOpened(false);
    setEquipInfoToEdit(null);
  };

  const handleAddEquipmentRequirement = (requirementByEquipment: IRequirementByEquipmentIn) =>{
    store.equipmentsRequirementStore.addEquipmentsRequirement(requirementByEquipment);
    handleCloseEquipmentRequirementDialog();
    setEquipInfoToEdit(null);
  };

  const handleDeleteEquipmentRequirement = (equipmentInfoToEdit: EquipmentInfoToEdit) =>{
    setIsAddEquipDialogOpened(false);
    store.equipmentsRequirementStore.deleteEquipmentsRequirement(equipmentInfoToEdit);
    setEquipInfoToEdit(null);
  };

  const handleUpdateEquipmentRequirement = (equipmentInfoToEdit: EquipmentInfoToEdit) =>{
    setIsAddEquipDialogOpened(false);
    store.equipmentsRequirementStore.updateEquipmentsRequirement(equipmentInfoToEdit);
    setEquipInfoToEdit(null);
  };

  const handleCancelChangeEquipmentRequirement = () =>{
    handleCloseEquipmentRequirementDialog();
  };

  const handleOpenDialogForEditing = useCallback((_: unknown, uuid: string) => {
    const requirementByEquipment = store.equipmentsRequirementStore.requirementByEquipments
        .find((it) => it.uuid === uuid);
    if (!requirementByEquipment) return;
    setEquipInfoToEdit({
      ...requirementByEquipment,
    });
    setIsAddEquipDialogOpened(true);
  }, [store.equipmentsRequirementStore.requirementByEquipments]);

  const upgradableBadge = useMemo(() => {
    return <Tooltip title={t('canUpgradeBadge')}><KeyboardDoubleArrowUp /></Tooltip>;
  }, [t]);

  const maxTier = useMemo(() => {
    return Math.max(...Array.from(equipmentsByTier.keys()));
  }, [equipmentsByTier]);
  const [chipFormProps, formControls] = useChipForm(
      useEquipRequirementsFilterSpec(maxTier),
      {defaultValues: {
        tier: [],
        category: [],
        filter: null,
        sort: {key: 'nickname', order: 'dsc'},
      }}
  );
  const [tierFilter, categoryFilter, statusFilter, sortMode] = useWatch({
    control: formControls.control,
    name: ['tier', 'category', 'filter', 'sort'],
  });

  const visibleRequirements = useMemo(() => {
    const comparators = {
      nickname: buildComparator(
          (reqm: IRequirementByEquipment) => reqm.nickname || undefined,
          Comparators.stringAscending,
      ),
      tier: buildComparator(
          (reqm: IRequirementByEquipment) => equipmentsById.get(reqm.targetEquipmentId)?.tier,
          Comparators.numberDescending,
      ),
      category: buildComparator(
          (reqm: IRequirementByEquipment) => equipmentsById.get(reqm.targetEquipmentId)?.category,
          buildArrayIndexComparator(equipmentCategories, SortingOrder.Ascending),
      ),
    };

    return store.equipmentsRequirementStore.requirementByEquipments
        .map((reqm) => {
          const pieces = calculateRequiredPieces(
              equipmentsById,
              equipmentsByTierAndCategory,
              reqm
          );
          const isUpgradable = checkRequirementsSatisfied(
              piecesState,
              pieces,
          );
          return {reqm, pieces, isUpgradable};
        })
        .filter(({reqm, isUpgradable}) => {
          const target = equipmentsById.get(reqm.targetEquipmentId);
          return target && (!tierFilter.length || tierFilter.includes(target.tier)) &&
            (!categoryFilter.length || categoryFilter.includes(target.category)) &&
            (statusFilter == null || isUpgradable === (statusFilter === 'sufficient'));
        })
        .sort(buildComparator(
            ({reqm}) => reqm,
            reverseComparator(comparators[sortMode.key], sortMode.order !== 'dsc'),
            comparators.category, comparators.tier, comparators.nickname,
        ));
  }, [
    store.equipmentsRequirementStore.requirementByEquipments,
    equipmentsById, equipmentsByTierAndCategory, piecesState,
    sortMode.key, sortMode.order, tierFilter, categoryFilter, statusFilter,
  ]);

  return <div>
    <EquipmentsSelectionDialog
      key={equipInfoToEdit?.targetEquipmentId ?? '1'}
      isOpened={isAddEquipDialogOpened} equipmentsByTier={equipmentsByTier}
      piecesState={piecesState}
      handleAddEquipmentRequirement={handleAddEquipmentRequirement}
      handleDeleteEquipmentRequirement={handleDeleteEquipmentRequirement}
      handleUpdateEquipmentRequirement={handleUpdateEquipmentRequirement}
      handleCancel={handleCancelChangeEquipmentRequirement}
      equipmentInfoToEdit={equipInfoToEdit}
      equipmentsById={equipmentsById} equipmentsByTierAndCategory={equipmentsByTierAndCategory}/>
    <BuiLinedText>{t('addEquipments')}</BuiLinedText>
    <div className={styles.selectionWrapper}>

      <Box width='100%' marginBottom='0.5rem'>
        <ChipFormWithDetails {...chipFormProps} controls={formControls} />
      </Box>
      {visibleRequirements.map(({reqm, isUpgradable}) => {
        return <LabeledEquipmentCard key={reqm.uuid} index={reqm.uuid}
          showNickname showTierChange
          onClick={handleOpenDialogForEditing}
          equipById={equipmentsById}
          requirement={reqm}
          badge={isUpgradable ? upgradableBadge : undefined} />;
      })}
      {!visibleRequirements.length && <Box alignSelf='center'>{t('filterResultEmpty')}</Box>}
      <BuiButton color={'baButtonSecondary'} onClick={handleClickOpen} className={styles.addButton}>
        <div>{t('addButton')}</div>
      </BuiButton>
    </div>
    <BuiLinedText>
      <div>{t('updateInventory')}</div>
      <Tooltip title={t('updateInventoryTip')} enterTouchDelay={0} leaveTouchDelay={5000}>
        <IconButton sx={{color: variables.baPrimaryTextColor}} size={'small'}>
          <InfoOutlinedIcon />
        </IconButton>
      </Tooltip>
    </BuiLinedText>
    <div className={styles.selectionWrapper}>
      <PiecesInventory piecesState={piecesState} equipmentsById={equipmentsById} />
    </div>
  </div>;
};

export default observer(EquipmentsInput);

const useEquipRequirementsFilterSpec = (maxTier: number) => {
  const {t} = useTranslation();
  return {
    tier: useEquipmentTierGroup({
      type: 'check', hide: true,
      title: t('piecesFilter.filter.byTier'),
      minTier: 2, maxTier,
    }),
    category: useEquipmentCategoryGroup({
      type: 'check', hide: true,
      title: t('piecesFilter.filter.byCategory'),
    }),
    filter: {
      type: 'radio',
      uncheckable: true,
      title: t('piecesFilter.filter.byStockStatus'),
      options: [
        {value: 'sufficient', label: t('piecesFilter.filter.upgradeReady')},
        {value: 'insufficient', label: t('piecesFilter.filter.upgradeNotReady')},
      ],
    },
    sort: {
      type: 'sort',
      uncheckable: false,
      title: t('piecesFilter.sortBy.title'),
      options: [
        {value: 'nickname', label: t('piecesFilter.sortBy.nickname')},
        {value: 'tier', label: t('piecesFilter.sortBy.tier')},
        {value: 'category', label: t('piecesFilter.sortBy.category')},
      ],
    },
  } as const; /* satisfies ChipFormSpec */
};
