// tslint:disable:no-implicit-dependencies
import sinon, { SinonSpy } from 'sinon';
import { Logger } from '@slack/logger';

export interface Override {
  [packageName: string]: {
    [exportName: string]: any;
  };
}

export function mergeOverrides(...overrides: Override[]): Override {
  let currentOverrides: Override = {};
  for (const override of overrides) {
    currentOverrides = mergeObjProperties(currentOverrides, override);
  }
  return currentOverrides;
}

function mergeObjProperties(first: Override, second: Override): Override {
  const merged: Override = {};
  const props = Object.keys(first).concat(Object.keys(second));
  for (const prop of props) {
    if (second[prop] === undefined && first[prop] !== undefined) {
      merged[prop] = first[prop];
    } else if (first[prop] === undefined && second[prop] !== undefined) {
      merged[prop] = second[prop];
    } else {
      // second always overwrites the first
      merged[prop] = { ...first[prop], ...second[prop] };
    }
  }
  return merged;
}

export interface FakeLogger extends Logger {
  setLevel: SinonSpy<Parameters<Logger['setLevel']>, ReturnType<Logger['setLevel']>>;
  setName: SinonSpy<Parameters<Logger['setName']>, ReturnType<Logger['setName']>>;
  debug: SinonSpy<Parameters<Logger['debug']>, ReturnType<Logger['debug']>>;
  info: SinonSpy<Parameters<Logger['info']>, ReturnType<Logger['info']>>;
  warn: SinonSpy<Parameters<Logger['warn']>, ReturnType<Logger['warn']>>;
  error: SinonSpy<Parameters<Logger['error']>, ReturnType<Logger['error']>>;
}

export function createFakeLogger(): FakeLogger {
  return {
    // NOTE: the two casts are because of a TypeScript inconsistency with tuple types and any[]. all tuple types
    // should be assignable to any[], but TypeScript doesn't think so.
    setLevel: sinon.fake() as SinonSpy<Parameters<Logger['setLevel']>, ReturnType<Logger['setLevel']>>,
    setName: sinon.fake() as SinonSpy<Parameters<Logger['setName']>, ReturnType<Logger['setName']>>,
    debug: sinon.fake(),
    info: sinon.fake(),
    warn: sinon.fake(),
    error: sinon.fake(),
  };
}
