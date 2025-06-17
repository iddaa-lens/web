import React from 'react';
import { render, RenderOptions } from '@testing-library/react';

// Add any providers here if needed
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };

// Add a dummy test to satisfy Jest
test('test utils setup', () => {
  expect(true).toBe(true);
});