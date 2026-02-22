import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ParsingUtils } from '../../../src/server/modules/ParsingUtils';

describe('ParsingUtils', () => {
    let utils: ParsingUtils;

    beforeEach(() => {
        vi.clearAllMocks();
        utils = new ParsingUtils(true);
    });

    describe('htmlToStr', () => {
        it('should strip simple HTML tags', () => {
            const input = '<p>Hello <b>World</b></p>';
            expect(utils.htmlToStr(input)).toBe('Hello World');
        });

        it('should replace <br> with newlines', () => {
            const input = 'Line 1<br>Line 2<br/>Line 3';
            expect(utils.htmlToStr(input)).toBe('Line 1\nLine 2\nLine 3');
        });

        it('should handle complex tags and decode URI components', () => {
            const input = '<div>Data%3A%20123</div>';
            expect(utils.htmlToStr(input)).toBe('Data: 123');
        });

        it('should add newlines after closing block tags', () => {
            const input = '<div>Line 1</div><div>Line 2</div>';
            const result = utils.htmlToStr(input);
            expect(result).toContain('Line 1\n');
            expect(result).toContain('Line 2');
        });

        it('should throw error for non-string input', () => {
            expect(() => utils.htmlToStr(null as any)).toThrow();
        });
    });

    describe('isHTML', () => {
        it('should return true for strings with HTML tags', () => {
            expect(utils.isHTML('<div class="test">content</div>')).toBe(true);
            expect(utils.isHTML('Hello <br/>')).toBe(true);
        });

        it('should return false for plain text', () => {
            expect(utils.isHTML('Just plain text')).toBe(false);
            expect(utils.isHTML('Key: Value')).toBe(false);
        });
    });

    describe('parseEmailBody', () => {
        it('should parse simple key-value pairs', () => {
            const input = 'Name: John Doe\nEmail: john@example.com';
            const result = utils.parseEmailBody(input);
            expect(result).toEqual({
                Name: 'John Doe',
                Email: 'john@example.com'
            });
        });

        it('should only split on the first colon', () => {
            const input = 'Description: Problem with: the server\nPriority: High';
            const result = utils.parseEmailBody(input);
            expect(result).toEqual({
                Description: 'Problem with: the server',
                Priority: 'High'
            });
        });

        it('should handle HTML bodies by cleaning them first', () => {
            const input = '<div><b>Priority</b>: Critical</div>';
            const result = utils.parseEmailBody(input);
            expect(result).toEqual({
                Priority: 'Critical'
            });
        });

        it('should ignore lines without a colon or empty keys', () => {
            const input = 'NoColonLine\n:EmptyKey\nValidKey: ValidValue';
            const result = utils.parseEmailBody(input);
            expect(result).toEqual({
                ValidKey: 'ValidValue'
            });
        });

        it('should handle property names like "toString" safely', () => {
            const input = 'toString: malicious\nName: Bob';
            const result = utils.parseEmailBody(input);
            expect(result.Name).toBe('Bob');
            expect(result.toString).toBe('malicious');
        });
    });
});
