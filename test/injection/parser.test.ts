import { expect, test, vi } from 'vitest';

import {
    ClassInjectionIdentityParser,
    InjectionTokenIdetntiyParser,
    NamedInjectionIdentityParser
} from '@injection/parser';
import type { InjectionToken } from '@injection/token';

class Example {}

test('클래스 개체의 의존성 고유값 추출 테스트', function() {
    const parser = new ClassInjectionIdentityParser();
    
    expect(parser.supports(Example)).toBeTruthy();
    expect(parser.supports(String)).toBeFalsy();
    expect(parser.supports(Array)).toBeFalsy();
    expect(parser.parse(Example)).toBe('Example');
});

test('의존성 토큰 개체의 고유값 추출 테스트', function() {
    const parser = new InjectionTokenIdetntiyParser();
    const injectionTokenMock: InjectionToken<unknown> = {
        get identity() {
            return 'TEST_TOKEN'
        },
        provide: vi.fn(),
    };

    expect(parser.supports(injectionTokenMock)).toBeTruthy();
    expect(parser.parse(injectionTokenMock)).toBe('TEST_TOKEN');
});

test('문자열 개체의 고유값 추출 테스트', function() {
    const parser = new NamedInjectionIdentityParser();

    expect(parser.supports('TEST_IDENTITY')).toBeTruthy();
    expect(parser.parse('TEST_IDENTITY')).toBe('TEST_IDENTITY');
});