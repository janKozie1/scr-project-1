import { useState, useRef, useEffect, useMemo } from 'react';

import liuAlg, { getSolutionSummary, intialLiuAlg, solve as solveLiu } from './alg/liu';

import { expandTask, generateRandomTasks, isTaskDone } from "./services/tasks";
import { ExpandedTasks  } from './services/types';
import { add, last } from './services/utils';

import TaskGrid from './components/TaskGrid';
import StylesProvider from './components/StylesProvider';
import Box from './components/Box';
import Columns from './components/Columns';
import TasksTable from './components/TasksTable';
import Rows from './components/Rows';
import RowFade from './components/RowFade';
import Button from './components/Button';
import Modal from './components/Modal';
import ConfigurationForm, { Configuration } from './components/ConfigurationForm';
import AppContainer from './components/AppContainer';
import SolutionSummary from './components/SolutionSummary';

const expandedTasksToTaskState = (expandedTasks: ExpandedTasks): TasksState => ({
  base: expandedTasks,
  steps: [intialLiuAlg(expandedTasks)]
})

const generateTasks = (...args: Parameters<typeof generateRandomTasks>): TasksState => {
  return expandedTasksToTaskState(generateRandomTasks(...args).map(expandTask));
}

type TasksState = Readonly<{
  base: ExpandedTasks;
  steps: ExpandedTasks[];
}>

const App = () => {
  const [configuring, setConfiguring] = useState(false);
  const [config, setConfig] = useState<Configuration>({
    amount: 3,
    availability: { min: 0, max: 3},
    completion: { min: 2, max: 4},
    deadline: { min: 3, max: 5},
  });

  const [tasks, setTasks] = useState<TasksState>(() => generateTasks(config.amount, config));
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevTasks = useRef<typeof tasks['steps']>([]);
  const solutionSummary = useMemo(() => getSolutionSummary(tasks.base), [tasks.base]) ;

  const randomize = () => setTasks(generateTasks(config.amount, config));

  const startConfiguring = () => setConfiguring(true);
  const stopConfiguring = () => setConfiguring(false);

  const tickToEnd = () => setCurrentIndex(tasks.steps.length - 1);
  const tickToStart = () => setCurrentIndex(0);
  const tickForward = () => {
    if (tasks.steps.length - 1 === currentIndex) {
      if (last(tasks.steps).every(isTaskDone)) {
        return;
      }
      setTasks((state) => ({...state, steps: [...state.steps, liuAlg(last((tasks.steps)))]}))
    } else {
      setCurrentIndex(add(1))
    }
  }

  const tickBack = () => {
    if (currentIndex === 0) {
      return;
    }

    setCurrentIndex(add(-1))
  }

  const solve = () => setTasks((state) => ({
    ...state,
    steps: solveLiu(state.steps),
  }));

  const onConfigUpdate = (newConfig: Configuration) => {
    setTasks(generateTasks(newConfig.amount, newConfig));
    setConfig(newConfig)
    setConfiguring(false)
  }

  useEffect(() => {
    if (tasks.steps.length !== prevTasks.current.length) {
      setCurrentIndex(tasks.steps.length - 1);
    }
  }, [tasks])

  useEffect(() => {
    prevTasks.current = tasks.steps;
  }, [tasks]);

  return (
    <StylesProvider>
      {configuring && (
        <Modal title={"Configure"} onClose={stopConfiguring}>
          <ConfigurationForm
            onSubmit={onConfigUpdate}
            configuration={config}
          />
        </Modal>
      )}
      <AppContainer>
        <Rows gap={10} center>
          <Rows gap={12} center>
            <Rows gap={4} center>
              <h3>Tasks table:</h3>
              <Columns gap={8}>
                <Button onClick={startConfiguring}>{'Configure'}</Button>
                <Button onClick={randomize}>{'Randomize'}</Button>
                <Button onClick={solve}>{'Solve'}</Button>
              </Columns>
              <TasksTable tasks={tasks.base} />
            </Rows>
            <Rows gap={4} center hideOverflow>
              <h3>Tasks timeline:</h3>
              <Box fullWidth hideOverflow>
                <Box fullWidth justifyContent="center">
                  <Rows gap={3} center>
                    <Columns gap={8} center>
                      <Button onClick={tickToStart}>{'<<'}</Button>
                      <Button onClick={tickBack}>{'<'}</Button>
                      <Button onClick={tickForward}>{'>'}</Button>
                      <Button onClick={tickToEnd}>{'>>'}</Button>
                    </Columns>
                  </Rows>
                </Box>
                <RowFade>
                  <Box mt={10} fullWidth>
                    <TaskGrid tasksPerSecond={tasks.steps} currentIndex={currentIndex} />
                  </Box>
                </RowFade>
              </Box>
            </Rows>
            <Rows gap={4} center>
              <h3>Solution summary</h3>
              <SolutionSummary summary={solutionSummary}/>
            </Rows>
          </Rows>
        </Rows>
      </AppContainer>
    </StylesProvider>
  )
}

export default App;


// const data= JSON.parse('[{"id":"0.dz0y5qpxg5","timeUntil":{"availability":3,"completion":8,"deadline":12},"active":false,"name":"Task 0","color":"#513DB6"},{"id":"0.689g53vg98k","timeUntil":{"availability":2,"completion":7,"deadline":10},"active":false,"name":"Task 1","color":"#349B9B"},{"id":"0.ph3ykk173d","timeUntil":{"availability":3,"completion":7,"deadline":11},"active":false,"name":"Task 2","color":"#CF2670"}]')


// console.log(tasks[tasks.length - 1].map(task => (
//   `${task.name}: aval: ${task.timeUntil.availability}, dead ${task.timeUntil.deadline}, compl ${task.timeUntil.completion}`
// )).join('\n'))
