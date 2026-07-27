import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from './search-bar';

describe('SearchBar', () => {
  it('renderiza com o placeholder informado', () => {
    render(<SearchBar value="" onChange={() => {}} placeholder="Buscar posts..." />);
    expect(screen.getByPlaceholderText('Buscar posts...')).toBeInTheDocument();
  });

  it('exibe o valor controlado', () => {
    render(<SearchBar value="autismo" onChange={() => {}} />);
    expect(screen.getByDisplayValue('autismo')).toBeInTheDocument();
  });

  it('chama onChange ao digitar', () => {
    const onChange = vi.fn();
    render(<SearchBar value="" onChange={onChange} />);

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'autismo' } });

    expect(onChange).toHaveBeenCalledWith('autismo');
  });
});
