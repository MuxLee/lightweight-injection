import type { InjectionIdentity } from '@injection/identity';
import type { Injection } from '@injection/injection';
import type { InjectionToken } from '@injection/token';
import type { InjectorOptions } from '@injector/options';
import type { AnyArray, Constructor } from '@util/util';
import { getAllPropertyDescriptor, isClass } from '@util/util';

/**
 * 의존성 고유값 추출 인터페이스
 * 
 * @template T 개체 유형
 * @author Mux
 * @version 1.0.0
 */
interface InjectionIdentityParser<T> {

    /**
     * 의존성 고유값을 추출하여 반환합니다.
     * 
     * @template {T} S 개체 유형
     * @param {Injection<S> | string} token 개체
     * @param {InjectorOptions<S> | undefined} options 의존성 생성 설정
     * @returns {InjectionIdentity} 의존성 고유값
     */
    parse<S extends T>(token: Injection<S> | string, options?: InjectorOptions<S>): InjectionIdentity;

    /**
     * 의존성 고유값 추출 가능여부를 판별합니다.
     * 
     * @template T 개체 유형
     * @param {Injection<T> | string} object 개체
     * @returns {boolean} 추출 가능여부
     */
    supports<T>(object: Injection<T> | string): boolean;

}

/**
 * 배열 개체의 의존성 고유값 추출 클래스
 * 
 * @deprecated
 * @implements {InjectionIdentityParser<AnyArray>}
 * @author Mux
 * @version 1.0.0
 */
class ArrayInjectionIdentityParser implements InjectionIdentityParser<AnyArray> {

    /**
     * 배열 개체에서 의존성 고유값을 추출하여 반환합니다.
     * 
     * @template {AnyArray} T 배열 개체 유형
     * @param {InjectionToken<T>} token 배열 개체
     * @param {InjectorOptions<T> | undefined} options 의존성 생성 설정
     * @returns {InjectionIdentity} 의존성 고유값
     */
    parse<T extends AnyArray>(token: InjectionToken<T>, options?: InjectorOptions<T> | undefined): InjectionIdentity {
        return token.identity;
    }

    /**
     * 개체가 배열 개체인지 판별합니다.
     * 
     * @template T 개체 유형
     * @param {Injection<T>} object 개체
     * @returns {boolean} 추출 가능여부
     */
    supports<T>(object: Injection<T>): boolean {
        return !!object && object instanceof Array;
    }

}

/**
 * 클래스 개체의 의존성 고유값 추출 클래스
 * 
 * @implements {InjectionIdentityParser<Constructor>}
 * @author Mux
 * @version 1.0.0
 */
class ClassInjectionIdentityParser implements InjectionIdentityParser<Constructor> {

    /**
     * 클래스 개체에서 의존성 고유값을 추출하여 반환합니다.
     * 
     * @template T 클래스 개체 유형
     * @param {Constructor<T>} constructor 클래스 개체
     * @param {InjectorOptions<T> | undefined} options 의존성 생성 설정
     * @returns {InjectionIdentity} 의존성 고유값
     */
    parse<T>(constructor: Constructor<T>, options?: InjectorOptions<T> | undefined): InjectionIdentity {
        return options?.name ?? constructor.name;
    }

    /**
     * 개체가 클래스 개체인지 판별합니다.
     * 
     * @template T 개체 유형
     * @param {Injection<T>} object 개체
     * @returns {boolean} 추출 가능여부
     */
    supports<T>(object: Injection<T>): boolean {
        return isClass(object);
    }

}

/**
 * 의존성 토큰 개체의 의존성 고유값 추출 클래스
 * 
 * @implements {InjectionIdentityParser<InjectionToken<unknown>>}
 * @author Mux
 * @version 1.0.0
 */
class InjectionTokenIdetntiyParser implements InjectionIdentityParser<InjectionToken<unknown>> {

    /**
     * 클래스 개체에서 의존성 고유값을 추출하여 반환합니다.
     * 
     * @template T 개체 유형
     * @param {InjectionToken<T>} token 의존성 주입 토큰 개체
     * @param {InjectorOptions<T> | undefined} options 의존성 생성 설정
     * @returns {InjectionIdentity} 의존성 고유값
     */
    parse<T>(token: InjectionToken<T>, options?: InjectorOptions<T> | undefined): InjectionIdentity {
        return token.identity;
    }

    /**
     * 개체가 의존성 주입 토큰 개체인지 판별합니다.
     * 
     * @template T 개체 유형
     * @param {Injection<T>} object 개체
     * @returns {boolean} 추출 가능여부
     */
    supports<T>(object: Injection<T>): boolean {
        return !!getAllPropertyDescriptor(object, 'identity')?.get;
    }

}

/**
 * 문자열 형태의 의존성 고유값 추출 클래스
 * 
 * @implements {InjectionIdentityParser<string>}
 * @author Mux
 * @version 1.0.0
 */
class NamedInjectionIdentityParser implements InjectionIdentityParser<string> {

    /**
     * 클래스 개체에서 의존성 고유값을 추출하여 반환합니다.
     * 
     * @param {string} target target 문자열 개체
     * @param {InjectorOptions<T> | undefined} options 의존성 설정
     * @returns {InjectionIdentity} 의존성 고유값
     */
    parse<T>(target: string, options?: InjectorOptions<T> | undefined): InjectionIdentity {
        return target;
    }

    /**
     * 개체가 문자열인지 판별합니다.
     * 
     * @param {string} object 개체
     * @returns {boolean} 추출 가능여부
     */
    supports(object: string): boolean {
        return typeof object === 'string';
    }

}

export type {
    InjectionIdentityParser
};

export {
    ArrayInjectionIdentityParser,
    ClassInjectionIdentityParser,
    InjectionTokenIdetntiyParser,
    NamedInjectionIdentityParser
};