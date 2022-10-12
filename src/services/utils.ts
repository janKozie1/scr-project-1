import { Fn, Miliseconds, MinMax } from "./types";

export const isNil = <T>(arg: T | null | undefined): arg is null | undefined => arg === null || arg === undefined;
export const isNotNil = <T>(arg: T | null | undefined): arg is T => !isNil(arg);

export const isNumber = (arg: unknown): arg is number => typeof arg === 'number' && isFinite(arg);

export function flow<A, B>(_fn1: Fn<A, B>): Fn<A, B>
export function flow<A, B, C>(_fn1: Fn<A, B>, _fn2: Fn<B, C>): Fn<A, C>
export function flow<A, B, C, D>(_fn1: Fn<A, B>, _fn2: Fn<B, C>, _fn3: Fn<C, D>): Fn<A, D>
export function flow<A, B, C, D, E>(_fn1: Fn<A, B>, _fn2: Fn<B, C>, _fn3: Fn<C, D>, _fn4: Fn<D, E>): Fn<A, E>
export function flow<A, B, C, D, E, F>(_fn1: Fn<A, B>, _fn2: Fn<B, C>, _fn3: Fn<C, D>, _fn4: Fn<D, E>, _fn5: Fn<E, F>): Fn<A, F>
export function flow<A, B, C, D, E, F>(_fn1: Fn<A, B>, _fn2?: Fn<B, C>, _fn3?: Fn<C, D>, _fn4?: Fn<D, E>, _fn5?: Fn<E, F>) {
  const args = arguments;
  return (arg: A) => Array.from(args).reduce((prev, curr) => curr(prev), arg)
}

export const getRandomId = () => Math.random().toString(36);

export const getRandomMs = (range: MinMax<Miliseconds>) => {
  return Math.floor(Math.random() * (range.max - range.min)) + range.min;
}

export const append = <T>(arg: T) => (arr: T[]): T[] => arr.concat([arg]);
export const pop = <T>(arr: T[]): T[] => arr.slice(0, arr.length - 1);
export const concat = <T>(arg: T[]) => (arr: T[]): T[] => arr.concat(arg);

export const first = <T>(arr: T[]): T => arr[0];
export const last = <T>(arr: T[]): T => arr[arr.length - 1];

export const sum = (arg: number, arg2: number) => arg + arg2;
export const add = (arg: number) => (arg2: number) => arg + arg2;
