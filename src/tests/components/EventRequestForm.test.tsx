import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import EventRequestForm from '../../components/EventRequestForm';
import ChakraProvider from '../../components/ChakraProvider';
import axios from 'axios';

// Mock axios
vi.mock('axios');

// Mock reCAPTCHA
vi.mock('react-google-recaptcha', () => {
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    default: React.forwardRef(function MockRecaptcha(_props: unknown, ref: React.Ref<any>) {
      React.useImperativeHandle(ref, () => ({
        getValue: () => 'test-recaptcha-token',
        reset: () => {},
      }));
      return <div data-testid="mock-recaptcha" />;
    }),
  };
});

// Mock LeafletLocationMap since it uses dynamic import and browser APIs
vi.mock('next/dynamic', () => ({
  default: () => () => <div data-testid="mock-map" />,
}));

// Mock API environment variables
vi.mock('@/api', () => ({
  API_ENDPOINTS: {
    SUBMIT_EVENT: '/api/event-requests/submit',
  },
  RECAPTCHA_SITE_KEY: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI', // Google test site key
}));

const renderForm = (lang: 'fi' | 'en' = 'fi') => {
  return render(
    <ChakraProvider>
      <EventRequestForm lang={lang} />
    </ChakraProvider>
  );
};

describe('EventRequestForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly in Finnish', () => {
    renderForm('fi');
    expect(screen.getByText('Lisää tapahtuma')).toBeInTheDocument();
  });

  it('renders correctly in English', () => {
    renderForm('en');
    expect(screen.getByText('Add an event')).toBeInTheDocument();
  });

  it('opens dialog when "Add an event" button is clicked', () => {
    renderForm('en');
    const trigger = screen.getByText('Add an event');
    fireEvent.click(trigger);
    
    // The dialog title should be visible
    expect(screen.getByText(/Add an event/i, { selector: 'h2' })).toBeInTheDocument();
  });

  it('submits correctly with required fields', async () => {
    renderForm('en');
    fireEvent.click(screen.getByText('Add an event'));

    // Fill required fields
    fireEvent.change(screen.getByLabelText(/Event title/i, { selector: 'input' }), { target: { value: 'Test Event' } });
    fireEvent.change(screen.getByLabelText(/Event title \(English\)/i), { target: { value: 'Test Event EN' } });
    fireEvent.change(screen.getByLabelText(/Start date and time/i), { target: { value: '2026-04-01T12:00' } });
    fireEvent.change(screen.getByLabelText(/Event organizer/i), { target: { value: 'Test Organizer' } });

    // Mock successful response
    vi.mocked(axios.post).mockResolvedValueOnce({ data: { success: true } });

    // Click submit to open confirm popover
    const submitBtn = screen.getByRole('button', { name: /Submit request/i });
    fireEvent.click(submitBtn);

    // Wait for popover and click Confirm
    const confirmBtn = await screen.findByRole('button', { name: /Confirm/i });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        '/api/event-requests/submit',
        expect.objectContaining({
          organizer_name: 'Test Organizer',
          title: { fi: 'Test Event', en: 'Test Event EN' },
          recaptchaToken: 'test-recaptcha-token',
        })
      );
    });

    // Check success message
    expect(await screen.findByText(/Request submitted/i)).toBeInTheDocument();
  });

  it('shows error if submission fails', async () => {
    renderForm('en');
    fireEvent.click(screen.getByText('Add an event'));

    // Fill minimum required
    fireEvent.change(screen.getByLabelText(/Event title/i, { selector: 'input' }), { target: { value: 'Fail Event' } });
    fireEvent.change(screen.getByLabelText(/Event title \(English\)/i), { target: { value: 'Fail Event EN' } });
    fireEvent.change(screen.getByLabelText(/Start date and time/i), { target: { value: '2026-04-01T12:00' } });
    fireEvent.change(screen.getByLabelText(/Event organizer/i), { target: { value: 'Test Organizer' } });

    // Mock error response
    vi.mocked(axios.post).mockRejectedValueOnce(new Error('Network Error'));

    fireEvent.click(screen.getByRole('button', { name: /Submit request/i }));
    
    const confirmBtn = await screen.findByRole('button', { name: /Confirm/i });
    fireEvent.click(confirmBtn);

    await waitFor(async () => {
      const messages = await screen.findAllByText(/Submit failed/i);
      expect(messages.length).toBeGreaterThan(0);
    });
  });

  it('requires all mandatory fields', async () => {
    renderForm('en');
    fireEvent.click(screen.getByText('Add an event'));

    // Only fill organizer, leave others empty
    fireEvent.change(screen.getByLabelText(/Event organizer/i), { target: { value: 'Test Organizer' } });

    fireEvent.click(screen.getByRole('button', { name: /Submit request/i }));
    
    const confirmBtn = await screen.findByRole('button', { name: /Confirm/i });
    fireEvent.click(confirmBtn);

    // Should show the local error for missing start date
    await waitFor(async () => {
      const messages = await screen.findAllByText(/Submit failed/i);
      expect(messages.length).toBeGreaterThan(0);
    });
  });
});
