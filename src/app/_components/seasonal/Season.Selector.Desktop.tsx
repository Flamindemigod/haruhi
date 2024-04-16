'use client';

import { ReactNode } from 'react';
import RadioGroup from '~/primitives/RadioGroup';
import { Season, YEAR_MAX, validSeasons } from '~/types.shared/anilist';
import { Root as Label } from '@radix-ui/react-label';
import Slider from '~/primitives/Slider';

type Props = {
  season: Exclude<Season, Season.any>;
  year: number;
  setSeason: (season: Exclude<Season, Season.any>, year: number) => void;
  setCurrentSeason: () => void;
};

const Wrapper = ({ children }: { children?: ReactNode }) => (
  <div className='sticky top-0 flex flex-col items-center justify-center gap-2 rounded-md bg-black/20 p-4 dark:bg-white/10'>
    {children}
  </div>
);

export default (props: Props) => {
  return (
    <>
      <Wrapper>
        <Label
          className='self-start text-lg font-semibold text-primary-500'
          htmlFor='seasonSelector'
        >
          Season
        </Label>
        <RadioGroup
          name='seasonSelector'
          value={props.season}
          orientation='vertical'
          icon={<div className='h-3 w-3 rounded-full bg-primary-500' />}
          dataValues={validSeasons.map((e) => ({
            value: e,
            displayTitle: `${e}`.padStart(8),
          }))}
          onValueChange={(e) => {
            props.setSeason(e, props.year);
          }}
        />
      </Wrapper>
      <Wrapper>
        <Label
          className='self-start text-lg font-semibold text-primary-500'
          htmlFor='yearSelector'
        >
          Year{` ${props.year}`}
        </Label>
        <Slider
          id='yearSelector'
          max={YEAR_MAX}
          min={1970}
          step={1}
          value={[props.year]}
          ariaLabel='Seasonal Year Selector'
          onChange={(v) => {
            props.setSeason(props.season, v.at(0)!);
          }}
          thumbClasses='w-4 h-4'
          trackClasses='dark:bg-primary-400'
        />
      </Wrapper>
    </>
  );
};
