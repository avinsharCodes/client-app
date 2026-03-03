import { describe, it, expect } from 'vitest';
import { generatePKCEPair, base64urlEncode } from './pkce';

describe('pkce utility', () => {
    it('generatePKCEPair returns a verifier and challenge', async () => {
        const { verifier, challenge } = await generatePKCEPair();
        expect(verifier).toBeTypeOf('string');
        expect(challenge).toBeTypeOf('string');
        expect(verifier.length).toBeGreaterThanOrEqual(43);
    });

    it('generatePKCEPair does not return the same verifier twice', async () => {
        const pair1 = await generatePKCEPair();
        const pair2 = await generatePKCEPair();
        expect(pair1.verifier).not.toBe(pair2.verifier);
    });

    it('base64urlEncode encodes correctly without padding', () => {
        const buffer = new Uint8Array([1, 2, 3, 255, 254]);
        const encoded = base64urlEncode(buffer);
        expect(encoded).not.toContain('=');
        expect(encoded).not.toContain('+');
        expect(encoded).not.toContain('/');
    });
});
