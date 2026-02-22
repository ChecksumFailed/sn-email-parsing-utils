import { vi } from 'vitest';

const { mockGs, MockGSLog } = vi.hoisted(() => {
    return {
        mockGs: {
            nil: (val: any) => val === undefined || val === null || val === '',
            error: vi.fn(),
        },
        MockGSLog: class {
            setLevel = vi.fn();
            logDebug = vi.fn();
            logError = vi.fn();
        }
    };
});

// Mock the module globally for all tests
vi.mock('@servicenow/glide', () => ({
    gs: mockGs
}));

// Stub the global GSLog
vi.stubGlobal('global', {
    ...global,
    GSLog: MockGSLog,
});
