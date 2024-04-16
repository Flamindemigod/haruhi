'use client';
import { Root as Portal } from '@radix-ui/react-portal';
import { useRef, useEffect, RefCallback } from 'react';
import { SwipeableProps, useSwipeable } from 'react-swipeable';
import median from '../utils/median';
import _, { zip } from 'lodash';

interface Props extends Exclude<SwipeableProps, 'onSwipedUp' | 'onSwipedDown'> {
  text?: {
    left?: string;
    right?: string;
  };
}

export default (props: Props) => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const canvasFunctions =
    useRef<
      Record<
        | 'draw'
        | 'reset'
        | 'setMagnitude'
        | 'setRotation'
        | 'setText'
        | 'setInterval'
        | 'startFadeIn'
        | 'startFadeOut',
        (...args: any[]) => void
      >
    >();

  const { ref } = useSwipeable({
    ...props,
    onSwiping: (e) => {
      if (!!canvasFunctions.current) {
        switch (e.dir) {
          case 'Left':
            canvasFunctions.current.setText(props.text?.left ?? '');
            break;
          case 'Right':
            canvasFunctions.current.setText(props.text?.right ?? '');
            break;
          case 'Up':
            canvasFunctions.current.setText('Canceled');
            break;
          case 'Down':
            canvasFunctions.current.setText('Canceled');
            break;
        }

        canvasFunctions.current.setMagnitude(
          (((e.absX ^ 2) + (e.absY ^ 2)) ^ (1 / 2)) / 100
        );
        canvasFunctions.current.setRotation(Math.atan2(e.deltaY, e.deltaX));
      }
      if (!!props.onSwiping) props.onSwiping(e);
    },
    onSwipeStart: (e) => {
      if (!!canvasFunctions.current && e.dir !== 'Down' && e.dir !== 'Up') {
        canvasFunctions.current.setInterval(
          setInterval(() => {
            canvasFunctions.current!.reset();
            canvasFunctions.current!.draw();
          }, 17)
        );

        canvasFunctions.current.startFadeIn();
      }
      if (!!props.onSwipeStart) props.onSwipeStart(e);
    },
    onSwiped: (e) => {
      if (!!canvasFunctions.current) canvasFunctions.current.startFadeOut();

      if (!!props.onSwiped) props.onSwiped(e);
    },
    onTouchEndOrOnMouseUp: (e) => {
      if (!!canvasFunctions.current) canvasFunctions.current.startFadeOut();

      if (!!props.onTouchEndOrOnMouseUp) props.onTouchEndOrOnMouseUp(e);
    },
    swipeDuration: Infinity,
    delta: 20,
  }) as { ref: RefCallback<Document | {}> };

  useEffect(() => {
    if (!!document) {
      ref(document);
      canvasFunctions.current = (() => {
        if (!!canvas.current) {
          const ctx = canvas.current.getContext('2d');
          const canvasSize = {
            width: 300,
            height: 300,
          };
          if (!!ctx) {
            let magnitude = 1;
            const blobSize = canvasSize.width / (2 * 2);
            let rotation = 0;
            let text = '';
            let drawInterval: NodeJS.Timeout | null = null;
            return {
              setInterval: (id: NodeJS.Timeout) => {
                drawInterval = id;
              },
              startFadeIn: () => {
                let i = 0;
                const interval = setInterval(() => {
                  const alpha = Math.min((i++ ^ 2) * 0.1, 1);
                  ctx.globalAlpha = alpha;
                  if (alpha > 1) clearInterval(interval);
                }, 10);
              },
              startFadeOut: () => {
                let i = 10;
                const interval = setInterval(() => {
                  ctx.globalAlpha = i * 0.1;
                  i--;
                  if (i === 0) {
                    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
                    clearInterval(interval);
                    clearInterval(drawInterval!);
                  }
                }, 10);
              },
              setText: (t: string) => {
                text = t;
              },
              setRotation: (angle: number) => {
                rotation = angle;
              },
              setMagnitude: (mag: number) => {
                magnitude = mag;
              },
              reset: () => {
                ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
              },
              draw: () => {
                const circle = new Path2D();
                circle.arc(
                  canvasSize.width / 2,
                  canvasSize.height / 2,
                  blobSize,
                  Math.PI / 2,
                  -Math.PI / 2
                );
                circle.ellipse(
                  canvasSize.width / 2,
                  canvasSize.height / 2,
                  median([1, magnitude, 1.75]) * blobSize,
                  blobSize,
                  0,
                  -Math.PI / 2,
                  Math.PI / 2
                );
                ctx.save();
                ctx.translate(canvasSize.width / 2, canvasSize.height / 2);
                ctx.rotate(rotation);
                ctx.translate(-canvasSize.width / 2, -canvasSize.height / 2);
                ctx.fillStyle = '#cc006d';

                ctx.fill(circle);
                ctx.restore();
                ctx.save();
                ctx.textBaseline = 'middle';
                ctx.font = '22px system-ui';

                const text_stack = text
                  .split('\n')
                  .map((s) => s.replaceAll('\n', ''));
                let textSize = text_stack.map((s) => ctx.measureText(s));

                ctx.fillStyle = '#ffffff';
                const padding = 4;
                let count = 0;
                for (const [substring, size] of zip(text_stack, textSize)) {
                  const textHeight =
                    size!.actualBoundingBoxAscent +
                    size!.actualBoundingBoxDescent;
                  const offSet = (-text_stack.length - 1) / 2 + ++count;
                  ctx.fillText(
                    substring!,
                    (canvasSize.width - size!.width) / 2,
                    canvasSize.height / 2 + (textHeight + padding) * offSet
                  );
                }
                ctx.restore();
                ctx.setTransform(1, 0, 0, 1, 0, 0);
              },
            };
          }
        }
      })();
    }
    return () => {
      ref({});
    };
  }, []);
  return {
    SwipeBlob: (
      <>
        <Portal className='pointer-events-none fixed left-0 top-0 z-[100] grid h-screen w-screen touch-none place-items-center'>
          <canvas width={300} height={300} aria-hidden ref={canvas}></canvas>
        </Portal>
      </>
    ),
  };
};
