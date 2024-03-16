import styles from './ActionChips.module.scss';
import {Chip, ChipProps, Tooltip, Typography, styled} from '@mui/material';
import {Sort} from '@mui/icons-material';
import {
  ChangeEventHandler, ComponentPropsWithoutRef, FormHTMLAttributes,
  ForwardedRef, Fragment, InputHTMLAttributes, KeyboardEventHandler,
  MouseEventHandler, MutableRefObject,
  ReactElement, ReactNode, Ref, RefCallback, forwardRef,
} from 'react';
import {
  Control, FieldPath, FieldPathByValue, FieldValues,
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
  label: ReactNode,
  hide?: boolean,
  tooltip?: ReactNode,
}>;
export type ChipGroup<
  TType extends GroupType = GroupType,
  TValue extends OptionValue = OptionValue,
  TUncheckable extends boolean = boolean,
> = Readonly<{
  type: TType,
  uncheckable?: TUncheckable,
  title?: ReactNode,
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
  children: additionalNodes,
  ...props
}: FormHTMLAttributes<HTMLFormElement> & {
  spec: Spec,
  control: Control<ChipFormValues<Spec>>,
  variant?: 'default' | 'nowrap' | 'compact' | 'dialog' | 'collapse',
  children?: ReactNode,
}) => {
  const config = {
    isInline: ['default', 'nowrap', 'compact'].includes(variant),
    nowrap: variant === 'nowrap',
    hideDetail: variant === 'default' || variant === 'nowrap',
    hideUnchecked: variant === 'compact',
    showTitle: variant === 'dialog',
  };
  const containerClassName = joinClassNames(
      props.className,
      config.isInline ? styles.inline : styles.block,
      config.nowrap && styles.nowrap,
  );
  return <form {...props} className={containerClassName}>
    {Object.entries(spec).map(([name, {type, options, ...group}]) => {
      const ChipComponent = {check: CheckChip, radio: RadioChip, sort: SortChip}[type];
      return <Fragment key={name}>
        {config.showTitle && group.title && <div className={styles.title}>
          <Typography variant='subtitle1'>{group.title}</Typography>
        </div>}
        <div role='group' className={styles.group}>
          {options.map(({value, label, ...chip}) => {
            return <Tooltip key={value} title={chip.tooltip} arrow>
              <ChipComponent {...{
                name: (name as any), value, label, control,
                ...(group.uncheckable && {uncheckable: true}),
                hideIfUnchecked: config.hideUnchecked ||
                  (config.hideDetail && (group.hide || chip.hide)),
              }} />
            </Tooltip>;
          })}
        </div>
      </Fragment>;
    })}
    {additionalNodes}
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

// #region chip components
const joinClassNames = (
    ...classNames: (string | boolean | null | undefined)[]
) => (
  classNames
      .filter((it) => typeof it === 'string' && it.length > 0)
      .join(' ')
);
const combineRefs = <T extends HTMLElement>(
  ...refs: readonly (Ref<T> | MutableRefObject<T> | null | undefined)[]
): RefCallback<T> => {
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
      label?: ReactNode,
      checked?: boolean,
      disabled?: boolean,
      hideIfUnchecked?: boolean,
      chipRef?: ForwardedRef<HTMLLabelElement>,
      chipProps?: ChipProps<'label'>,
      inputRef?: ForwardedRef<HTMLInputElement>,
      inputProps?: InputHTMLAttributes<HTMLInputElement>,
    } & Omit<ChipProps<'label'>,
        | 'ref' | 'role' | 'component' | 'clickable' | 'disabled' | 'variant' | 'label'
        | 'type' | 'name' | 'value' | 'onClick' | 'onChange' | 'onBlur'>
      & Pick<InputHTMLAttributes<HTMLInputElement>,
        | 'type' | 'name' | 'value' | 'onClick' | 'onChange' | 'onBlur'>,
    ref?: ForwardedRef<HTMLInputElement>,
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
  const input: InputHTMLAttributes<HTMLInputElement> = {
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
    tabIndex={-1}
    label={<>
      <input {...input} ref={combineRefs(ref, inputRef)}
        checked={checked} disabled={disabled} />
      {label}
    </>} />;
}))(({theme, color = 'primary', checked}) => ({
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
    appearance: 'none',
    position: 'absolute',
  },
  ['&:has(input:focus-visible)']: {
    outline: 'solid black',
  },
}));

