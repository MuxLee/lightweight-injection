/**
 * 모든 형태의 배열 유형
 * 
 * @author Mux
 * @version 1.0.0
 */
type AnyArray = any[];

/**
 * 클래스 유형
 * 
 * @author Mux
 * @version 1.0.0
 */
type Class = new (...args: any[]) => any;

/**
 * 클래스 객체 유형
 * 
 * @template T 개체 유형
 * @author Mux
 * @version 1.0.0
 */
type ClassInstance<T> = T extends Class ? never : T;

/**
 * 클래스 객체 튜플 유형
 * 
 * @template {Class[]} T 클래스 개체 배열 유형
 * @author Mux
 * @version 1.0.0
 */
type ClassInstanceTuple<T extends Class[]> = {

    [K in keyof T]: InstanceType<T[K]>;
    
};

/**
 * 클래스 튜플 유형
 * 
 * @template {Class[]} T 클래스 개체 배열 유형
 * @author Mux
 * @version 1.0.0
 */
type ClassTuple<T extends Class[]> = [...T];

/**
 * 클래스 생성자 유형
 *
 * @template {unknown} T 개체 유형
 * @author Mux
 * @version 1.0.0
 */
type Constructor<T = unknown> = new (...args: any[]) => T;

/**
 * 클래스 객체 튜플 유형
 * 
 * @template {Constructor<T>} T 클래스 생성자 개체 배열 유형
 * @author Mux
 * @version 1.0.0
 */
type ConsturctorInstanceTuple<T extends Constructor<T>[]> = {

    [K in keyof T]: InstanceType<T[K]>;

}

/**
 * 클래스 생성자 튜플 유형
 * 
 * @template {Constructor<T>[]} T 클래스 생성자 개체 배열 유형
 * @author Mux
 * @version 1.0.0
 */
type ConsturctorTuple<T extends Constructor<T>[]> = [...T];

/**
 * 비 배열 유형
 * 
 * @template T 개체 유형
 * @author Mux
 * @version 1.0.0
 */
type NonArray<T> = T extends Array<unknown> ? never : T;

/**
 * 단일 클래스 객체 유형
 * 
 * @template T 개체 유형
 * @author Mux
 * @version 1.0.0
 */
type SingleClassInstance<T> = ClassInstance<T> & NonArray<T>;

/**
 * 튜플 유형
 * 
 * @template {any[]} T
 * @author Mux
 * @version 1.0.0
 */
type Tuple<T extends any[]> = [...T];

/**
 * 클래스 형태 정규 표현식
 * 
 * @protected
 * @type {RegExp}
 */
const _classRegExp: RegExp = new RegExp(/^class\s/);

/**
 * 개체의 속성 정의를 반환합니다.
 * 
 * @template T 개체 제네릭 유형
 * @param {T} target 개체
 * @param {PropertyKey} propertyKey 개체 속성명
 * @returns {PropertyDescriptor | null} 속성 정보
 */
function getAllPropertyDescriptor<T>(target: T, propertyKey: PropertyKey): PropertyDescriptor | null {
    let object = target;

    while (object) {
        const descriptor = global.Object.getOwnPropertyDescriptor(object, propertyKey);
        
        if (descriptor) {
            return descriptor;
        }

        object = global.Object.getPrototypeOf(object);
    }
    
    return null;
}

/**
 * 개체가 클래스 유형인지 판별합니다.
 * 
 * @param {any} object 개체
 * @returns {object is Class} 클래스 유형 여부
 */
function isClass(object: any): object is Class {
    if (typeof object === 'function') {
        const string = object.toString();

        return _classRegExp.test(string);
    }

    return false;
}

export type {
    AnyArray,
    Class,
    ClassInstance,
    ClassInstanceTuple,
    ClassTuple,
    Constructor,
    ConsturctorInstanceTuple,
    ConsturctorTuple,
    NonArray,
    SingleClassInstance,
    Tuple
};

export {
    getAllPropertyDescriptor,
    isClass
};