import { beforeEach, expect, expectTypeOf, test, vi } from 'vitest';

import {
    ArrayInjectionToken,
    ClassInjectionToken,
    DependClassInjectionToken,
    FactoryInjectionToken,
    TupleFactoryInjectionToken
 } from '@injection/token';
import type { Injector } from '@injector/injector';

class Example1 {

    example1(): string {
        return 'example1';
    }

}

class Example2 {

    example2(): string {
        return 'example2';
    }

}

class Example3 {

    #example1: Example1;

    #example2: Example2;

    constructor(example1: Example1, example2: Example2) {
        this.#example1 = example1;
        this.#example2 = example2;
    }

    example3(): string {
        return this.#example1.example1() + '/' + this.#example2.example2();
    }

}

class Example4 {

    #example1: Example1;

    #example2: Example2;

    constructor(example1: Example1, example2: Example2) {
        this.#example1 = example1;
        this.#example2 = example2;
    }

    example4(): string {
        return this.#example2.example2() + '/' + this.#example1.example1();
    }

}

let injectorMock: Injector;

beforeEach(function() {
    injectorMock = {
        create: vi.fn(),
        get: vi.fn()
            .mockReturnValueOnce(new Example1)
            .mockReturnValueOnce(new Example2)
    };
});

test('클래스 배열 의존성 토큰 테스트', function() {
    const token = new ArrayInjectionToken('ARRAY_EXAMPLE_TOKEN', [Example1, Example2]);

    expect(token.identity).toBe('ARRAY_EXAMPLE_TOKEN');

    const provide = token.provide(injectorMock);

    expectTypeOf(provide).toEqualTypeOf<[Example1, Example2]>();
    expect(provide.length).toBe(2);
    expect(provide[0].example1()).toBe('example1');
    expect(provide[1].example2()).toBe('example2');
});

test('클래스 의존성 토큰 테스트', function() {
    const token = new ClassInjectionToken('CLASS_EXAMPLE_TOKEN', Example1);

    expect(token.identity).toBe('CLASS_EXAMPLE_TOKEN');

    const provide = token.provide(injectorMock);

    expectTypeOf(provide).toEqualTypeOf<Example1>();
    expect(provide.example1()).toBe('example1');
});

test('하위 의존성이 포함된 클래스 의존성 토큰 테스트', function() {
    const token = new DependClassInjectionToken('DEPEND_EXAMPLE_TOKEN', Example3, [Example1, Example2]);

    expect(token.identity).toBe('DEPEND_EXAMPLE_TOKEN');

    const provide = token.provide(injectorMock);

    expectTypeOf(provide).toEqualTypeOf<Example3>();
    expect(provide.example3()).toBe('example1/example2');
});

test('클래스 팩토리 의존성 토큰 테스트', function() {
    const token = new FactoryInjectionToken('FACTORY_EXAMPLE_TOKEN', function(injector) {
        const example1 = injector.get(Example1);
        const example2 = injector.get(Example2);

        return new Example3(example1, example2);
    });

    expect(token.identity).toBe('FACTORY_EXAMPLE_TOKEN');

    const provide = token.provide(injectorMock);

    expectTypeOf(provide).toEqualTypeOf<Example3>();
    expect(provide.example3()).toBe('example1/example2');
});

test('클래스 튜플 팩토리 의존성 토큰 테스트', function() {
    const token = new TupleFactoryInjectionToken('TUPLE_EXAMPLE_TOKEN', function(injector) {
        const example1 = injector.get(Example1);
        const example2 = injector.get(Example2);

        return [
            new Example3(example1, example2),
            new Example4(example1, example2)
        ];
    });

    expect(token.identity).toBe('TUPLE_EXAMPLE_TOKEN');

    const provide = token.provide(injectorMock);

    expectTypeOf(provide).toEqualTypeOf<[Example3, Example4]>();
    expect(provide.length).toBe(2);
    expect(provide[0].example3()).toBe('example1/example2');
    expect(provide[1].example4()).toBe('example2/example1');
});