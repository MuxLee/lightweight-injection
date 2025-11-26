import type { InjectionFactory } from '@injection/factory';
import type { Injection } from '@injection/injection';
import type { Injector } from '@injector/injector';
import type { Class, ClassInstance, ConsturctorInstanceTuple, ConsturctorTuple, SingleClassInstance, Tuple } from '@util/util';

/**
 * 의존성 주입 토큰 인터페이스
 *
 * @template P 제공자 유형
 * @author Mux
 * @version 1.0.0
 */
interface InjectionToken<P> {

    /**
     * 의존성 고유값을 반환합니다.
     *
     * @returns {string} 의존성 고유값
     */
    get identity(): string;

    /**
     * 의존성 제공자를 반환합니다.
     *
     * @param {Injector} injector 의존성 주입자
     * @returns {P} 의존성 제공자
     */
    provide(injector: Injector): P;

}

/**
 * 의존성 주입 토큰 클래스
 *
 * @protected
 * @template P 의존성 제공자 유형
 * @implements {InjectionToken<P>}
 * @author Mux
 * @version 1.0.0
 */
class _InjectionToken<P> implements InjectionToken<P> {

    /**
     * 의존성 고유값
     *
     * @type {string}
     */
    #identity: string;

    /**
     * {@link _InjectionToken} 클래스의 생성자입니다.
     *
     * @param {string} identity 의존성 고유값
     */
    constructor(identity: string) {
        this.#identity = identity;
    }

    /**
     * 의존성 고유값을 반환합니다.
     *
     * @returns {string} 의존성 고유값
     */
    get identity(): string {
        return this.#identity;
    };

    /**
     * 의존성 제공자를 반환합니다.
     *
     * @param {Injector} injector 의존성 주입자
     * @returns {P} 의존성 제공자
     */
    provide(injector: Injector): P {
        throw new Error('\'provide\' 메소드가 구현되지 않았습니다.');
    };

}

/**
 * 클래스 배열 의존성 주입 토큰 클래스
 * 
 * @template {Class[]} P 의존성 제공자 유형
 * @extends {_InjectionToken<ConsturctorInstanceTuple<P>>}
 */
class ArrayInjectionToken<P extends Class[]> extends _InjectionToken<ConsturctorInstanceTuple<P>> {

    /**
     * 클래스 개체 튜플
     * 
     * @type {ConsturctorTuple<P>}
     */
    #classes: ConsturctorTuple<P>;

    /**
     * {@link ArrayInjectionToken} 클래스의 생성자입니다.
     * 
     * @param {string} identity 의존성 고유값
     * @param {ConsturctorTuple<P>} classes 클래스 개체 튜플
     */
    constructor(identity: string, classes: ConsturctorTuple<P>) {
        super(identity);
        this.#classes = classes;
    }

    /**
     * 클래스 객체 튜플을 반환합니다.
     * 
     * @override
     * @param {Injector} injector 의존성 주입자
     * @returns {ConsturctorInstanceTuple<P>} 클래스 튜플 객체
     */
    provide(injector: Injector): ConsturctorInstanceTuple<P> {
        // @ts-ignore
        // TODO 튜플 객체 타입으로부터 생성되는 객체의 타입이 any로 잡히고 있어, 해결방법을 고민할 필요가 있다.
        return this.#classes.map(($class) => Reflect.construct($class, []));
    }

}

/**
 * 클래스 의존성 주입 토큰 클래스
 * 
 * @template {Class} P 의존성 제공자 유형
 * @extends {_InjectionToken<InstanceType<P>>}
 * @author Mux
 * @version 1.0.0
 */
class ClassInjectionToken<P extends Class> extends _InjectionToken<InstanceType<P>> {

    /**
     * 클래스 개체
     *
     * @type {P}
     */
    #class: P;

    /**
     * {@link ClassInjectionToken} 클래스의 생성자입니다.
     *
     * @param {string} identity 의존성 고유값
     * @param {P} $class 클래스 개체
     */
    constructor(identity: string, $class: P) {
        super(identity);
        this.#class = $class;
    }

