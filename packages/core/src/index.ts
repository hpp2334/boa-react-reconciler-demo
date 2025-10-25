/**
 * BOA React Reconciler Demo - Core Package
 *
 * This package contains the core functionality for the BOA React reconciler implementation.
 */

export const VERSION = '1.0.0';

export function hello(name: string = 'World'): string {
  return `Hello, ${name}! This is the BOA React Reconciler Core package v${VERSION}`;
}

export * from './reconciler';
export * from './fiber';
export * from './scheduler';
