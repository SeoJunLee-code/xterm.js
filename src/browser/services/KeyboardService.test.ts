/**
 * Copyright (c) 2026 The xterm.js authors. All rights reserved.
 * @license MIT
 */

import { assert } from 'chai';
import { KeyboardService } from './KeyboardService';
import { OptionsService } from '../../common/services/OptionsService';
import { ICoreService } from '../../common/services/Services';

function altEvent(type: 'keydown' | 'keyup', location: number): KeyboardEvent {
  return { type, key: 'Alt', location } as KeyboardEvent;
}

describe('KeyboardService', () => {
  describe('macOptionIsMeta', () => {
    let optionsService: OptionsService;
    let service: KeyboardService;

    beforeEach(() => {
      optionsService = new OptionsService({});
      service = new KeyboardService({} as ICoreService, optionsService);
    });

    it('is false when macOptionIsMeta is disabled, whatever the side', () => {
      optionsService.options.macOptionMetaSide = 'left';
      service.trackAltKey(altEvent('keydown', 1));
      assert.isFalse(service.macOptionIsMeta);
    });

    it('is true for either Option key by default', () => {
      optionsService.options.macOptionIsMeta = true;
      assert.isTrue(service.macOptionIsMeta);
      service.trackAltKey(altEvent('keydown', 1));
      assert.isTrue(service.macOptionIsMeta);
      service.trackAltKey(altEvent('keyup', 1));
      service.trackAltKey(altEvent('keydown', 2));
      assert.isTrue(service.macOptionIsMeta);
    });

    it('only treats the left Option key as meta when macOptionMetaSide is left', () => {
      optionsService.options.macOptionIsMeta = true;
      optionsService.options.macOptionMetaSide = 'left';
      assert.isFalse(service.macOptionIsMeta, 'no Option key held');
      service.trackAltKey(altEvent('keydown', 1));
      assert.isTrue(service.macOptionIsMeta);
      service.trackAltKey(altEvent('keyup', 1));
      assert.isFalse(service.macOptionIsMeta);
      service.trackAltKey(altEvent('keydown', 2));
      assert.isFalse(service.macOptionIsMeta);
    });

    it('only treats the right Option key as meta when macOptionMetaSide is right', () => {
      optionsService.options.macOptionIsMeta = true;
      optionsService.options.macOptionMetaSide = 'right';
      service.trackAltKey(altEvent('keydown', 1));
      assert.isFalse(service.macOptionIsMeta);
      service.trackAltKey(altEvent('keyup', 1));
      service.trackAltKey(altEvent('keydown', 2));
      assert.isTrue(service.macOptionIsMeta);
    });

    it('ignores non-Alt keys and forgets the held key on reset', () => {
      optionsService.options.macOptionIsMeta = true;
      optionsService.options.macOptionMetaSide = 'left';
      service.trackAltKey(altEvent('keydown', 1));
      service.trackAltKey({ type: 'keydown', key: 'a', location: 0 } as KeyboardEvent);
      assert.isTrue(service.macOptionIsMeta);
      service.resetAltKey();
      assert.isFalse(service.macOptionIsMeta);
    });
  });
});
