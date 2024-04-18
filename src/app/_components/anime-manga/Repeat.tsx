import { parseInt } from 'lodash';
import Input from '~/primitives/Input';

type RepeatSelectorProps = {
  value: number | undefined;
  defaultValue: number | undefined;
  onValueChange: (val: number) => void;
};
export const RepeatSelector = (props: RepeatSelectorProps) => {
  return (
    <Input
      value={props.value}
      defaultValue={props.defaultValue}
      type='number'
      min={0}
      id='mediaRepeat'
      inputMode='numeric'
      onChange={(e) => {
        props.onValueChange(
          parseInt(e.target.value) > 0 ? parseInt(e.target.value) : 0
        );
      }}
    />
  );
};
