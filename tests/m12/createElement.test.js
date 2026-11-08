import { describe, expect, it } from 'vitest';
import { h } from '../../src/mini-react/createElement.js';

describe('h', () => {
  it('creates a vnode with type, props and children', () => {
    const vnode = h('div', { id: 'root', className: 'app' }, 'hello');
    expect(vnode.type).toBe('div');
    expect(vnode.props.id).toBe('root');
    expect(vnode.props.className).toBe('app');
    expect(vnode.children).toEqual(['hello']);
    expect(vnode.props.children).toEqual(['hello']);
  });

  it('flattens nested child arrays and removes empty values', () => {
    const child = h('span', {}, 'x');
    const vnode = h('div', {}, 'a', [child, ['b', [null, undefined, false]]], true);
    expect(vnode.children).toEqual(['a', child, 'b']);
  });

  it('keeps numbers and vnodes as children', () => {
    const child = h('em', {}, 'value');
    expect(h('p', {}, 1, child).children).toEqual([1, child]);
  });

  it('merges props.children with positional children', () => {
    const vnode = h('div', { children: 'from-props' }, 'positional');
    expect(vnode.children).toEqual(['from-props', 'positional']);
    expect(vnode.props.children).toEqual(['from-props', 'positional']);
  });

  it('does not mutate the props object', () => {
    const props = { id: 'x' };
    h('div', props, 'text');
    expect(props).toEqual({ id: 'x' });
  });

  it('supports function components', () => {
    const Component = (props) => h('div', {}, props.title);
    const vnode = h(Component, { title: 'Hello' });
    expect(vnode.type).toBe(Component);
    expect(vnode.props.title).toBe('Hello');
  });

  it('works without props', () => {
    const vnode = h('div', null, 'text');
    expect(vnode.props).toEqual({ children: ['text'] });
  });
});
