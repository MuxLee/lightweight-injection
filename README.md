# Lightweight Injection (Alpha)
[Javascript]와 [Typescript]를 위한 경량형 의존성 라이브러리입니다.

개발되는 프로젝트 안에서, 의존적인 개체들을 관리하고 주입하는 기능이 필요하다면 고려해볼 수 있는 라이브러리입니다.

> ✅ `Typescript Server`가 내장된 `IDE`일 경우, `Intellisense`를 통한 자동완성을 제공합니다.

>  ⚠️ **Alpha** 단계로, 언제든 기능들이 변경될 수 있습니다.

## 설치
**npm** 사용자
```bash
$ npm install lightweight-injection
```

**yarn** 사용자
```bash
$ yarn add lightweight-injection
```
&nbsp;

## Injector
의존성을 등록하고, 가져올 수 있는 `injector`입니다.

```javascript
import { StoredInjector } from 'lightweight-injection/injector';

// 의존성을 내장된 저장소에 보관하는 기본 의존성 주입자
const injector = new StoredInjector();
```
&nbsp;

다음과 같이 의존성을 등록하고, 가져올 수 있습니다.
```javascript
class Example {

    example() {
        console.log('called');
    }

}

injector.create(Example);
injector.get(Example).example(); // 'called'
```
&nbsp;

[Javascript]에서 문자열을 통해 가져온 의존성 개체의 타입추론은 다음과 같이 할 수 있습니다.
```javascript
class A {}

injector.create(A, { name: 'MyCustomA' });

/** @type {A} */
const a = injector.get('MyCustomA');
```
&nbsp;

[Typescript]에서 문자열을 통해 가져온 의존성 개체의 타입추론은 다음과 같이 할 수 있습니다.
```typescript
class A {}

injector.create(A, { name: 'MyCustomA' });

const a = injector.get<A>('MyCustomA');
```
&nbsp;

만약, 일부 의존성이 존재하기 전에 참조가 필요할 경우 `lazy` 기능과 `resolve` 기능의 사용을 고려해볼 수 있습니다.
```javascript
// user.controller
class LazyUserController {

    #userService;

    consturctor(userService) {
        this.#userService = userService;
    }

    users() {
        return this.#userService.getUsers();
    }

}

injector.lazy('UserService', function(userService) {
    if (!(userService instanceof LocalUserService)) {
        injector.create(LazyUserService, {
            dependencies: ['UserService']
        });
    }
});
```
```javascript
// user.service
class LocalUserService {

    getUsers() {
        return ['guest1', 'guest2'];
    }

}

class SimpleUserService {

    getUsers() {
        return ['admin', 'mux'];
    }

}

const userService = environment.profile === 'local'
    ? LocalUserService
    : SimpleUserService;

injector.create(userService, {
    name: 'UserService'
});
injector.resolve('UserService');
```
&nbsp;

별도의 `injector`를 생성하고 싶다면, `Injector` 인터페이스에 맞게 구현하여 사용할 수 있습니다.
```typescript
interface Injector {

    /**
     * 의존성을 구성합니다.
     *
     * @template T 개체 유형
     * @param {Injection<T>} object 의존성 개체
     * @param {InjectorOptions<T> | undefined} options 의존성 구성 설정
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

    /**
     * 의존성 개체를 지연하여 가져옵니다.
     * 
     * @template T 개체 유형
     * @param {Injection<T> | string} object 의존성 개체
     * @param {InjectListenerCallback<T>} listener 의존성 주입 콜백
     * @returns {void}
     */
    lazy<T>(object: Injection<T> | string, listener: InjectListenerCallback<T>): void;

    /**
     * 의존성을 처리합니다.
     * 
     * @template T 개체 유형
     * @param {Injection<T> | string} object 의존성 개체
     * @returns {void}
     */
    resolve<T>(object: Injection<T> | string): void;

}
```
&nbsp;

## Parser
의존성에 대한 고유값(`identity`)를 통해, 같은 객체라도 서로 다르게 구분할 수 있습니다.
이를 구분하기 위해서는 `parser`를 등록해야합니다.
&nbsp;

