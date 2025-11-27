import { describe, it, expect } from 'vitest';
import { validateEmail, validatePassword, validateNickname } from './validators.js';

describe('validateEmail', () => {
    it('유효한 이메일 주소를 true로 반환해야 함', () => {
        expect(validateEmail('test@example.com')).toBe(true);
        expect(validateEmail('user.name@domain.co.kr')).toBe(true);
        expect(validateEmail('user+tag@example.org')).toBe(true);
    });

    it('유효하지 않은 이메일 주소를 false로 반환해야 함', () => {
        expect(validateEmail('invalid-email')).toBe(false);
        expect(validateEmail('missing@domain')).toBe(false);
        expect(validateEmail('@example.com')).toBe(false);
        expect(validateEmail('user@')).toBe(false);
        expect(validateEmail('user @example.com')).toBe(false);
    });

    it('빈 문자열은 false를 반환해야 함', () => {
        expect(validateEmail('')).toBe(false);
    });
});

describe('validatePassword', () => {
    it('유효한 비밀번호를 true로 반환해야 함', () => {
        expect(validatePassword('Abc123!@#')).toBe(true);
        expect(validatePassword('Password1!')).toBe(true);
        expect(validatePassword('Test1234@')).toBe(true);
    });

    it('8자 미만의 비밀번호는 false를 반환해야 함', () => {
        expect(validatePassword('Abc12!')).toBe(false);
    });

    it('영문이 없는 비밀번호는 false를 반환해야 함', () => {
        expect(validatePassword('12345678!')).toBe(false);
    });

    it('숫자가 없는 비밀번호는 false를 반환해야 함', () => {
        expect(validatePassword('Abcdefgh!')).toBe(false);
    });

    it('특수문자가 없는 비밀번호는 false를 반환해야 함', () => {
        expect(validatePassword('Abcd1234')).toBe(false);
    });

    it('빈 문자열은 false를 반환해야 함', () => {
        expect(validatePassword('')).toBe(false);
    });
});

describe('validateNickname', () => {
    it('2자 이상의 닉네임은 true를 반환해야 함', () => {
        expect(validateNickname('홍길동')).toBe(true);
        expect(validateNickname('김철수')).toBe(true);
        expect(validateNickname('AB')).toBe(true);
        expect(validateNickname('테스트닉네임')).toBe(true);
    });

    it('2자 미만의 닉네임은 false를 반환해야 함', () => {
        expect(validateNickname('A')).toBe(false);
        expect(validateNickname('김')).toBe(false);
    });

    it('빈 문자열은 false를 반환해야 함', () => {
        expect(validateNickname('')).toBe(false);
    });

    it('공백만 있는 문자열은 false를 반환해야 함', () => {
        expect(validateNickname('  ')).toBe(false);
        expect(validateNickname(' ')).toBe(false);
    });

    it('앞뒤 공백을 제거한 후 검증해야 함', () => {
        expect(validateNickname('  홍길동  ')).toBe(true);
        expect(validateNickname(' AB ')).toBe(true);
    });
});