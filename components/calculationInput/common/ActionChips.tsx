import styles from './ActionChips.module.scss';
import {Chip, ChipProps, Tooltip, Typography, styled} from '@mui/material';
import {Sort} from '@mui/icons-material';
import React, {forwardRef} from 'react';
import {
  Control, FieldPath, FieldValues,
  useController, UseControllerProps,
  useForm, UseFormProps, UseFormReturn,
} from 'react-hook-form';
import {useTranslation} from 'next-i18next';
import {equipmentCategories} from '../equipments/EquipmentFilterChips';

// #region type definitions
export type OptionValue = string | number;
export type GroupType = 'check' | 'radio' | 'sort';
export type OptionSpec<TValue extends OptionValue> = Readonly<{
  value: TValue,
  label: React.ReactNode,
  hide?: boolean,
  tooltip?: React.ReactNode,
}>;
export type ChipGroup<
  TType extends GroupType = GroupType,
  TValue extends OptionValue = OptionValue,
  TUncheckable extends boolean = boolean,
> = Readonly<{
  type: TType,
  uncheckable?: TUncheckable,
  title?: React.ReactNode,
  hide?: boolean,
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
// #endregion

export const ChipForm = <Spec extends ChipFormSpec>({
  spec,
  control,
  variant = 'default',
  ...props
}: React.FormHTMLAttributes<HTMLFormElement> & {
  spec: Spec,
  control: Control<ChipFormValues<Spec>>,
  variant?: 'default' | 'nowrap' | 'dialog' | 'collapse',
}) => {
  const hideDetail = variant === 'default' || variant === 'nowrap';
  const showTitle = variant === 'dialog';
  return <form {...props}
    className={joinClassNames(
        props.className,
        ...({
          default: [styles.inline], nowrap: [styles.inline, styles.nowrap],
          dialog: [styles.block], collapse: [styles.block],
        }[variant])
    )}>
    {Object.entries(spec).map(([name, {type, options, ...group}]) => {
      const ChipComponent = {
        check: CheckChip,
        radio: RadioChip,
        sort: SortChip,
      }[type] as ControllerComponent<any>;
      return <React.Fragment key={name}>
        {showTitle && group.title && <div className={styles.title}>
          <Typography variant='h6'>{group.title}</Typography>
        </div>}
        <div role='group' className={styles.group}>
          {options.map(({value, label, ...chip}) => {
            const hideChip = hideDetail && (group.hide || chip.hide);
            const content = <ChipComponent key={value} {...{
              name, value, label, control,
              ...(group.uncheckable && {uncheckable: true}),
              hideIfUnchecked: hideChip,
            }} />;

            return <Tooltip key={value} title={chip.tooltip} arrow>{content}</Tooltip>;
          })}
        </div>
      </React.Fragment>;
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
    TUncheckable extends boolean = false
  >({
    categories = equipmentCategories,
    ...spec
  }: Omit<ChipGroup<TType, EquipmentCategory, TUncheckable>, 'options'> & {
    categories?: readonly EquipmentCategory[],
  }): ChipGroup<TType, EquipmentCategory, TUncheckable> => {
    const {t} = useTranslation();
    const options = categories.map((value) => ({
      value,
      label: t(`equipmentCategory.${value}`),
    }));
    return {...spec, options};
  };

const range = (start: number, endInclusive: number) => {
  return Array.from({length: endInclusive - start + 1}, (_, i) => i + start);
};

export const useEquipmentTierGroup =
  <
    TType extends GroupType,
    TUncheckable extends boolean = false
  >({
    minTier = 1,
    maxTier,
    ...spec
  }: Omit<ChipGroup<TType, number, TUncheckable>, 'options'> & {
    minTier?: number,
    maxTier: number,
  }): ChipGroup<TType, number, TUncheckable> => {
    const options = range(minTier, maxTier).map((tier) => ({
      value: tier,
      label: `T${tier}`,
    }));
    return {...spec, options};
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

// #region chip components
const joinClassNames = (
    ...classNames: (string | boolean | null | undefined)[]
) => (
  classNames
      .filter((it) => typeof it === 'string' && it.length > 0)
      .join(' ')
);
const combineRefs = <T extends HTMLElement>(
  ...refs: readonly (React.Ref<T> | React.MutableRefObject<T> | null | undefined)[]
): React.RefCallback<T> => {
  return (element: T | null) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === 'function') {
        ref(element);
      } else {
        (ref as any).current = element;
      }
    }
  };
};

export const ToggleChip = styled(forwardRef(function ToggleChip(
    props: {
      label?: React.ReactNode,
      checked?: boolean,
      disabled?: boolean,
      hideIfUnchecked?: boolean,
      chipRef?: React.ForwardedRef<HTMLLabelElement>,
      chipProps?: ChipProps<'label'>,
      inputRef?: React.ForwardedRef<HTMLInputElement>,
      inputProps?: React.InputHTMLAttributes<HTMLInputElement>,
    } & Omit<ChipProps<'label'>,
        | 'ref' | 'role' | 'component' | 'clickable' | 'disabled' | 'variant' | 'label'
        | 'type' | 'name' | 'value' | 'onClick' | 'onChange' | 'onBlur'>
      & Pick<React.InputHTMLAttributes<HTMLInputElement>,
        | 'type' | 'name' | 'value' | 'onClick' | 'onChange' | 'onBlur'>,
    ref?: React.ForwardedRef<HTMLInputElement>,
) {
  const {
    label, checked, disabled, hideIfUnchecked = false,
    chipProps, chipRef, inputProps, inputRef,

    /* input props */
    type = 'radio', name, value, onClick, onChange, onBlur,

    ...others
  } = props;

  if (hideIfUnchecked && !checked) return null;

  const chip: ChipProps<'label'> = {
    color: 'primary',
    size: 'small',
    ...others,
    ...chipProps,
  };
  const input: React.InputHTMLAttributes<HTMLInputElement> = {
    type, name, value, onClick, onChange, onBlur,
    ...inputProps,
  };

  if (process.env.NODE_ENV !== 'production') {
    /* eslint-disable no-unused-vars */
    const {
      avatar, className, color, deleteIcon, icon,
      onDelete, onKeyDown, onKeyUp, size, tabIndex, skipFocusWhenDisabled,
      ...rest
    } = others;
    /* eslint-enable no-unused-vars */
    // if (Object.keys(rest).length) console.warn('unknown props: ', rest);
  }

  return <Chip {...chip} ref={combineRefs(chipRef, chipProps?.ref)}
    component='label' role={undefined}
    clickable disabled={disabled}
    variant={checked ? 'filled' : 'outlined'}
    label={<>
      <input {...input} ref={combineRefs(ref, inputRef)}
        checked={checked} disabled={disabled} />
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

type ControllerComponent<TProps> = <
  TValues extends FieldValues = FieldValues,
  TName extends FieldPath<TValues> = FieldPath<TValues>,
>(props: TProps & UseControllerProps<TValues, TName>) => React.ReactElement;

type CheckChipProps = {
  onClick?: React.MouseEventHandler<HTMLInputElement>,
  ref?: React.ForwardedRef<HTMLLabelElement>,
} & Omit<React.ComponentPropsWithoutRef<typeof ToggleChip>, 'type' | 'name'>;
export const CheckChip: ControllerComponent<CheckChipProps> = forwardRef(function CheckChip(
    props,
    ref,
) {
  const {
    chipRef,
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

  return <ToggleChip chipRef={combineRefs(ref, chipRef)}
    type='checkbox' {...others} {...field}
    checked={checked} onChange={handleChange} />;
}) as ControllerComponent<CheckChipProps>;

type RadioChipProps = {
  onClick?: React.MouseEventHandler<HTMLInputElement>,
  uncheckable?: boolean,
  ref?: React.ForwardedRef<HTMLLabelElement>,
} & Omit<React.ComponentPropsWithoutRef<typeof ToggleChip>, 'type' | 'name' | 'onClick'>;
export const RadioChip: ControllerComponent<RadioChipProps> = React.forwardRef(function RadioChip(
    props,
    ref,
) {
  const {
    chipRef, onClick, uncheckable,
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

  return <ToggleChip chipRef={combineRefs(ref, chipRef)}
    type='radio' {...others} {...field}
    checked={checked} onClick={handleClick} onChange={handleChange} />;
}) as ControllerComponent<RadioChipProps>;

const SortDscIcon = Sort;
const SortAscIcon = styled(Sort)({transform: 'scaleY(-1)'});
export type SortMode<T = unknown> = {key: T, order: 'asc' | 'dsc'};

type SortChipProps = {
  onClick?: React.MouseEventHandler<HTMLInputElement>,
  uncheckable?: boolean,
  ref?: React.ForwardedRef<HTMLLabelElement>,
} & Omit<React.ComponentPropsWithoutRef<typeof ToggleChip>, 'type' | 'name' | 'onClick'>;
export const SortChip: ControllerComponent<SortChipProps> = React.forwardRef(function SortChip(
    props,
    ref,
) {
  const {
    chipRef, onClick, uncheckable,
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

  return <ToggleChip chipRef={combineRefs(ref, chipRef)}
    type='radio' {...others} {...field}
    icon={order ? {asc: <SortAscIcon />, dsc: <SortDscIcon />}[order] : undefined}
    checked={!!order} onClick={handleClick} onChange={handleChange} />;
}) as ControllerComponent<SortChipProps>;
// #endregion
