import styles from './ActionChips.module.scss';
import {Chip, ChipProps, styled} from '@mui/material';
import {Sort} from '@mui/icons-material';
import React, {forwardRef} from 'react';
import {
  Control, FieldPath, FieldValues,
  useController, UseControllerProps,
  useForm, UseFormProps, UseFormReturn,
} from 'react-hook-form';
import {useTranslation} from 'next-i18next';
import {equipmentCategories} from '../equipments/EquipmentFilterChips';

export type OptionValue = string | number;
export type GroupType = 'check' | 'radio' | 'sort';
export type OptionSpec<TValue extends OptionValue> = Readonly<{
  value: TValue,
  label: React.ReactNode
}>;
export type ChipGroup<
  TType extends GroupType = GroupType,
  TValue extends OptionValue = OptionValue,
  TUncheckable extends boolean | undefined = boolean | undefined,
> = Readonly<{
  type: TType,
  uncheckable?: TUncheckable,
  options: readonly OptionSpec<TValue>[],
}>;
export type ChipGroupValue<TGroup extends ChipGroup<any>> =
  TGroup extends ChipGroup<infer TType, infer TValue, infer TUncheckable> ?
    TType extends 'check' ? TValue[] :
    TType extends 'radio' ? TUncheckable extends true ? TValue | null : TValue :
    TType extends 'sort' ? TUncheckable extends true ? SortMode<TValue> | null : SortMode<TValue> :
  never : never;
export type ChipFormSpec = Readonly<Record<string, ChipGroup>>;
export type ChipFormValues<TSpec extends ChipFormSpec> = {
  [key in keyof TSpec]: ChipGroupValue<TSpec[key]>
};

export const ChipForm = <Spec extends ChipFormSpec>({
  spec,
  control,
  ...props
}: React.FormHTMLAttributes<HTMLFormElement> & {
  spec: Spec,
  control: Control<ChipFormValues<Spec>>,
}) => {
  return <form {...props} className={`${props.className ?? ''} ${styles.container}`}>
    {Object.entries(spec).map(([name, {type, options, ...others}]) => {
      const uncheckable = 'uncheckable' in others && others.uncheckable;
      switch (type) {
        case 'check': return <React.Fragment key={name}>
          {options.map(({value, label}) => (
            <CheckChip key={value} control={control}
              name={name as any} value={value as any} label={label} />
          ))}
          <div className={styles.divider} />
        </React.Fragment>;
        case 'radio': return <React.Fragment key={name}>
          {options.map(({value, label}) => (
            <RadioChip key={value} control={control} uncheckable={uncheckable}
              name={name as any} value={value as any} label={label} />
          ))}
          <div className={styles.divider} />
        </React.Fragment>;
        case 'sort': return <React.Fragment key={name}>
          {options.map(({value, label}) => (
            <SortChip key={value} control={control} uncheckable={uncheckable}
              name={name as any} value={value as any} label={label} />
          ))}
          <div className={styles.divider} />
        </React.Fragment>;
      }
    })}
  </form>;
};

export const useChipForm = <Spec extends ChipFormSpec, TContext = any>(
  spec: Spec,
  useFormArgs: UseFormProps<ChipFormValues<Spec>, TContext>,
): [
  {spec: Spec, control: Control<ChipFormValues<Spec>, TContext>},
  UseFormReturn<ChipFormValues<Spec>, TContext>
] => {
  const ret = useForm<ChipFormValues<Spec>>({
    mode: 'onChange',
    ...useFormArgs,
  });

  return [{spec, control: ret.control}, ret];
};

type EquipmentCategory = typeof equipmentCategories[number];
export const useEquipmentCategoryGroup =
  <
    TType extends GroupType,
    TUncheckable extends boolean | undefined = undefined
  >({
    type,
    uncheckable,
    categories = equipmentCategories,
  }: {
    type: TType,
    uncheckable?: TUncheckable,
    categories?: readonly EquipmentCategory[],
  }): ChipGroup<TType, EquipmentCategory, TUncheckable> => {
    const {t} = useTranslation();
    const options = categories.map((value) => ({
      value,
      label: t(`equipmentCategory.${value}`),
    }));
    return {type, uncheckable, options};
  };

