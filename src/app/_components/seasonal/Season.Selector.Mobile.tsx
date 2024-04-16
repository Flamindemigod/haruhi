'use client';

import { Portal } from '@radix-ui/react-portal';
import cx from 'classix';
import { range } from 'lodash';
import { useEffect, useState } from 'react';
import Select from '~/primitives/Select';
import {
  CURRENT_SEASON,
  CURRENT_YEAR,
  Season,
  YEAR_MAX,
  validSeasons,
} from '~/types.shared/anilist';

type Props = {
  season: Exclude<Season, Season.any>;
  year: number;
  setSeason: (season: Exclude<Season, Season.any>, year: number) => void;
};

export default (props: Props) => {
  const [_, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <Portal container={document?.getElementById('nav-top-panel')}>
      <div className='flex gap-8 border-b-2 border-solid border-b-primary-500 bg-offWhite-50 p-1 dark:bg-black'>
        <Select
          defaultValue={CURRENT_SEASON}
          onValueChange={(v) => {
            props.setSeason(v, props.year);
          }}
          triggerAriaLabel={'Season Selector'}
          align='center'
          trigger={
            <button
              className={cx(
                'relative w-full py-1 font-medium',
                'before:absolute before:inset-0 before:bg-gradient-to-l before:from-transparent before:via-offWhite-800/25 before:to-transparent before:blur-lg dark:before:via-offWhite-400/25'
              )}
            >
              {props.season}
            </button>
          }
          side={'top'}
          values={validSeasons.map((e) => ({ value: e, displayTitle: e }))}
          value={props.season}
        />
        <Select
          defaultValue={CURRENT_YEAR}
          onValueChange={(v) => {
            props.setSeason(props.season, v);
          }}
          triggerAriaLabel={'Year Selector'}
          align='center'
          trigger={
            <button
              className={cx(
                'relative w-full py-1 font-medium',
                'before:absolute before:inset-0 before:bg-gradient-to-l before:from-transparent before:via-offWhite-800/25 before:to-transparent before:blur-lg dark:before:via-offWhite-400/25'
              )}
            >
              {props.year}
            </button>
          }
          side={'top'}
          values={range(1970, YEAR_MAX + 1, 1).map((e) => ({
            value: e,
            displayTitle: `${e}`,
          }))}
          value={props.year}
        />
      </div>
    </Portal>
  );
};
