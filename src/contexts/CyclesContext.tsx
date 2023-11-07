import { differenceInSeconds } from 'date-fns';
import { ReactNode, createContext, useEffect, useReducer, useState } from 'react';
import { addNewCycleAction, interruptCurrentCycleAction, markCurrentCycleAsFinishedAction } from '../reducers/cycles/actions';
import { Cycle, cycleReducer } from '../reducers/cycles/reducer';

interface CreateCycleData { 
  task: string;
  minutesAmount: number;
}

interface CyclesContextType {
  cycles: Cycle[];
  activeCycle: Cycle | undefined;
  activeCycleId: string | null;
  amountSecondsPassed: number;
  markCurrentCycleAsFinished: () => void;
  setSecondsPassed: (seconds: number) => void;
  createNewCycle: (data: CreateCycleData) => void;
  interruptCurrentCycle: () => void;
}


export const CyclesContext = createContext({} as CyclesContextType)

interface CyclesContextProviderProps {
  children: ReactNode
}

export function CyclesContextProvider({ children }: CyclesContextProviderProps) {
  const [cycleState, dispatch] = useReducer(cycleReducer,
    {
      cycles: [],
      activeCycleId: null,
    }, (initialState) => {
      const storedStateAsJSON = localStorage.getItem('cycles-state');
      if (storedStateAsJSON) {
        return JSON.parse(storedStateAsJSON)
      }
      return initialState
    }
  )
  const { cycles, activeCycleId } = cycleState
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
    if(activeCycle){
     return differenceInSeconds( new Date(),  new Date(activeCycle.startDate),)
    }
    return 0
  })

  useEffect(() => {
    const stateJSON = JSON.stringify(cycleState)
    localStorage.setItem('cycles-state', stateJSON)
  }, [cycleState])

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function markCurrentCycleAsFinished() {
    dispatch(markCurrentCycleAsFinishedAction())
  }

  function createNewCycle(data: CreateCycleData) {
    const newCycle: Cycle = {
      id: String(new Date().getTime()),
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    dispatch(addNewCycleAction(newCycle))

    setAmountSecondsPassed(0)
  }

  function interruptCurrentCycle() {    
     dispatch(interruptCurrentCycleAction())
  }


  return (
    <CyclesContext.Provider 
          value={{ 
            cycles,
            activeCycle, 
            activeCycleId, 
            markCurrentCycleAsFinished, 
            amountSecondsPassed,
            setSecondsPassed,
            createNewCycle,
            interruptCurrentCycle,
          }}
        >
      {children}
    </CyclesContext.Provider>
  )
}