import { TextField } from '@radix-ui/themes';
import cx from 'classix';
import { ReactNode } from 'react';

type Icon = {
  icon: ReactNode;
  color?:
    | 'tomato'
    | 'red'
    | 'ruby'
    | 'crimson'
    | 'pink'
    | 'plum'
    | 'purple'
    | 'violet'
    | 'iris'
    | 'indigo'
    | 'blue'
    | 'cyan'
    | 'teal'
    | 'jade'
    | 'green'
    | 'grass'
    | 'brown'
    | 'orange'
    | 'sky'
    | 'mint'
    | 'lime'
    | 'yellow'
    | 'amber'
    | 'gold'
    | 'bronze'
    | 'gray';
  gap?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
};

type Props = {
  startIcon?: Icon;
  endIcon?: Icon;
  placeholder: string;
  color?:
    | 'tomato'
    | 'red'
    | 'ruby'
    | 'crimson'
    | 'pink'
    | 'plum'
    | 'purple'
    | 'violet'
    | 'iris'
    | 'indigo'
    | 'blue'
    | 'cyan'
    | 'teal'
    | 'jade'
    | 'green'
    | 'grass'
    | 'brown'
    | 'orange'
    | 'sky'
    | 'mint'
    | 'lime'
    | 'yellow'
    | 'amber'
    | 'gold'
    | 'bronze'
    | 'gray';
  size?: '1' | '2' | '3';
  variant?: 'classic' | 'surface' | 'soft';
  radius?: 'none' | 'small' | 'medium' | 'large' | 'full';
  value?: string;
  rootClasses?: string;
  className?: string;
  onValueChange?: (val: string) => void;
};

const TextFieldH = (props: Props) => {
  return (
    <TextField.Root
      size={props.size}
      variant={props.variant}
      color={props.color}
      className={cx('flex items-center', props.rootClasses)}
      radius={props.radius}
    >
      {!!props.startIcon ?
        <TextField.Slot color={props.startIcon.color} gap={props.startIcon.gap}>
          {props.startIcon.icon}
        </TextField.Slot>
      : <></>}
      <TextField.Input
        autoFocus={true}
        placeholder={props.placeholder}
        value={props.value}
        className={props.className}
        onInput={(e) => {
          if (!props.onValueChange) {
            return;
          }
          props.onValueChange(e.currentTarget.value);
        }}
      />
      {!!props.endIcon ?
        <TextField.Slot color={props.endIcon.color} gap={props.endIcon.gap}>
          {props.endIcon.icon}
        </TextField.Slot>
      : <></>}
    </TextField.Root>
  );
};

export default TextFieldH;
