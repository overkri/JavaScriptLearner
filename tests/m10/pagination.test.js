import { describe, expect, it, vi } from 'vitest';
import {
  filterIter,
  mapIter,
  paginate,
  range,
  take,
} from '../../src/features/pagination.js';

describe('paginate', () => {
  it('splits items into pages with a partial last page', () => {
    expect([...paginate([1, 2, 3, 4, 5], 2)]).toEqual([[1, 2], [3, 4], [5]]);
  });

  it('returns no pages for an empty list', () => {
    expect([...paginate([], 3)]).toEqual([]);
  });

  it('rejects a non-positive size', () => {
    expect(() => [...paginate([1], 0)]).toThrow(RangeError);
    expect(() => [...paginate([1], -1)]).toThrow(RangeError);
  });

  it('can be stopped with return()', () => {
    const iterator = paginate([1, 2, 3], 1);
    expect(iterator.next().value).toEqual([1]);
    iterator.return();
    expect(iterator.next().done).toBe(true);
  });
});

describe('range', () => {
  it('generates an ascending range excluding end', () => {
    expect([...range(0, 5)]).toEqual([0, 1, 2, 3, 4]);
  });

  it('supports a custom step', () => {
    expect([...range(0, 10, 3)]).toEqual([0, 3, 6, 9]);
  });

  it('supports negative steps', () => {
    expect([...range(5, 0, -1)]).toEqual([5, 4, 3, 2, 1]);
  });

  it('rejects a zero step', () => {
    expect(() => [...range(0, 5, 0)]).toThrow(RangeError);
  });
});

describe('take', () => {
  it('takes at most n values', () => {
    expect([...take([1, 2, 3, 4], 2)]).toEqual([1, 2]);
    expect([...take([1, 2], 5)]).toEqual([1, 2]);
    expect([...take([1, 2], 0)]).toEqual([]);
  });

  it('is lazy and does not pull extra values', () => {
    let pulled = 0;
    function* source() {
      for (let value = 0; ; value += 1) {
        pulled += 1;
        yield value;
      }
    }

    expect([...take(source(), 3)]).toEqual([0, 1, 2]);
    expect(pulled).toBe(3);
  });
});

describe('mapIter and filterIter', () => {
  it('maps lazily and passes the index', () => {
    const fn = vi.fn((value, index) => value * 10 + index);
    expect([...mapIter([1, 2, 3], fn)]).toEqual([10, 21, 32]);
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('filters lazily and stops after take', () => {
    let pulled = 0;
    function* source() {
      for (let value = 0; ; value += 1) {
        pulled += 1;
        yield value;
      }
    }

    const result = [...take(filterIter(source(), (value) => value % 2 === 0), 3)];
    expect(result).toEqual([0, 2, 4]);
    expect(pulled).toBe(5);
  });
});