interface ControllerComponent<TProps, TValueType = string> {
  <
    TValues extends FieldValues = FieldValues,
    TName extends FieldPath<TValues> = FieldPathByValue<TValues, TValueType>,
  >(props: TProps & UseControllerProps<TValues, TName>): ReactElement;
}

interface CheckChipProps
    extends Omit<ComponentPropsWithoutRef<typeof ToggleChip>, 'type' | 'name' | 'onClick'> {
  onClick?: MouseEventHandler<HTMLInputElement>,
  ref?: ForwardedRef<HTMLLabelElement>,
}
export const CheckChip = forwardRef(function CheckChip(
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

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (checked) {
      onChange(asArray.filter((it) => it !== others.value));
    } else {
      onChange([...asArray, others.value]);
    }
  };

  return <ToggleChip chipRef={combineRefs(ref, chipRef)}
    type='checkbox' {...others} {...field}
    checked={checked} onChange={handleChange} />;
}) as ControllerComponent<CheckChipProps, string[]>;

interface RadioChipProps
    extends Omit<ComponentPropsWithoutRef<typeof ToggleChip>, 'type' | 'name' | 'onClick'> {
  onClick?: MouseEventHandler<HTMLInputElement>,
  uncheckable?: boolean,
  ref?: ForwardedRef<HTMLLabelElement>,
}
export const RadioChip = forwardRef(function RadioChip(
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

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    onChange(others.value);
  };

  const handleClick: MouseEventHandler<HTMLInputElement> = (e) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    if (uncheckable && checked) {
      onChange(null);
    }
  };

  return <ToggleChip chipRef={combineRefs(ref, chipRef)}
    type='radio' {...others} {...field}
    checked={checked} onClick={handleClick} onChange={handleChange} />;
}) as ControllerComponent<RadioChipProps, string>;

const SortDscIcon = Sort;
const SortAscIcon = styled(Sort)({transform: 'scaleY(-1)'});
export type SortMode<T = unknown> = {key: T, order: 'asc' | 'dsc'};

interface SortChipProps
    extends Omit<ComponentPropsWithoutRef<typeof ToggleChip>, 'type' | 'name' | 'onClick'> {
  onClick?: MouseEventHandler<HTMLInputElement>,
  uncheckable?: boolean,
  ref?: ForwardedRef<HTMLLabelElement>,
}
export const SortChip = forwardRef(function SortChip(
    props,
    ref,
) {
  const {
    chipRef, onClick, onKeyUp, uncheckable,
    // eslint-disable-next-line no-unused-vars
    name, rules, shouldUnregister, defaultValue, control,
    ...others
  } = props;

  const {field: {value, onChange, ...field}} = useController(props);
  const asSortMode = value as SortMode;
  const order = asSortMode?.key === others.value ? asSortMode?.order : null;

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    onChange({key: others.value, order: 'dsc'});
  };

  const handleClick: MouseEventHandler<HTMLInputElement> = (e) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    switch (order) {
      case 'dsc':
        onChange({key: others.value, order: 'asc'});
        break;
      case 'asc':
        onChange(uncheckable ? null : {key: others.value, order: 'dsc'});
        break;
    }
  };

  const handleKeyUp: KeyboardEventHandler<HTMLLabelElement> = (e) => {
    onKeyUp?.(e);
    if (e.defaultPrevented) return;
    if (e.key === ' ' || e.key === 'Enter') e.currentTarget.click();
  };

  return <ToggleChip chipRef={combineRefs(ref, chipRef)}
    type='radio' {...others} {...field}
    icon={order ? {asc: <SortAscIcon />, dsc: <SortDscIcon />}[order] : undefined}
    checked={!!order} onClick={handleClick} onChange={handleChange} onKeyUp={handleKeyUp} />;
}) as ControllerComponent<SortChipProps, SortMode>;
// #endregion
