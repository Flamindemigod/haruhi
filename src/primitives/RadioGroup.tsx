import * as RadioGroupPrimitives from '@radix-ui/react-radio-group';
import { Root as Label } from '@radix-ui/react-label';
import cx from 'classix';
import { ReactNode } from 'react';

type Value<T> = {
  displayTitle: string;
  value: T;
};

type Props<T> = {
  value?: T;
  onValueChange?: (value: T) => void;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  orientation: 'horizontal' | 'vertical';
  dataValues: Value<T>[];
  icon?: ReactNode;
};

const RadioGroup = <T,>(props: Props<T>) => (
  <RadioGroupPrimitives.Root
    className={cx(
      'flex flex-wrap gap-2',
      props.orientation === 'horizontal' && 'flex-row items-center',
      props.orientation === 'vertical' && 'w-max flex-col justify-center'
    )}
    value={String(props.value)}
    name={props.name}
    onValueChange={(t) => {
      if (!!props.onValueChange) props.onValueChange(t as T);
    }}
    required={props.required}
    disabled={props.disabled}
    orientation={props.orientation}
  >
    {props.dataValues.map((v) => (
      <span
        key={`${v.value}--${v.displayTitle}`}
        className={cx('flex items-center justify-start gap-2')}
      >
        <RadioGroupPrimitives.Item
          id={`${v.value}--${v.displayTitle}`}
          value={String(v.value)}
          className='h-4 w-4 rounded-full bg-white'
        >
          <RadioGroupPrimitives.Indicator className='flex items-center justify-center'>
            {props.icon}
          </RadioGroupPrimitives.Indicator>
        </RadioGroupPrimitives.Item>
        <Label htmlFor={`${v.value}--${v.displayTitle}`}>
          {v.displayTitle}
        </Label>
      </span>
    ))}
  </RadioGroupPrimitives.Root>
);

export default RadioGroup;
