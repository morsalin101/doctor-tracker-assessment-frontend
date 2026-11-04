import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Pagination } from './pagination';

describe('Pagination', () => {
  it('reports totals and advances pages', () => {
    const onPage = vi.fn(); const onPrefetch = vi.fn();
    render(<Pagination page={1} pages={3} total={24} onPage={onPage} onPrefetch={onPrefetch} />);
    expect(screen.getByText('24 records · Page 1 of 3')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /first page/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Page 1' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Page 2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /last page/i })).toBeEnabled();
    expect(onPrefetch).toHaveBeenCalledWith(2);
    expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(onPage).toHaveBeenCalledWith(2);
  });
});
