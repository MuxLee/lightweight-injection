import type { CreateInjector } from '@injector/injector';

/**
 * 의존성 설정 함수 유형
 * 
 * @author Mux
 * @version 1.0.0
 */
type InjectorConfigFunction = (injector: CreateInjector) => void;

/**
 * 의존성을 설정합니다.
 * 
 * @param {InjectorConfigFunction} injectorConfigFunciton 의존성 설정 함수
 * @param {string} injectorConfigName 의존성 설정명
 * @returns {InjectorConfigFunction} 의존성 설정 함수
 */
function injectorConfig(injectorConfigFunciton: InjectorConfigFunction, injectorConfigName: string): InjectorConfigFunction {
    return new Proxy(injectorConfigFunciton, {
        apply(target, thisArgument, argumentArray) {
            Reflect.apply(target, thisArgument, argumentArray);
            process.stdout.write(`Initialize injection config ('${injectorConfigName}')\n`);
        },
        getPrototypeOf() {
            return injectorConfig;
        }
    });
}

export type {
    InjectorConfigFunction
};

export {
    injectorConfig
};