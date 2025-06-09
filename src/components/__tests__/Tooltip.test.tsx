import { render, screen, fireEvent } from '@testing-library/react';
import { Tooltip } from '../Tooltip';

describe('Tooltip', () => {
  it('renders children', () => {
    render(
      <Tooltip content="Tooltip content">
        <button>Hover me</button>
      </Tooltip>
    );
    
    expect(screen.getByText('Hover me')).toBeInTheDocument();
  });

  it('shows tooltip on hover', () => {
    render(
      <Tooltip content="Tooltip content">
        <button>Hover me</button>
      </Tooltip>
    );
    
    fireEvent.mouseEnter(screen.getByText('Hover me'));
    expect(screen.getByText('Tooltip content')).toBeInTheDocument();
  });

  it('hides tooltip on mouse leave', () => {
    render(
      <Tooltip content="Tooltip content">
        <button>Hover me</button>
      </Tooltip>
    );
    
    const trigger = screen.getByText('Hover me');
    fireEvent.mouseEnter(trigger);
    expect(screen.getByText('Tooltip content')).toBeInTheDocument();
    
    fireEvent.mouseLeave(trigger);
    expect(screen.queryByText('Tooltip content')).not.toBeInTheDocument();
  });

  it('applies position classes', () => {
    const { rerender } = render(
      <Tooltip content="Tooltip content" position="top">
        <button>Hover me</button>
      </Tooltip>
    );
    
    fireEvent.mouseEnter(screen.getByText('Hover me'));
    expect(screen.getByRole('tooltip')).toHaveClass('bottom-full');
    
    rerender(
      <Tooltip content="Tooltip content" position="bottom">
        <button>Hover me</button>
      </Tooltip>
    );
    
    fireEvent.mouseEnter(screen.getByText('Hover me'));
    expect(screen.getByRole('tooltip')).toHaveClass('top-full');
    
    rerender(
      <Tooltip content="Tooltip content" position="left">
        <button>Hover me</button>
      </Tooltip>
    );
    
    fireEvent.mouseEnter(screen.getByText('Hover me'));
    expect(screen.getByRole('tooltip')).toHaveClass('right-full');
    
    rerender(
      <Tooltip content="Tooltip content" position="right">
        <button>Hover me</button>
      </Tooltip>
    );
    
    fireEvent.mouseEnter(screen.getByText('Hover me'));
    expect(screen.getByRole('tooltip')).toHaveClass('left-full');
  });

  it('applies custom className to tooltip', () => {
    const customClass = 'custom-tooltip';
    render(
      <Tooltip 
        content="Tooltip content"
        className={customClass}
      >
        <button>Hover me</button>
      </Tooltip>
    );
    
    fireEvent.mouseEnter(screen.getByText('Hover me'));
    expect(screen.getByRole('tooltip')).toHaveClass(customClass);
  });

  it('renders with custom trigger', () => {
    const CustomTrigger = () => <div data-testid="custom-trigger">Custom</div>;
    render(
      <Tooltip 
        content="Tooltip content"
        trigger={<CustomTrigger />}
      >
        <button>Hover me</button>
      </Tooltip>
    );
    
    expect(screen.getByTestId('custom-trigger')).toBeInTheDocument();
  });

  it('applies delay before showing tooltip', () => {
    jest.useFakeTimers();
    
    render(
      <Tooltip 
        content="Tooltip content"
        delay={1000}
      >
        <button>Hover me</button>
      </Tooltip>
    );
    
    fireEvent.mouseEnter(screen.getByText('Hover me'));
    expect(screen.queryByText('Tooltip content')).not.toBeInTheDocument();
    
    jest.advanceTimersByTime(1000);
    expect(screen.getByText('Tooltip content')).toBeInTheDocument();
    
    jest.useRealTimers();
  });
}); 