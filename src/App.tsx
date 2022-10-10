import { useMemo, useState } from 'react';
import TaskGrid from './components/TaskGrid';

import liuAlg from './alg/liu';
import { expandTask, generateRandomTasks } from "./services/tasks";
import { ExpandedTasks, Tasks } from './services/types';
import { append, first, last, pop } from './services/utils';
import StylesProvider from './components/StylesProvider';
import Box from './components/Box';
import Columns from './components/Columns';
import TasksTable from './components/TasksTable';
import Rows from './components/Rows';

const getInitialTasks = () => [liuAlg(generateRandomTasks(3, {
  availability: { min: 0, max: 4},
  completion: { min: 3, max: 6},
  deadline: { min: 3, max: 5},
}).map(expandTask))]

const App = () => {
  const [tasks, setTasks] = useState<ExpandedTasks[]>(getInitialTasks);

  console.log(tasks[tasks.length - 1].map(task => (
    `${task.name}: aval: ${task.timeUntil.availability}, dead ${task.timeUntil.deadline}, compl ${task.timeUntil.completion}`
  )).join('\n'))


  const tickForward = () => {
    setTasks(append(liuAlg(last((tasks)))));
  }

  const tickBack = () => {
    setTasks(pop);
  }

  return (
    <StylesProvider>
      <Box mt={6} ml={6}>
        <Rows gap={8}>
          <Rows gap={12}>
            <Rows gap={4}>
              <h3>Tasks table:</h3>
              <TasksTable tasks={first(tasks)} />
            </Rows>
            <Rows gap={4}>
              <h3>Tasks timeline:</h3>
              <Columns gap={8}>
                <button disabled={tasks.length === 1} onClick={tickBack}>Move one second back</button>
                <button onClick={tickForward}>Move one second forward</button>
              </Columns>
              <Box mt={5} ml={2} fullWidth>
                <TaskGrid tasksPerSecond={tasks}/>
              </Box>
            </Rows>
          </Rows>
        </Rows>

      </Box>
    </StylesProvider>
  )
}

export default App;
