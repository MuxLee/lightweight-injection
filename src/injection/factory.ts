import type { Injector } from '@injector/injector';

/**
 * 의존성 생성기 유형
 *
 * @template T 개체 유형
 * @author Mux
 * @version 1.0.0
 */
type InjectionFactory<T> = (injector: Pick<Injector, 'get'>) => T;

export type {
    InjectionFactory
};