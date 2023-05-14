import { createSignal } from 'solid-js';
import './ListItem.scss';

export const ListItem = () => {
  const [select, setSelect] = createSignal(false);

  return (
    <a
      classList={{
        'list-item': true,
        'selected': select(),
      }}
      onClick={() => setSelect((s) => !s)}>
      ListItem
    </a>
  );
};
