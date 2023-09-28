import { useContext } from 'react';
import { useFormContext } from 'react-hook-form';
import { CyclesContext } from '../..';
import { FormContainer, MinutesAmountInput, TaskInput } from "./styles";

export function NewCycleForm(){
  const { activeCycle, } = useContext(CyclesContext)
  const { register } = useFormContext()
  return (
     <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput
            id="task"
            placeholder='Dê um nome para o seu projeto'
            list='task-suggestions'
            aria-label='Vou trabalhar em'
            aria-placeholder='Dê um nome para o seu projeto'
            disabled={!!activeCycle}
            {...register('task')}
          />
          <datalist id="task-suggestions">
            <option value="Projeto 1" />
          </datalist>

          <label htmlFor="minutesAmount">durante</label>
          <MinutesAmountInput
            type="number"
            id="minutesAmount"
            placeholder='00'
            step={5}
            min={5}
            max={60}
            aria-label='durante'
            aria-placeholder='00'
            disabled={!!activeCycle}
            {...register('minutesAmount', { valueAsNumber: true })}
          />

          <span>minutos.</span>
        </FormContainer>
  )
}