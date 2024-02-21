import styles from './PieceUpdateBox.module.scss';
import Box from '@mui/material/Box';
import PositiveIntegerOnlyInput from 'components/calculationInput/common/PositiveIntegerOnlyInput';
import React from 'react';
import {EquipmentsById} from 'components/calculationInput/PiecesCalculationCommonTypes';
import {PieceState} from 'components/calculationInput/equipments/inventory/PiecesInventory';
import {Control} from 'react-hook-form/dist/types/form';
import {InventoryForm} from 'components/calculationInput/equipments/inventory/InventoryUpdateDialog';
import {useTranslation} from 'next-i18next';
import {LabeledEquipmentCard} from '../LabeledEquipmentCard';

interface PieceUpdateBoxProps {
  equipmentsById:EquipmentsById,
  piece: PieceState,
  control: Control<InventoryForm>;
  allErrors: any,
}

const PieceUpdateBox = function({
  equipmentsById,
  piece,
  control,
  allErrors,
}:PieceUpdateBoxProps) {
  const {t} = useTranslation('home');

  const pieceInfo = equipmentsById.get(piece.pieceId);
  if (!pieceInfo) return null;
  return <div className={styles.equipmentInputContainer}>

    <LabeledEquipmentCard
      showTier showStockCount showNeedCount
      pieceState={piece}
      equipById={equipmentsById} />
    <Box sx={{mr: 2}}/>
    <PositiveIntegerOnlyInput name={piece.pieceId}
      min={0}
      control={control} showError={!!allErrors[piece.pieceId]}
      helperText={allErrors[piece.pieceId]?.message ?? ''}
      inputLabel={t('addPieceDialog.inStockCount')}
    />
  </div>;
};

export default PieceUpdateBox;
