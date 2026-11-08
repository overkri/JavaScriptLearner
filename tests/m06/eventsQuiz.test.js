// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import {
  runEventOrderDemo,
  runOnceDemo,
  runPreventDefaultDemo,
  runStopPropagationDemo,
  runTargetVsCurrentTargetDemo,
} from '../../src/playground/eventsQuiz.js';

describe('events quiz', () => {
  it('runs capture before target and bubble', () => {
    expect(runEventOrderDemo()).toEqual(['outer-capture', 'inner', 'outer-bubble']);
  });

  it('stopPropagation prevents the outer handler', () => {
    expect(runStopPropagationDemo()).toEqual(['inner']);
  });

  it('preventDefault cancels the default action', () => {
    expect(runPreventDefaultDemo()).toBe(true);
  });

  it('once removes the handler after the first call', () => {
    expect(runOnceDemo()).toBe(1);
  });

  it('target is the clicked element, currentTarget is the listener owner', () => {
    expect(runTargetVsCurrentTargetDemo()).toEqual({
      targetIsInner: true,
      currentTargetIsOuter: true,
    });
  });
});