    /**
     * 클래스 객체를 반환합니다.
     * 
     * @override
     * @param {Injector} injector 의존성 주입자
     * @returns {InstanceType<P>} 클래스 객체
     */
    provide(injector: Injector): InstanceType<P> {
        return Reflect.construct(this.#class, []);
    }

}

/**
 * 하위 의존성이 포함된 클래스 의존성 토큰 클래스
 * 
 * @template {Class} P 의존성 제공자 유형
 * @extends {_InjectionToken<InstanceType<P>>}
 * @author Mux
 * @version 1.0.0
 */
class DependClassInjectionToken<P extends Class> extends _InjectionToken<InstanceType<P>> {

    /**
     * 클래스 개체
     *
     * @type {P}
     */
    #class: P;

    /**
     * 하위 클래스 개체
     * 
     * @type {Injection<unknown>[] | string[]}
     */
    #dependencies: Injection<unknown>[] | string[];

    /**
     * {@link DependClassInjectionToken} 클래스의 생성자입니다.
     * 
     * @param {string} identity 의존성 고유 식별자
     * @param {P} $class 클래스 개체
     * @param {Injection<unknown>[] | string[]} dependencies 하위 클래스 개체
     */
    constructor(identity: string, $class: P, dependencies: Injection<unknown>[] | string[]) {
        super(identity);
        this.#class = $class;
        this.#dependencies = dependencies;
    }

    /**
     * 클래스 개체를 반환합니다.
     * 
     * @override
     * @param {Injector} injector 의존성 주입자
     * @returns {InstanceType<P>} 클래스 개체
     */
    provide(injector: Injector): InstanceType<P> {
        const dependencies = this.#dependencies.map((dependency) => injector.get(dependency));

        return Reflect.construct(this.#class, dependencies);
    }

}

/**
 * 클래스 팩토리 의존성 주입 토큰 클래스
 *
 * @template P 의존성 제공자 유형
 * @extends {_InjectionToken<P>}
 * @author Mux
 * @version 1.0.0
 */
class FactoryInjectionToken<P> extends _InjectionToken<P> {

    /**
     * 의존성 생성기
     *
     * @type {InjectionFactory<P>}
     */
    #factory: InjectionFactory<P>;

    /**
     * {@link FactoryInjectionToken} 클래스의 생성자입니다.
     *
     * @param {string} identity 의존성 고유값
     * @param {InjectionFactory<SingleClassInstance<P>>} factory 의존성 생성기
     */
    constructor(identity: string, factory: InjectionFactory<SingleClassInstance<P>>) {
        super(identity);
        this.#factory = factory;
    }

    /**
     * 클래스 객체 반환합니다.
     *
     * @override
     * @param {Injector} injector 의존성 주입자
     * @returns {P} 클래스 객체
     */
    provide(injector: Injector): P {
        return this.#factory(injector);
    }

}

/**
 * 클래스 튜플 팩토리 의존성 주입 토큰 클래스
 *
 * @template {ClassInstance<any>[]} P 의존성 제공자 유형
 * @extends {_InjectionToken<Tuple<P>>}
 * @author Mux
 * @version 1.0.0
 */
class TupleFactoryInjectionToken<P extends ClassInstance<unknown>[]> extends _InjectionToken<P> {

    /**
     * 튜플 팩토리 개체
     *
     * @type {InjectionFactory<Tuple<P>>}
     */
    #factory: InjectionFactory<Tuple<P>>;

    /**
     * {@link FactoryInjectionToken} 클래스의 생성자입니다.
     *
     * @param {string} identity 의존성 고유 식별자
     * @param {InjectionFactory<Tuple<P>>} factory 팩토리 개체
     */
    constructor(identity: string, factory: InjectionFactory<Tuple<P>>) {
        super(identity);
        this.#factory = factory;
    }

    /**
     * 튜플 팩토리 개체를 반환합니다.
     *
     * @override
     * @param {Injector} injector 의존성 주입자
     * @returns {Tuple<P>} 튜플 팩토리 개체
     */
    provide(injector: Injector): Tuple<P> {
        return this.#factory(injector);
    }

}

export type {
    InjectionToken
};

export {
    ArrayInjectionToken,
    ClassInjectionToken,
    DependClassInjectionToken,
    FactoryInjectionToken,
    TupleFactoryInjectionToken
};