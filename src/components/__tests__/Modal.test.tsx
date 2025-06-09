import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from '../Modal';

describe('Modal', () => {
  it('renders modal with title and content', () => {
    render(
      <Modal 
        isOpen={true}
        onClose={() => {}}
        title="Test Modal"
      >
        <p>Modal content</p>
      </Modal>
    );
    
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(
      <Modal 
        isOpen={false}
        onClose={() => {}}
        title="Test Modal"
      >
        <p>Modal content</p>
      </Modal>
    );
    
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = jest.fn();
    render(
      <Modal 
        isOpen={true}
        onClose={onClose}
        title="Test Modal"
      >
        <p>Modal content</p>
      </Modal>
    );
    
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when clicking outside modal', () => {
    const onClose = jest.fn();
    render(
      <Modal 
        isOpen={true}
        onClose={onClose}
        title="Test Modal"
      >
        <p>Modal content</p>
      </Modal>
    );
    
    fireEvent.click(screen.getByTestId('modal-overlay'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not close when clicking inside modal content', () => {
    const onClose = jest.fn();
    render(
      <Modal 
        isOpen={true}
        onClose={onClose}
        title="Test Modal"
      >
        <p>Modal content</p>
      </Modal>
    );
    
    fireEvent.click(screen.getByTestId('modal-content'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('applies custom className to container', () => {
    const customClass = 'custom-modal';
    render(
      <Modal 
        isOpen={true}
        onClose={() => {}}
        title="Test Modal"
        className={customClass}
      >
        <p>Modal content</p>
      </Modal>
    );
    
    expect(screen.getByTestId('modal-content')).toHaveClass(customClass);
  });

  it('renders footer content when provided', () => {
    render(
      <Modal 
        isOpen={true}
        onClose={() => {}}
        title="Test Modal"
        footer={<button>Save</button>}
      >
        <p>Modal content</p>
      </Modal>
    );
    
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('renders without close button when closeable is false', () => {
    render(
      <Modal 
        isOpen={true}
        onClose={() => {}}
        title="Test Modal"
        closeable={false}
      >
        <p>Modal content</p>
      </Modal>
    );
    
    expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument();
  });
}); 