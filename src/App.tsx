import { useMemo, useState } from 'react';
import TaskGrid from './components/TaskGrid';

import liuAlg from './alg/liu';
import { generateRandomTasks, makeTickable } from "./services/tasks";
import { Tasks } from './services/types';
import { append } from './services/utils';
import StylesProvider from './components/StylesProvider';
import Box from './components/Box';

const App = () => {
  const [tasks, setTasks] = useState<Tasks[]>([generateRandomTasks(3, {
    availability: { min: 0, max: 10},
    completion: { min: 0, max: 10},
    deadline: { min: 1, max: 5},
  })]);

  const tickable = useMemo(() => makeTickable(liuAlg, tasks[0]), []);

  const tick = () => {
    const nextStep = tickable();
    setTasks(append(nextStep));
  }

  return (
    <StylesProvider>
      <Box mt={8} ml={8}>
        <Box mb={8}>
          <button onClick={tick}>Move one second</button>
        </Box>
        <TaskGrid tasksPerSecond={tasks}/>
      </Box>
    </StylesProvider>
  )
}

export default App;
