import { expect, test, vi } from 'vitest';

import { StoredInjector } from '@injector/injector';
import { isClass } from '@util/util';

class Example1 {

    example1(): string {
        return 'example1 called';
    }

}

class Example2 {

    example2(): string {
        return 'example2 called';
    }

}

const injectionIdentityParserMock = {
    parse: vi.fn().mockImplementation(function(target, options) {
        return options?.name ?? target?.name ?? target;
    }),
    supports: vi.fn().mockImplementation(function(object) {
        return isClass(object) || typeof object === 'string';
    })
};
const injector = new StoredInjector();

injector.registerParser(injectionIdentityParserMock);

test('의존성 생성 테스트', function() {
    expect(function() {
        return injector.create(Example1);
    }).not.toThrowError();
    expect(function() {
        return injector.create(Example2, { name: 'MyExample2' });
    }).not.toThrowError();
    expect(function() {
        return injector.create(Array)
    }).toThrowError();
});

test('의존성 불러오기 테스트', function() {
    expect(function() {
        return injector.get(Example1);
    }).not.toThrowError();
    expect(function() {
        return injector.get('Example1')
    }).not.toThrowError();
    expect(injector.get(Example1)).instanceOf(Example1);
    expect(injector.get('Example1')).instanceOf(Example1);
    expect(function() {
        return injector.get(Example2)
    }).toThrowError();
    expect(function() {
        return injector.get('MyExample2')
    }).not.toThrowError();
    expect(injector.get('MyExample2')).instanceOf(Example2);
});