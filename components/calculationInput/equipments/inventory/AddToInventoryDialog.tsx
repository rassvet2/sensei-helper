import styles from './AddToInventoryDialog.module.scss';
import {
  Box,
  Button, Dialog, DialogActions, DialogContent, DialogTitle,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  useMediaQuery, useTheme,
} from '@mui/material';
import React, {useEffect, useMemo, useReducer, useState} from 'react';
import {useTranslation} from 'next-i18next';
import {useForm} from 'react-hook-form';
import {
  DropPieceIdWithProbAndCount, EquipmentsById,
} from 'components/calculationInput/PiecesCalculationCommonTypes';
import {InventoryForm} from './InventoryUpdateDialog';
import ObtainedPieceBox from './ObtainedPieceBox';
import {useStore} from 'stores/WizStore';
import {PieceState} from './PiecesInventory';
import {
  Comparators, SortingOrder,
  buildArrayIndexComparator, buildComparator,
} from 'common/sortUtils';
import {EquipmentCategories} from 'model/Equipment';

const AddToInventoryDialog = ({
  open,
  drops,
  equipById,
  piecesState,
  onCancel,
  onUpdate,
}: {
  open: boolean,
  drops: DropPieceIdWithProbAndCount[],
  equipById: EquipmentsById,
  piecesState: Map<string, PieceState>,
  onCancel: () => void,
  onUpdate: (formValues: InventoryForm) => void,
}) => {
  const store = useStore();
  const {t} = useTranslation('home');
  const theme = useTheme();

  // hack to lazy rendering
  const [onceOpen, notifyOpened] = useReducer((x) => true, false);
  useEffect(() => {
    open && notifyOpened();
  }, [open]);

  const [mode, setMode] = useState<'all' | 'lack' | 'required'>('lack');

  const pieces = useMemo(() => {
    // 20-3: Necklace, Watch, Bag
    // 20-4: Watch, Charm, Badge
    // 13-1: Shoes, Gloves, Hat
    // descending tier -> descending category order?
    return drops.map(({id}) => (piecesState.get(id) ?? {
      pieceId: id,
      needCount: 0,
      inStockCount: 0,
    })).filter((state) => ({
      all: true,
      lack: state.needCount < state.inStockCount,
      required: state.needCount > 0,
    }[mode])).sort(buildComparator(
        (piece) => equipById.get(piece.pieceId),
        buildComparator((e) => e.tier, Comparators.numberDescending),
        buildComparator((e) => e.category, buildArrayIndexComparator(
            EquipmentCategories,
            SortingOrder.Descending
        )),
    ));
  }, [drops, piecesState, mode, equipById]);
  const defaultValues = useMemo(() => {
    return pieces.reduce<InventoryForm>((acc, piece) => {
      acc[piece.pieceId] = '';
      return acc;
    }, {});
  }, [pieces]);

  const {
    control,
    formState: {isValid: isCountValid, errors: allErrors},
    getValues,
    reset,
  } = useForm<InventoryForm>({
    mode: 'onChange',
    defaultValues,
  });

  const handleCancelDialog = () => {
    onCancel();
    reset();
  };

  const handleUpdateInventory = () => {
    onUpdate(getValues());
    const inventory = Object.entries(getValues()).reduce<InventoryForm>((acc, [id, value]) => {
      const count = parseInt(value) ?? 0;
      const stock = piecesState.get(id)?.inStockCount ?? 0;
      acc[id] = `${count + stock}`;
      return acc;
    }, {});
    store.equipmentsRequirementStore.updateInventory(inventory);
    reset();
  };

  const isFullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const isXsOrSmallerScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const hasManyPieces = () => pieces.length > 3;

  return !onceOpen ? null : <Dialog open={open} keepMounted fullWidth
    fullScreen={hasManyPieces() && isFullScreen}
    maxWidth={hasManyPieces() && 'xl'}>
    <Stack component={DialogTitle} direction='row' alignItems='center'>
      {t('addPieceDialog.addToInventory')}
      <Box flexGrow={1} />
      <ToggleButtonGroup exclusive size='small'
        value={mode} onChange={(e, value) => value && setMode(value)}>
        <ToggleButton value='all'>{t('piecesFilter.filter.all')}</ToggleButton>
        <ToggleButton value='lack'>{t('piecesFilter.filter.insufficient')}</ToggleButton>
        <ToggleButton value='required'>{t('piecesFilter.filter.required')}</ToggleButton>
      </ToggleButtonGroup>
    </Stack>

    <DialogContent className={styles.dialogContentContainer}>
      <div className={styles.filler}></div>
      <div className={`${styles.container} ${isXsOrSmallerScreen && styles.xs}`}>
        {pieces.map((piece, index) => {
          return <ObtainedPieceBox key={piece.pieceId} allErrors={allErrors}
            control={control}
            equipmentsById={equipById}
            piece={piece}
            focused={index === 0}/>;
        })}
      </div>
      {pieces.length === 0 && <div>{t('filterResultEmpty')}</div>}
      <div className={styles.filler}></div>
    </DialogContent>

    <DialogActions>
      <Button onClick={handleCancelDialog}>{t('cancelButton')}</Button>
      <Button onClick={handleUpdateInventory} disabled={!isCountValid}>{t('addButton')}</Button>
    </DialogActions>
  </Dialog>;
};

export default AddToInventoryDialog;