const range = (start: number, endInclusive: number) => {
  return Array.from({length: endInclusive - start + 1}, (_, i) => i + start);
};

export const useEquipmentTierGroup =
  <
    TType extends GroupType,
    TUncheckable extends boolean | undefined = undefined
  >({
    type,
    uncheckable,
    minTier = 1,
    maxTier,
  }: {
    type: TType,
    uncheckable?: TUncheckable,
    minTier?: number,
    maxTier: number,
  }): ChipGroup<TType, number, TUncheckable> => {
    const options = range(minTier, maxTier).map((tier) => ({
      value: tier,
      label: `T${tier}`,
    }));
    return {type, uncheckable, options};
  };

export const ChipsDemo = () => {
  const {t} = useTranslation();

  const [chipFormProps] = useChipForm({
    tier: {
      type: 'check',
      options: [
        {value: 1, label: 'T1'},
        {value: 2, label: 'T2'},
        {value: 3, label: 'T3'},
      ],
    },
    tier2: {
      type: 'radio',
      uncheckable: true,
      options: [
        {value: 1, label: 'T1'},
        {value: 2, label: 'T2'},
        {value: 3, label: 'T3'},
      ],
    },
    category: {
      type: 'radio',
      uncheckable: true,
      options: [
        {value: 'Hat', label: t(`equipmentCategory.${'Hat'}`)},
        {value: 'Shoes', label: t(`equipmentCategory.${'Shoes'}`)},
        {value: 'Gloves', label: t(`equipmentCategory.${'Gloves'}`)},
      ],
    },
    sort: {
      type: 'sort',
      options: [
        {value: 'status', label: '在庫状況'},
        {value: 'tier', label: 'Tier'},
        {value: 'category', label: 'カテゴリ'},
      ],
    },
    display: {
      type: 'radio',
      options: [
        {value: 'needed', label: '必要数'},
        {value: 'lacking', label: '不足数'},
      ],
    },
  }, {
    defaultValues: {
      tier: [1, 3],
      tier2: 2,
      category: null,
      sort: {key: 'status', order: 'dsc'},
      display: 'needed',
    },
  });

  return <ChipForm {...chipFormProps} />;
};

// #region components
export const ToggleChip = styled(forwardRef(function ToggleChip(
    props: {
      label?: React.ReactNode,
      checked?: boolean,
      onClick?: React.MouseEventHandler<HTMLInputElement>,
    } & Omit<ChipProps<'label'>,
        'ref' | 'clickable' | 'component' | 'label' | 'onClick' | 'variant' | 'onChange'>
      & Omit<React.InputHTMLAttributes<HTMLInputElement>,
        'checked' | 'defaultChecked'>,
    ref?: React.ForwardedRef<HTMLInputElement>,
) {
  const {
    label, checked, onClick,

    /* ChipProps (omit clickable, component, label, onClick and variant) */
    avatar, className, color = 'primary', deleteIcon, disabled, icon,
    onDelete, onKeyDown, onKeyUp, size = 'small', tabIndex, skipFocusWhenDisabled,

    ...inputProps
  } = props;

  const chipProps: ChipProps<'label'> = {
    avatar, className, color, deleteIcon, disabled, icon,
    onDelete, onKeyDown, onKeyUp, size, tabIndex, skipFocusWhenDisabled,
  };

  return <Chip {...chipProps}
    component='label' role={undefined} clickable
    variant={checked ? 'filled' : 'outlined'}
    label={<>
      <input ref={ref} type='radio' {...inputProps}
        checked={checked} onClick={onClick} />
      {label}
    </>} />;
}))(({theme, color, checked}) => ({
  transition: theme.transitions.create([
    'box-shadow', 'color', 'background-color', 'border-color',
  ]),
  ...(checked && {
    border: `1px solid`,
    borderColor: (!color || color === 'default') ?
        theme.palette.action.selected :
        theme.palette[color].main,
  }),
  ['& input']: {
    display: 'none',
  },
}));

