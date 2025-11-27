import { describe, it, expect } from 'vitest';
import { getDate } from '../src/js/common.js';

describe('getDate', () => {
    it('올바른 형식으로 날짜를 포맷해야 함', () => {
        const testDate = new Date('2024-01-15T14:30:00');
        const result = getDate(testDate);
        expect(result).toBe('2024.01.15 14:30');
    });

    it('한 자리 월과 일을 두 자리로 패딩해야 함', () => {
        const testDate = new Date('2024-03-05T09:05:00');
        const result = getDate(testDate);
        expect(result).toBe('2024.03.05 09:05');
    });

    it('자정 시간을 올바르게 처리해야 함', () => {
        const testDate = new Date('2024-12-31T00:00:00');
        const result = getDate(testDate);
        expect(result).toBe('2024.12.31 00:00');
    });

    it('문자열 날짜를 입력받아도 처리해야 함', () => {
        const result = getDate('2024-06-20T18:45:00');
        expect(result).toBe('2024.06.20 18:45');
    });
});