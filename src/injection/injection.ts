import type { InjectionToken } from '@injection/token';
import type { Constructor } from '@util/util';

/**
 * 의존성 개체 유형
 *
 * @template T 개체 유형
 * @author Mux
 * @version 1.0.0
 */
type Injection<T> = Constructor<T> | InjectionToken<T>;

export type {
    Injection
};
