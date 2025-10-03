import type { InjectionIdentity } from '@injection/identity';
import type { Injection } from '@injection/injection';
import type { InjectionIdentityParser } from '@injection/parser';
import type { InjectionToken} from '@injection/token';
import { DependClassInjectionToken } from '@injection/token';
import type { InjectorOptions } from '@injector/options';
import type { ClassInstance } from '@util/util';
import { isClass } from '@util/util';

/**
 * 의존성 관리 인터페이스
 *
 * @author Mux
 * @version 1.0.0
 */
interface Injector {

    /**
     * 의존성을 생성합니다.
     *
     * @template T 개체 유형
     * @param {Injection<T>} object 의존성 개체
     * @param {InjectorOptions<T> | undefined} options 의존성 생성 설정
     * @returns {Injector} 의존성 주입자
     */
    create<T>(object: Injection<T>, options?: InjectorOptions<T> | undefined): Injector;

    /**
     * 의존성 개체를 가져옵니다.
     *
     * @template T 개체 유형
     * @param {Injection<T> | string} object 의존성 개체
     * @returns {T} 의존성 개체
     */
    get<T>(object: Injection<T> | string): T;

}

/**
 * 의존성 관리 추상 클래스
 *
 * @implements {Injector}
 * @author Mux
 * @version 1.0.0
 */
abstract class AbstractInjector implements Injector {

    /**
     * 의존성 고유값 추출기 목록
     * 
     * @type {InjectionIdentityParser<unknown>[]}
     */
    #injectorIdentityParsers: InjectionIdentityParser<unknown>[];

    /**
     * {@link AbstractInjector} 클래스의 생성자입니다.
     */
    constructor() {
        this.#injectorIdentityParsers = [];
    }

    /**
     * 의존성을 생성합니다.
     *
     * @template T 개체 유형
     * @param {Injection<T>} object 의존성 개체
     * @param {InjectorOptions<T> | undefined} options 의존성 생성 설정
     * @returns {Injector} 의존성 주입자
     */
    create<T>(object: Injection<T>, options?: InjectorOptions<T> | undefined): Injector {
        throw new Error('\'create\' 메소드가 구현되지 않았습니다.');
    }

    /**
     * 의존성 개체를 가져옵니다.
     *
     * @template T 개체 유형
     * @param {Injection<T> | string} object 의존성 개체
     * @returns {T} 의존성 개체
     */
    get<T>(object: Injection<T> | string): T {
        throw new Error('\'get\' 메소드가 구현되지 않았습니다.');
    }

    /**
     * 의존성 고유값 추출기를 등록합니다.
     * 
     * @template T 개체 유형
     * @param {InjectionIdentityParser} injectionIdentityParser 의존성 고유값 추출기
     * @returns {void}
     */
    registerInjectionIdentityParser<T>(injectionIdentityParser: InjectionIdentityParser<T>): void {
        this.#injectorIdentityParsers.push(injectionIdentityParser);
    }

    /**
     * 의존성 고유값을 추출하여 반환합니다.
     * 
     * @protected
     * @template T 개체 유형
     * @param {Injection<T> | string} object 의존성 개체
     * @param {InjectorOptions<T> | undefined} options 의존성 생성 설정
     * @returns {InjectionIdentity} 의존성 고유값
     */
    _parse<T>(object: Injection<T> | string, options?: InjectorOptions<T> | undefined): InjectionIdentity {
        for (const injectorIdentityParser of this.#injectorIdentityParsers) {
            if (injectorIdentityParser.supports(object)) {
                return injectorIdentityParser.parse(object, options);
            }
        }

        throw new Error('의존성 고유값을 추출할 수 없습니다.');
    }

}

/**
 * 내부 저장이 존재하는 의존성 관리 클래스
 * 
 * @implements {Injector}
 * @extends {AbstractInjector}
 * @author Mux
 * @version 1.0.0
 */
class StoredInjector extends AbstractInjector {

    /**
     * 의존성 개체 저장소
     * 
     * @type {Map<InjectionIdentity, InjectionToken<any>>}
     */
    #dependencyStorage: Map<InjectionIdentity, InjectionToken<any>>;

    /**
     * 의존성 객체 저장소
     *
     * @type {Map<InjectionIdentity, ClassInstance<any>>}
     */
    #instanceStorage: Map<InjectionIdentity, ClassInstance<any>>;

    /**
     * {@link StoredInjector} 클래스의 생성자입니다.
     */
    constructor() {
        super();
        this.#dependencyStorage = new Map();
        this.#instanceStorage = new Map();
    }

    /**
     * @inheritdoc 
     */
    create<T>(object: Injection<T>, options?: InjectorOptions<T> | undefined): Injector {
        const injectionIdentity = super._parse(object, options);

        if (this.#dependencyStorage.has(injectionIdentity) || this.#instanceStorage.has(injectionIdentity)) {
            const identity = injectionIdentity.toString();

            throw new Error(`이미 동일한 고유값을 가진 의존성이 존재합니다. ('${identity}')`);
        }

        if (isClass(object)) {
            const identity = injectionIdentity.toString();
            const dependencies = options?.dependencies ?? [];

            object = new DependClassInjectionToken(identity, object, dependencies);
        }

        this.#dependencyStorage.set(injectionIdentity, object);
        
        return this;
    }

    /**
     * @inheritdoc
     */
    get<T>(object: Injection<T> | string): T {
        const injectionIdentity = super._parse(object);
        const instance = this.#instanceStorage.get(injectionIdentity);

        if (instance) {
            return instance;
        }

        const dependency = this.#dependencyStorage.get(injectionIdentity);

        if (dependency) {
            const instance = dependency.provide(this);

            this.#instanceStorage.set(injectionIdentity, instance);
            this.#dependencyStorage.delete(injectionIdentity);

            return instance;
        }

        const identity = injectionIdentity.toString();

        throw new Error(`의존성 객체를 찾을 수 없습니다. ('${identity}')`);
    }

}

export type {
    Injector
};

export {
    StoredInjector
};