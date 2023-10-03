import { zodResolver } from '@hookform/resolvers/zod';
import { HandPalm, Play } from 'phosphor-react';
import { useContext } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import * as zod from 'zod';
import { CyclesContext } from '../../contexts/CyclesContext';
import { Countdown } from './components/Countdown';
import { NewCycleForm } from './components/NewCycleForm';
import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton
} from './styles';

const newCycleValidationSchema = zod.object({
  task: zod.string().nonempty({ message: 'O nome da tarefa não pode ser vazio' }),
  minutesAmount: zod
    .number()
    .min(5, { message: 'O tempo mínimo é de 5 minutos' })
    .max(60, { message: 'O tempo máximo é de 60 minutos' }),
})
type NewCycleFormData = zod.infer<typeof newCycleValidationSchema>

export function Home() {
  const { 
    activeCycle, 
    createNewCycle, 
    interruptCurrentCycle
  } = useContext(CyclesContext)
  
  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    }
  })
  
  const  { handleSubmit, watch, reset } = newCycleForm;

  function handleCreatedNewCycle(data: NewCycleFormData) {
    createNewCycle(data)
    reset()
  }

  const task = watch('task')
  const isSubmitDisabled = !task;

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreatedNewCycle)}>
          <FormProvider {...newCycleForm}>
            <NewCycleForm />
          </FormProvider>
          <Countdown />
        { activeCycle ? (
        <StopCountdownButton onClick={interruptCurrentCycle} type="button">
          <HandPalm size={24} />
          Interromper
        </StopCountdownButton>
        ) : (
        <StartCountdownButton disabled={isSubmitDisabled} type="submit">
          <Play size={24} />
          Começar
        </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}