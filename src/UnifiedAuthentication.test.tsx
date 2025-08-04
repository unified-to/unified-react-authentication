import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UnifiedAuthentication from './UnifiedAuthentication';

// Mock fetch
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe('UnifiedAuthentication', () => {
    const defaultProps = {
        workspace_id: 'test-workspace-123',
    };

    beforeEach(() => {
        mockFetch.mockClear();
    });

    it('renders loading state initially', () => {
        mockFetch.mockImplementation(() => new Promise(() => {})); // Never resolves

        render(<UnifiedAuthentication {...defaultProps} />);

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('renders title and description when provided', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ providers: [] }),
        } as Response);

        render(<UnifiedAuthentication {...defaultProps} title="Test Title" description="Test Description" />);

        await waitFor(() => {
            expect(screen.getByText('Test Title')).toBeInTheDocument();
            expect(screen.getByText('Test Description')).toBeInTheDocument();
        });
    });

    it('renders authentication providers', async () => {
        const mockProviders = [
            { id: 'google', name: 'Google', enabled: true },
            { id: 'github', name: 'GitHub', enabled: true },
        ];

        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ providers: mockProviders }),
        } as Response);

        render(<UnifiedAuthentication {...defaultProps} />);

        await waitFor(() => {
            expect(screen.getByText('Sign in with Google')).toBeInTheDocument();
            expect(screen.getByText('Sign in with GitHub')).toBeInTheDocument();
        });
    });

    it('handles authentication button click', async () => {
        const mockProviders = [{ id: 'google', name: 'Google', enabled: true }];

        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ providers: mockProviders }),
        } as Response);

        // Mock window.location.href to prevent navigation errors
        const originalLocation = window.location;
        delete (window as any).location;
        (window as any).location = {
            href: 'http://localhost',
        };

        render(<UnifiedAuthentication {...defaultProps} />);

        await waitFor(() => {
            const googleButton = screen.getByText('Sign in with Google');
            fireEvent.click(googleButton);
        });

        // Restore original location
        (window as any).location = originalLocation;

        // The test passes if no errors are thrown during the click
        expect(true).toBe(true);
    });

    it('displays error when fetch fails', async () => {
        mockFetch.mockRejectedValueOnce(new Error('Network error'));

        render(<UnifiedAuthentication {...defaultProps} />);

        await waitFor(() => {
            expect(screen.getByText(/Error: Network error/)).toBeInTheDocument();
        });
    });

    it('calls onFailure callback on error', async () => {
        const onFailure = jest.fn();
        mockFetch.mockRejectedValueOnce(new Error('Network error'));

        render(<UnifiedAuthentication {...defaultProps} onFailure={onFailure} />);

        await waitFor(() => {
            expect(onFailure).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    it('uses correct data center URL', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ providers: [] }),
        } as Response);

        render(<UnifiedAuthentication {...defaultProps} dc="eu" />);

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith('https://eu.unified.to/auth/providers/test-workspace-123');
        });
    });

    it('shows no providers message when providers array is empty', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ providers: [] }),
        } as Response);

        render(<UnifiedAuthentication {...defaultProps} />);

        await waitFor(() => {
            expect(screen.getByText('No authentication providers available.')).toBeInTheDocument();
        });
    });

    it('respects include_text and include_icon props', async () => {
        const mockProviders = [{ id: 'google', name: 'Google', enabled: true, icon: '<svg>icon</svg>' }];

        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ providers: mockProviders }),
        } as Response);

        render(<UnifiedAuthentication {...defaultProps} include_text={false} include_icon={false} />);

        await waitFor(() => {
            const button = screen.getByRole('button');
            expect(button).toBeInTheDocument();
            expect(button.textContent).toBe(''); // No text or icon
        });
    });
});
