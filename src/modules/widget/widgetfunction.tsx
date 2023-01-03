import { ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import { TestIngWidget } from './Form';

export function TicketCreationForm({ id }): void {
  const open = false;
  const reactEle = ReactDOM.createRoot(
    document.getElementById(id) as HTMLElement
  );
  reactEle.render(<TestIngWidget />);
}
window.TicketCreationForm = TicketCreationForm;
