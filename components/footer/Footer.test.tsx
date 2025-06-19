import React from 'react';
import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';

describe('Footer', () => {
  it('renders company name and description', () => {
    render(<Footer />);
    
    expect(screen.getByText('IddaaLens')).toBeInTheDocument();
    expect(screen.getByText(/Türkiye'nin en güvenilir bahis analiz platformu/)).toBeInTheDocument();
  });

  it('renders all social media links', () => {
    render(<Footer />);
    
    expect(screen.getByLabelText('Facebook')).toBeInTheDocument();
    expect(screen.getByLabelText('Twitter')).toBeInTheDocument();
    expect(screen.getByLabelText('Instagram')).toBeInTheDocument();
    expect(screen.getByLabelText('LinkedIn')).toBeInTheDocument();
  });

  it('renders quick links section', () => {
    render(<Footer />);
    
    expect(screen.getByText('Hızlı Linkler')).toBeInTheDocument();
    expect(screen.getByText('Maçlar')).toBeInTheDocument();
    expect(screen.getByText('AI Tahminleri')).toBeInTheDocument();
    expect(screen.getByText('Hakkımızda')).toBeInTheDocument();
    expect(screen.getByText('Gizlilik Politikası')).toBeInTheDocument();
    expect(screen.getByText('Kullanım Koşulları')).toBeInTheDocument();
  });

  it('renders contact information', () => {
    render(<Footer />);
    
    expect(screen.getByText('İletişim')).toBeInTheDocument();
    expect(screen.getByText('info@iddaalens.com')).toBeInTheDocument();
    expect(screen.getByText('+90 212 345 67 89')).toBeInTheDocument();
    expect(screen.getByText('İstanbul, Türkiye')).toBeInTheDocument();
  });

  it('renders newsletter section', () => {
    render(<Footer />);
    
    expect(screen.getByText('Bülten')).toBeInTheDocument();
    expect(screen.getByText(/En güncel tahminler ve analizler/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('E-posta adresiniz')).toBeInTheDocument();
    expect(screen.getByText('Abone Ol')).toBeInTheDocument();
  });

  it('renders AES Tech link in bottom bar', () => {
    render(<Footer />);
    
    expect(screen.getByText('Powered by')).toBeInTheDocument();
    const aesLink = screen.getByText('AES Tech');
    expect(aesLink).toBeInTheDocument();
    expect(aesLink.closest('a')).toHaveAttribute('href', 'https://aestech.com');
    expect(aesLink.closest('a')).toHaveAttribute('target', '_blank');
  });

  it('renders current year in copyright', () => {
    render(<Footer />);
    
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(`© ${currentYear} IddaaLens. Tüm hakları saklıdır.`)).toBeInTheDocument();
  });

  it('has proper email and phone links', () => {
    render(<Footer />);
    
    const emailLink = screen.getByText('info@iddaalens.com').closest('a');
    expect(emailLink).toHaveAttribute('href', 'mailto:info@iddaalens.com');
    
    const phoneLink = screen.getByText('+90 212 345 67 89').closest('a');
    expect(phoneLink).toHaveAttribute('href', 'tel:+902123456789');
  });

  it('applies responsive classes', () => {
    const { container } = render(<Footer />);
    
    // Check grid responsive classes
    const grid = container.querySelector('.grid');
    expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4');
    
    // Check bottom bar responsive classes
    const bottomBar = container.querySelector('.flex-col.sm\\:flex-row');
    expect(bottomBar).toBeInTheDocument();
  });
});