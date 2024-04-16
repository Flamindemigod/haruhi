'use client';

import { ReactNode } from 'react';
import RadioGroup from '~/primitives/RadioGroup';
import { Root as Label } from '@radix-ui/react-label';
import { ListSort, ListStatus } from '~/types.shared/anilist';
import Select from '~/primitives/Select';
import { PinTopIcon } from '@radix-ui/react-icons';
import cx from 'classix';

type Props = {
  list: ListStatus;
  sort: ListSort;
  setParams: (list: ListStatus, sort: ListSort) => void;
};

const Wrapper = ({ children }: { children?: ReactNode }) => (
  <div className='sticky top-0 flex flex-col items-center justify-center gap-2 rounded-md bg-black/20 p-4 dark:bg-white/10'>
    {children}
  </div>
);

export default (props: Props) => {
  const inverted = props.sort.includes('Desc');
  return (
    <>
      <Wrapper>
        <Label
          className='self-start text-lg font-semibold text-primary-500'
          htmlFor='listSelector'
        >
          List
        </Label>
        <RadioGroup
          name='listSelector'
          value={props.list}
          orientation='vertical'
          icon={<div className='h-3 w-3 rounded-full bg-primary-500' />}
          dataValues={Object.values(ListStatus).map((k) => ({
            value: k,
            displayTitle: k,
          }))}
          onValueChange={(e) => {
            props.setParams(e, props.sort);
          }}
        />
      </Wrapper>
      <Wrapper>
        <Label
          className='self-start text-lg font-semibold text-primary-500'
          htmlFor='sortSelector'
        >
          Sort
        </Label>
        <div className='flex w-full gap-2'>
          <Select
            defaultValue={ListSort.ScoreDesc}
            value={props.sort.replace(' Desc', '')}
            values={Object.values(ListSort)
              .filter((k) => !k.includes('Desc'))
              .map((k) => ({
                value: k,
                displayTitle: k,
              }))}
            side={'right'}
            trigger={
              <button className='w-full rounded-md bg-primary-500 p-2 text-white'>
                {props.sort}
              </button>
            }
            triggerAriaLabel={'sortSelector'}
            onValueChange={(e) => {
              props.setParams(
                props.list,
                (e + (inverted ? ' Desc' : '')) as ListSort
              );
            }}
          />
          <button
            className={cx(
              'grid aspect-square place-items-center rounded-md border border-solid p-2 transition-all',
              props.sort.includes('Desc') ?
                'rotate-0 border-transparent bg-primary-500'
              : 'rotate-180 border-primary-500'
            )}
            onClick={() => {
              props.setParams(
                props.list,
                (inverted ?
                  props.sort.replace(' Desc', '')
                : props.sort + ' Desc') as ListSort
              );
            }}
          >
            <PinTopIcon />
          </button>
        </div>
      </Wrapper>
    </>
  );
};
