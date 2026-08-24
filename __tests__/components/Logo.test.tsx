import React from 'react';
import { render, screen } from '@testing-library/react';
import { Logo } from '@/components/Logo';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt} />;
  },
}));

describe('Logo Component', () => {
  it('renders correctly as link with default size', () => {
    render(<Logo />);
    
    const linkElement = screen.getByRole('link', { name: /Nature's Mud/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', '/');
  });

  it('renders correctly without link when asLink is false', () => {
    render(<Logo asLink={false} />);
    
    const linkElement = screen.queryByRole('link', { name: /Nature's Mud/i });
    expect(linkElement).toBeNull();

    const imgElement = screen.getByAltText(/Naturesmud/i);
    expect(imgElement).toBeInTheDocument();
  });

  it('applies the correct dimensions for sizes', () => {
    const { rerender } = render(<Logo size="sm" asLink={false} />);
    let imgElement = screen.getByAltText(/Naturesmud/i);
    expect(imgElement).toHaveAttribute('width', '140');

    rerender(<Logo size="lg" asLink={false} />);
    imgElement = screen.getByAltText(/Naturesmud/i);
    expect(imgElement).toHaveAttribute('width', '220');
  });
});
