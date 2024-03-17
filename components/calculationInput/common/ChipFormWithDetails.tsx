import styles from './ChipFormWithDetails.module.scss';
import React, {ComponentProps, useRef, useState} from 'react';
import {ChipForm, ChipFormSpec, ChipFormValues, useChipForm} from './ActionChips';
import {UseFormReturn} from 'react-hook-form';
import {
  Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
  Fade, Popover, PopoverProps, useMediaQuery,
} from '@mui/material';
import theme from 'components/bui/theme';
import {useTranslation} from 'next-i18next';

export const ChipFormWithDetails = <Spec extends ChipFormSpec>({
  controls: formControls,
  ...formProps
}: ComponentProps<typeof ChipForm<Spec>> & {
  controls: UseFormReturn<ChipFormValues<Spec>>,
}) => {
  const {t} = useTranslation();

  const [detailFormProps, detailFormControls] = useChipForm(formProps.spec, {
    defaultValues: formControls.getValues() as any,
  });

  const isDialogMode = useMediaQuery(theme.breakpoints.down('sm'));
  const [isDetailOpened, setDetailOpened] = useState(false);
  const anchor = useRef<PopoverProps['anchorEl']>(null);
  const callbacks = {
    handleOpenDetail: (e: React.MouseEvent<HTMLInputElement>) => {
      setDetailOpened(true);
      if (isDialogMode) {
        detailFormControls.reset(formControls.getValues(), {keepDefaultValues: true});
      } else {
        const rect = e.currentTarget?.getBoundingClientRect();
        anchor.current = {getBoundingClientRect: () => rect, nodeType: 1} as any;
      }
    },
    handlePopoverClose: () => {
      setDetailOpened(false);
    },
    handleResetFilter: () => {
      formControls.reset();
    },
    handleDialogReset: () => {
      detailFormControls.reset();
    },
    handleDialogCancel: () => {
      setDetailOpened(false);
    },
    handleDialogClose: () => {
      formControls.reset(detailFormControls.getValues(), {keepDefaultValues: true});
      setDetailOpened(false);
    },
  };

  return <>
    <ChipForm {...formProps} variant='default'>
      <Box role='group' className={styles.additionalChips}>
        <Chip color='primary' size='small' variant='outlined' label={t('piecesFilter.detail')}
          onClick={callbacks.handleOpenDetail} />
        <Chip color='error' size='small' variant='outlined' label={t('piecesFilter.reset')}
          onClick={callbacks.handleResetFilter} />
      </Box>
    </ChipForm>
    {isDialogMode ? <Dialog open={isDetailOpened}>
      <DialogTitle display='flex'>
        <Box flexGrow='1'>{t('piecesFilter.dialogTitle')}</Box>
        <Button onClick={callbacks.handleDialogReset}>{t('piecesFilter.reset')}</Button>
      </DialogTitle>
      <DialogContent>
        <ChipForm {...detailFormProps} variant='dialog' />
      </DialogContent>
      <DialogActions>
        <Button onClick={callbacks.handleDialogCancel}>{t('piecesFilter.cancel')}</Button>
        <Button onClick={callbacks.handleDialogClose}>{t('piecesFilter.close')}</Button>
      </DialogActions>
    </Dialog> : <Popover open={isDetailOpened} onClose={callbacks.handlePopoverClose}
      anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
      transformOrigin={{vertical: 'top', horizontal: 'center'}}
      anchorEl={anchor.current}
      TransitionComponent={Fade}
      classes={{paper: styles.filterPopover}}
      disableScrollLock>
      <ChipForm {...formProps} variant='dialog' />
    </Popover>}
  </>;
};
