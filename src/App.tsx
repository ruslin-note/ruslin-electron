import viteLogo from '/vite.svg';
import solidLogo from '/solidjs.svg';
import typescriptLogo from './typescript.svg';
import { Counter } from './components/Counter';
import { ListItem } from './components';

export const App = () => {
  return (
    <div>
      <div>
        <ListItem></ListItem>
        <ListItem></ListItem>
        <ListItem></ListItem>
      </div>
      {/* <Counter /> */}
    </div>
  );
};