`ClassInjectionIdentityParser`는 `class`의 이름을 추출합니다.
 ```javascript
 import { ClassInjectionIdentityParser } from 'lightweight-injection/injection';

... 생략

 class A {}
 
 injector.registerParser(new ClassInjectionIdentityParser());
 injector.create(A); // 'A'로 등록됩니다.
 injector.get(A); // 'A'로 등록된 의존성 개체를 가져옵니다.
 ```
&nbsp;

`InjectionTokenIdentityParser`는 `token`의 이름을 추출합니다.
 ```javascript
 import {
    ClassInjectionToken,
    InjectionTokenIdentityParser
} from 'lightweight-injection/injection';

... 생략

 class A {}
 
 const token = new ClassInjectionToken('TokenA', A);

 injector.registerParser(new InjectionTokenIdentityParser());
 injector.create(token); // 토큰의 이름인 'TokenA'로 등록됩니다.
 injector.get(token); // 토큰의 이름인 'TokenA'로 등록된 의존성 개체를 가져옵니다.
 ```
 &nbsp;

`NamedInjectionIdentityParser`는 의존성을 등록할 때, 사용한 문자열을 추출합니다.
 ```javascript
 import { NamedInjectionIdentityParser } from 'lightweight-injection/injection';

... 생략

 class A {}
 
 injector.registerParser(new NamedInjectionIdentityParser());
 injector.create(A, { name: 'MyCustomA' }); // 'MyCustomA'로 등록됩니다.
 injector.get('MyCustomA') // 'MyCustomA'로 등록된 의존성 개체를 가져옵니다.
 ```
 &nbsp;

동시에 여러개의 `parser`를 등록할 수 있으며, 등록한 순서대로 추출을 수행합니다.
```javascript
import {
    ClassInjectionIdentityParser,
    InjectionTokenIdentityParser,
    NamedInjectionIdentityParser
} from 'lightweight-injection/injection';

... 생략

injector.registerParser(new ClassInjectionIdentityParser()); // 1순위
injector.registerParser(new InjectionTokenIdentityParser()); // 2순위
injector.registerParser(new NamedInjectionIdentityParser()); // 3순위
```
&nbsp;

별도의 `parser`를 생성하고 싶다면 `InjectionIdentityParser` 인터페이스에 맞게 구현하여 등록할 수 있습니다.
```typescript
interface InjectionIdentityParser<T> {

    /**
     * 의존성 고유값을 추출하여 반환합니다.
     * 
     * @template S 개체 유형
     * @param {T} token 개체
     * @param {InjectorOptions<S> | undefined} options 의존성 생성 설정
     * @returns {InjectionIdentity} 의존성 고유값
     */
    parse<S>(token: T, options?: InjectorOptions<S>): InjectionIdentity;

    /**
     * 의존성 고유값 추출 가능여부를 판별합니다.
     * 
     * @template T 개체 유형
     * @param {Injection<T> | string} object 개체
     * @returns {boolean} 추출 가능여부
     */
    supports<T>(object: Injection<T> | string): boolean;

}
```
&nbsp;

## Token
의존성 개체를 등록하는 또 다른 방법을 제공합니다.
&nbsp;

`ArrayInjectionToken`는 클래스 개체가 담긴 배열을 의존성으로 등록할 때 사용되며, 객체를 가져올 때는 `tuple` 형태로 제공되어 배열 요소를 자동으로 추론합니다.
```javascript
import { ArrayInjectionToken } from 'lightweight-injection/injection';

class Example1 {

    example1() {
        console.log('A');
    }

}
class Example2 {

    example2() {
        console.log('B');
    }

}

const TOKEN = new ArrayInjectionToken('ArrayToken', [Example1, Example2]);

injector.create(TOKEN);
injector.get(TOKEN) // [Example1, Example2] 튜플 객체
injector.get('ArrayToken'); // [Example1, Example2] 튜플 객체
```
&nbsp;

`ClassInjectionToken`는 단일 클래스 개체를 등록할 때 사용되며, 해당 클래스의 객체가 자동으로 추론됩니다.
```javascript
import { ClassInjectionToken } from 'lightweight-injection/injection';

class Example {

    example() {
        console.log('example')
    }

}

const TOKEN = new ClassInjectionToken('ClassToken', Example);

injector.create(TOKEN);
injector.get(TOKEN); // Example 객체
injector.get('ClassToken'); // Example 객체
```
&nbsp;

