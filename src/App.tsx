import { useState, useRef, useEffect } from 'react';
import TaskGrid from './components/TaskGrid';

import liuAlg from './alg/liu';
import { expandTask, generateRandomTasks, isTaskDone } from "./services/tasks";
import { ExpandedTasks, GenerateRandomTaskConfig, Tasks } from './services/types';
import { add, append, first, last } from './services/utils';
import StylesProvider from './components/StylesProvider';
import Box from './components/Box';
import Columns from './components/Columns';
import TasksTable from './components/TasksTable';
import Rows from './components/Rows';
import RowFade from './components/RowFade';
import Button from './components/Button';
import Modal from './components/Modal';
import ConfigurationForm, { Configuration } from './components/ConfigurationForm';


const App = () => {
  const [configuring, setConfiguring] = useState(false);
  const [config, setConfig] = useState<Configuration>({
    amount: 3,
    availability: { min: 1, max: 4},
    completion: { min: 1, max: 4},
    deadline: { min: 8, max: 13},
  });

  const [tasks, setTasks] = useState<ExpandedTasks[]>(() => [generateRandomTasks(config.amount, config).map(expandTask)]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const prevTasks = useRef<typeof tasks>([]);

  const setNewTasks = (tasks: Tasks[]) => setTasks(tasks.map(taskGroup => taskGroup.map(expandTask)))
  const randomize = () => setNewTasks([generateRandomTasks(config.amount, config)]);

  const startConfiguring = () => setConfiguring(true);
  const stopConfiguring = () => setConfiguring(false);

  const tickToEnd = () => setCurrentIndex(tasks.length - 1);
  const tickToStart = () => setCurrentIndex(0);
  const tickForward = () => {
    if (tasks.length - 1 === currentIndex) {
      if (last(tasks).every(isTaskDone)) {
        return;
      }
      setTasks(append(liuAlg(last((tasks)))))
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

  const solve = () => {
    const recurse = (tasks: ExpandedTasks[]): ExpandedTasks[] => {
      const prevStep = last(tasks);

      if (prevStep.every(isTaskDone)) {
        return tasks;
      }

      return recurse(append(liuAlg(prevStep))(tasks));
    }

    setTasks(recurse);
  }

  const onConfigUpdate = (newConfig: Configuration) => {
    setNewTasks([generateRandomTasks(newConfig.amount, newConfig)]);
    setConfig(newConfig)
    setConfiguring(false)
  }

  useEffect(() => {
    if (tasks.length !== prevTasks.current.length) {
      setCurrentIndex(tasks.length - 1);
    }
  }, [tasks])

  useEffect(() => {
    prevTasks.current = tasks;
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
      <Box mt={6} fullWidth flexDirection="column" alignItems="center">
        <Rows gap={8} center>
          <Rows gap={12} center>
            <Rows gap={4} center>
              <h3>Tasks table:</h3>
              <Columns gap={8}>
                <Button onClick={startConfiguring}>{'Configure'}</Button>
                <Button onClick={randomize}>{'Randomize'}</Button>
                <Button onClick={solve}>{'Solve'}</Button>
              </Columns>
              <TasksTable tasks={first(tasks)} />
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
                    <TaskGrid tasksPerSecond={tasks} currentIndex={currentIndex} />
                  </Box>
                </RowFade>
              </Box>
            </Rows>
          </Rows>
        </Rows>
      </Box>
    </StylesProvider>
  )
}

export default App;


// const data= JSON.parse('[{"id":"0.dz0y5qpxg5","timeUntil":{"availability":3,"completion":8,"deadline":12},"active":false,"name":"Task 0","color":"#513DB6"},{"id":"0.689g53vg98k","timeUntil":{"availability":2,"completion":7,"deadline":10},"active":false,"name":"Task 1","color":"#349B9B"},{"id":"0.ph3ykk173d","timeUntil":{"availability":3,"completion":7,"deadline":11},"active":false,"name":"Task 2","color":"#CF2670"}]')


// console.log(tasks[tasks.length - 1].map(task => (
//   `${task.name}: aval: ${task.timeUntil.availability}, dead ${task.timeUntil.deadline}, compl ${task.timeUntil.completion}`
// )).join('\n'))