export const CheckChip = <TValues extends FieldValues, TName extends FieldPath<TValues>>(
  props: {
    onClick?: React.MouseEventHandler<HTMLInputElement>,
  } & UseControllerProps<TValues, TName>
    & Omit<React.ComponentProps<typeof ToggleChip>, 'type' | 'name'>,
) => {
  const {
    // eslint-disable-next-line no-unused-vars
    name, rules, shouldUnregister, defaultValue, control,
    ...others
  } = props;

  const {field: {value, onChange, ...field}} = useController(props);
  const asArray: unknown[] = Array.isArray(value) ? value : [value];
  const checked = asArray.includes(others.value);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (checked) {
      onChange(asArray.filter((it) => it !== others.value));
    } else {
      onChange([...asArray, others.value]);
    }
  };

  return <ToggleChip type='checkbox' {...others} {...field}
    checked={checked} onChange={handleChange} />;
};

export const RadioChip = <TValues extends FieldValues, TName extends FieldPath<TValues>>(
  props: {
    onClick?: React.MouseEventHandler<HTMLInputElement>,
    uncheckable?: boolean,
  } & UseControllerProps<TValues, TName>
    & Omit<React.ComponentProps<typeof ToggleChip>, 'type' | 'name' | 'onClick'>,
) => {
  const {
    onClick, uncheckable,
    // eslint-disable-next-line no-unused-vars
    name, rules, shouldUnregister, defaultValue, control,
    ...others
  } = props;

  const {field: {value, onChange, ...field}} = useController(props);
  const checked = value === others.value;

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    onChange(others.value);
  };

  const handleClick: React.MouseEventHandler<HTMLInputElement> = (e) => {
    onClick?.(e);
    if (uncheckable && checked) {
      onChange(null);
    }
  };

  return <ToggleChip type='radio' {...others} {...field}
    checked={checked} onClick={handleClick} onChange={handleChange} />;
};

const SortDscIcon = Sort;
const SortAscIcon = styled(Sort)({transform: 'scaleY(-1)'});
export type SortMode<T = unknown> = {key: T, order: 'asc' | 'dsc'};
export const SortChip = <TValues extends FieldValues, TName extends FieldPath<TValues>>(
  props: {
    onClick?: React.MouseEventHandler<HTMLInputElement>,
    uncheckable?: boolean,
  } & UseControllerProps<TValues, TName>
    & Omit<React.ComponentProps<typeof ToggleChip>, 'type' | 'name' | 'onClick'>,
) => {
  const {
    onClick, uncheckable,
    // eslint-disable-next-line no-unused-vars
    name, rules, shouldUnregister, defaultValue, control,
    ...others
  } = props;

  const {field: {value, onChange, ...field}} = useController(props);
  const asSortMode = value as SortMode;
  const order = asSortMode?.key === others.value ? asSortMode?.order : null;

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    onChange({key: others.value, order: 'dsc'});
  };

  const handleClick: React.MouseEventHandler<HTMLInputElement> = (e) => {
    onClick?.(e);
    switch (order) {
      case 'dsc':
        onChange({key: others.value, order: 'asc'});
        break;
      case 'asc':
        onChange(uncheckable ? null : {key: others.value, order: 'dsc'});
        break;
    }
  };

  return <ToggleChip type='radio' {...others} {...field}
    icon={order ? {asc: <SortAscIcon />, dsc: <SortDscIcon />}[order] : undefined}
    checked={!!order} onClick={handleClick} onChange={handleChange} />;
};
// #endregion