`DependClassInjectionToken`는 하위 의존성을 포함하는 단일 클래스 개체를 등록할 때 사용되며, 해당 클래스의 객체가 자동으로 추론됩니다.
```javascript
import { DependClassInjectionToken } from 'lightweight-injection/injection';

class Example {

    #prefix;
    #suffix;

    constructor(prefix, suffix) {
        this.#prefix = prefix;
        this.#suffix = suffix;
    }

    example() {
        const message = this.#prefix.prefix() + 'Mux' + this.#suffix.suffix();

        console.log(message);
    }

}

class Prefix {

    prefix() {
        return 'Hello, ';
    }

}

class Suffix {

    suffix() {
        return '!!!';
    }

}

const TOKEN = new DependClassInjectionToken('DependToken', Example, [Prefix, Suffix]);

injector.create(TOKEN);
injector.create(Prefix);
injector.create(Suffix);
injector.get(TOKEN); // Example 객체
injector.get('DependToken'); // Example 객체
```
&nbsp;

`FactoryInjectionToken`는 팩토리 함수를 통해 동적으로 단일 개체를 등록할 때 사용되며, 팩토리 함수에 인자로 `injector`를 제공합니다.
```javascript
import { FactoryInjectionToken } from 'lightweight-injection/injection';

class Example {

    #converter

    constructor(converter) {
        this.#converter = converter;
    }

    example() {
        const message = converter.convert('mux');

        console.log(message);
    }

}

class LowerConverter {

    convert(text) {
        return text.toLowerCase();
    }

}

class UpperConverter {

    convert(text) {
        return text.toUpperCase();
    }

}

const TOKEN = new FactoryInjectionToken('FactoryToken', function($injector) {
    // 원하는 의존성을 생성 시점에서 $injector로 가져올 수 있습니다.
    const converter = 'mux' === 'genius'
        ? $injector.get(UpperConverter)
        : $injector.get(LowerConverter);

    return new Example(converter);
});

injector.create(TOKEN);
injector.create(LowerConverter);
injector.create(UpperConverter);
injector.get(TOKEN); // Example 객체
injector.get('FactoryToken'); // Example 객체
```
&nbsp;

`TupleFactoryInjectionToken`는 팩토리 함수를 통해 동적으로 여러 개체를 등록할 때 사용되며, 팩토리 함수에 인자로 `injector`를 제공합니다.
```javascript
import { TupleFactoryInjectionToken } from 'lightweight-injection/injection';

class Example1 {

    #converter

    constructor(converter) {
        this.#converter = converter;
    }

    example() {
        const message = converter.convert('mux');

        console.log(message);
    }

}

class Example2 {

    #converter

    constructor(converter) {
        this.#converter = converter;
    }

    example() {
        const message = converter.convert('mux');

        console.log(message);
    }

}

class LowerConverter {

    convert(text) {
        return text.toLowerCase();
    }

}

class UpperConverter {

    convert(text) {
        return text.toUpperCase();
    }

}

const TOKEN = new TupleFactoryInjectionToken('TupleFactoryToken', function($injector) {
    // 원하는 의존성을 생성 시점에서 $injector로 가져올 수 있습니다.
    const lowerConverter = $injector.get(LowerConverter);
    const upperConverter = $injector.get(UpperConverter);

    return [
        new Example1(lowerConverter),
        new Example2(upperConverter)
    ];
});

injector.create(TOKEN);
injector.create(LowerConverter);
injector.create(UpperConverter);
injector.get(TOKEN); // [Example1, Example2] 튜플 객체
injector.get('TupleFactoryToken'); // [Example1, Example2] 튜플 객체
```
&nbsp;

> ✅ `token`을 `export`하여 다른 파일에서 `injector`를 이용하여 의존성을 주입받을 수 있습니다.

별도의 `token`을 생성하고 싶다면 `InjectionToken` 인터페이스에 맞게 구현하여 등록할 수 있습니다.
```typescript
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
```
&nbsp;

[Angular]: https://angular.dev
[Javascript]: https://developer.mozilla.org/ko/docs/Web/JavaScript
[Typescript]: https://www.typescriptlang.org