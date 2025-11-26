import type { Constructor } from '@util/util';

/**
 * 의존 주입 감지 인터페이스
 *
 * @template {Constructor} T 생성자 유형
 * @author Mux
 * @version 1.0.0
 */
interface InjectListener<T extends Constructor> {

    /**
     * 의존성 주입을 감지합니다.
     *
     * @param {InjectListenerCallback<T>} callback 의존성 주입 콜백
     * @returns {void}
     */
    onInject(callback: InjectListenerCallback<T>): void;

}

/**
 * 의존성 주입 콜백 유형
 *
 * @template {Constructor} T 생성자 유형
 * @author Mux
 * @version 1.0.0
 */
type InjectListenerCallback<T extends Constructor> = (object: InstanceType<T>) => void;

export type {
    InjectListener,
    InjectListenerCallback
};