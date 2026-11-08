/**
 * Эталон модуля 6.8 — поведение DOM-событий.
 */

/** @returns {string[]} */
export function runEventOrderDemo() {
  const outer = document.createElement('div');
  const inner = document.createElement('button');
  outer.append(inner);
  /** @type {string[]} */
  const log = [];

  outer.addEventListener('click', () => log.push('outer-capture'), true);
  inner.addEventListener('click', () => log.push('inner'));
  outer.addEventListener('click', () => log.push('outer-bubble'));

  inner.dispatchEvent(new Event('click', { bubbles: true }));
  return log;
}

/** @returns {string[]} */
export function runStopPropagationDemo() {
  const outer = document.createElement('div');
  const inner = document.createElement('button');
  outer.append(inner);
  /** @type {string[]} */
  const log = [];

  outer.addEventListener('click', () => log.push('outer'));
  inner.addEventListener('click', (event) => {
    log.push('inner');
    event.stopPropagation();
  });

  inner.dispatchEvent(new Event('click', { bubbles: true }));
  return log;
}

/** @returns {boolean} */
export function runPreventDefaultDemo() {
  const link = document.createElement('a');
  link.href = '#';
  const event = new Event('click', { bubbles: true, cancelable: true });
  link.addEventListener('click', (clickEvent) => clickEvent.preventDefault());
  link.dispatchEvent(event);
  return event.defaultPrevented;
}

/** @returns {number} */
export function runOnceDemo() {
  const button = document.createElement('button');
  let count = 0;
  button.addEventListener(
    'click',
    () => {
      count += 1;
    },
    { once: true },
  );
  button.click();
  button.click();
  return count;
}

/** @returns {{ targetIsInner: boolean, currentTargetIsOuter: boolean }} */
export function runTargetVsCurrentTargetDemo() {
  const outer = document.createElement('div');
  const inner = document.createElement('button');
  outer.append(inner);

  const result = { targetIsInner: false, currentTargetIsOuter: false };
  outer.addEventListener('click', (event) => {
    result.targetIsInner = event.target === inner;
    result.currentTargetIsOuter = event.currentTarget === outer;
  });

  inner.dispatchEvent(new Event('click', { bubbles: true }));
  return result;
}
