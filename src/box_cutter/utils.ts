import { UnprocessableEntityException, ValidationError } from '@nestjs/common';

export function permutations<T>(array: Array<T>): Array<Array<T>> {
  const ret: Array<Array<T>> = [];

  if (array.length === 0) {
    return ret;
  }

  // Heap Algorithm
  function heapPermutations(k: number, array: Array<T>) {
    const c = new Array<number>(k).fill(0);

    ret.push([...array]);

    let i = 1;

    while (i < k) {
      if (c[i] < i) {
        if (i % 2 === 0) {
          const swapBuffer = array[0];
          array[0] = array[i];
          array[i] = swapBuffer;
        } else {
          const swapBuffer = array[c[i]];
          array[c[i]] = array[i];
          array[i] = swapBuffer;
        }

        ret.push([...array]);

        c[i] += 1;
        i = 1;
      } else {
        c[i] = 0;
        i += 1;
      }
    }
  }

  heapPermutations(array.length, [...array]);

  return ret;
}

export const pipeOptions = {
  transform: true,
  exceptionFactory: (errors: ValidationError[]) => {
    const badValues = errors
      .map((error) => error.children)
      .map((error) => error[0].value);

    if (badValues.some((value) => value === null || value === undefined)) {
      return new UnprocessableEntityException({
        success: false,
        error:
          'Invalid input format. Box size params: w, h, d; sheet size: l, w',
      });
    }

    if (badValues.some((value) => value <= 0)) {
      return new UnprocessableEntityException({
        success: false,
        error: 'Invalid input format. Please use only positive integers',
      });
    }
  },
};
