import type { InjectionFactory } from '@injection/factory';
import type { InjectionIdentity } from '@injection/identity';
import type { Injection } from '@injection/injection';

/**
 * 의존성 생성 설정 인터페이스
 *
 * @template T 개체 유형
 * @author Mux
 * @version 1.0.0
 */
interface InjectorOptions<T> {

    /**
     * 하위 의존성 목록
     *
     * @readonly
     * @type {Injection<unknown>[] | undefined}
     */
    readonly dependencies?: Injection<unknown>[] | string[] | undefined;

    /**
     * 의존성 생성기
     *
     * @readonly
     * @template T 의존성 제네릭 유형
     * @type {InjectionFactory<T> | undefined}
     */
    readonly factory?: InjectionFactory<T> | undefined;

    /**
     * 의존성명
     *
     * @readonly
     * @type {InjectionIdentity | undefined}
     */
    readonly name?: InjectionIdentity | undefined;

}

export type {
    InjectorOptions
};