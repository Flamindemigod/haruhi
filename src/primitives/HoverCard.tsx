'use client';

import * as HoverCardPrimitive from '@radix-ui/react-hover-card';
import { ReactNode, RefObject, useState } from 'react';
import { Transition } from '@headlessui/react';
import cx from 'classix';

type Props = {
  defaultOpen?: boolean;
  control?: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
  };
  openDelay?: number;
  closeDelay?: number;
  trigger: ReactNode;
  portal: {
    container?: RefObject<HTMLElement>;
  };
  content: {
    data: ReactNode;
    side?: 'top' | 'right' | 'bottom' | 'left';
    sideOffset?: number;
    align?: 'start' | 'center' | 'end';
    alignOffset?: number;
    collisions?: {
      avoidCollisions?: boolean;
      collisionBoundry?: Element | null | Array<Element | null>;
      collisionPadding?:
        | number
        | Partial<Record<'top' | 'right' | 'bottom' | 'left', number>>;
    };
    hideWhenDetached?: boolean;
    sticky?: 'partial' | 'always';
  };
  arrow?: {
    arrowPadding?: number;
    height?: number;
    width?: number;
  };
};

const transitions: Record<
  'top' | 'right' | 'bottom' | 'left',
  Record<'enterFrom' | 'enterTo', string>
> = {
  top: {
    enterFrom: '',
    enterTo: '',
  },
  right: {
    enterFrom: 'translate-y-100',
    enterTo: 'translate-y-0',
  },
  bottom: {
    enterFrom: 'translate-y-100',
    enterTo: 'translate-y-0',
  },
  left: {
    enterFrom: 'translate-y-100',
    enterTo: 'translate-y-0',
  },
};

const HoverCard = ({ portal, ...props }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <HoverCardPrimitive.Root
      defaultOpen={props.defaultOpen}
      open={props.control?.open ?? open}
      onOpenChange={props.control?.onOpenChange ?? setOpen}
      openDelay={props.openDelay}
      closeDelay={props.closeDelay}
    >
      <HoverCardPrimitive.Trigger asChild>
        {props.trigger}
      </HoverCardPrimitive.Trigger>
      <HoverCardPrimitive.Portal container={portal.container?.current}>
        <Transition.Root show={props.control?.open ?? open}>
          <Transition.Child
            className={'relative'}
            {...transitions[props.content?.side ?? 'top']}
            enter='ease-out duration-300'
            leave='ease-in duration-300'
            leaveFrom='opacity-1'
            leaveTo='opacity-0'
          >
            <HoverCardPrimitive.Content
              className={cx(
                'radix-side-bottom:animate-slide-up radix-side-left:animate-slide-right radix-side-right:animate-slide-left radix-side-top:animate-slide-down'
              )}
              side={props.content?.side}
              sideOffset={props.content?.sideOffset}
              sticky={props.content?.sticky}
              align={props.content?.align}
              alignOffset={props.content?.alignOffset}
              avoidCollisions={props.content?.collisions?.avoidCollisions}
              collisionBoundary={props.content?.collisions?.collisionBoundry}
              collisionPadding={props.content?.collisions?.collisionPadding}
              arrowPadding={props.arrow?.arrowPadding}
              hideWhenDetached={props.content?.hideWhenDetached}
            >
              {props.content.data}
              {!!props.arrow ?
                <HoverCardPrimitive.Arrow />
              : <></>}
            </HoverCardPrimitive.Content>
          </Transition.Child>
        </Transition.Root>
      </HoverCardPrimitive.Portal>
    </HoverCardPrimitive.Root>
  );
};

export default HoverCard;
