import { describe, expect, it } from 'vitest'
import { classNames } from './classNames'

describe('classNames', () => {
  it('joins truthy class names and skips falsy ones', () => {
    expect(classNames('chip', false, '', null, undefined, 'chip-active')).toBe('chip chip-active')
  })
})
