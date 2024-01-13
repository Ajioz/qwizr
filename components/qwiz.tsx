'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTimer } from '@/hooks'
import { type QwizButtonProps, type QwizDataProps } from '@/types'

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

import { QwizRecap } from './qwiz-recap'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Progress } from './ui/progress'

export function Qwiz({ qwizData }: QwizDataProps) {
  const [questionNumber, setQuestionNumber] = useState(0)
  const { seconds } = useTimer(questionNumber)
  const progressValue = (questionNumber * 100) / qwizData!.length
  const currentQuestion = qwizData![questionNumber]
  const router = useRouter()
  const [score, setScore] = useState(0)

  function handleNext(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    console.log('Function handleNext called.')
    if (questionNumber < qwizData!.length) {
      setQuestionNumber(prevNumber => prevNumber + 1)
    }
  }

  function handleExit(e: QwizButtonProps) {
    e.preventDefault()
    console.log('Function handleExit called.')
    router.back()
  }

  function handleNextQwiz(e: QwizButtonProps) {
    e.preventDefault()
    console.log('Function handleNewQwiz called.')
    router.push('/qwiz/frameworks/angular-js')
  }

  function handleTryAgain(e: QwizButtonProps) {
    e.preventDefault()
    console.log('Function handleTryAgain called.')
    window.location.reload()
  }

  function handleAnswer(selectedAnswer: string) {
    console.log('Function handleAnswer called.')

    if (
      currentQuestion?.answers?.some(
        answer => answer.answer === selectedAnswer && answer.isCorrect
      )
    ) {
      setScore(prevScore => prevScore + 1)
    }
  }
  if (progressValue === 100) {
    return (
      <QwizRecap
        score={score}
        length={qwizData!.length}
        isComplete={true}
        handleExit={handleExit}
        handleNextQwiz={handleNextQwiz}
        handleTryAgain={handleTryAgain}
      />
    )
  }

  if (seconds <= 0) {
    return (
      <QwizRecap
        score={score}
        length={qwizData!.length}
        isComplete={false}
        handleExit={handleExit}
        handleNextQwiz={handleNextQwiz}
        handleTryAgain={handleTryAgain}
      />
    )
  }

  return (
    <>
      <div className='flex w-full justify-between items-center'>
        <p className='pb-3 text-center text-md text-muted-foreground md:text-lg'>
          {`Question ${questionNumber + 1} of ${qwizData!.length}`}
        </p>
        <p className='pb-3 text-center text-md text-muted-foreground md:text-lg'>
          {seconds}
        </p>
      </div>
      <h1 className='text-left text-2xl sm:text-3xl font-bold leading-tight tracking-tighter md:text-4xl mb-6'>
        {currentQuestion?.question}
      </h1>
      <div className='w-full'>
        <Progress value={progressValue} />
        <form onSubmit={e => handleNext(e)}>
          <RadioGroup
            required={true}
            className='my-6'
            name='qwiz'>
            {currentQuestion?.answers?.map((answer, index) => (
              <div
                key={index}
                className='flex items-center space-x-2 text-card-foreground py-2'>
                <RadioGroupItem
                  value={answer.answer}
                  id={`${index + 1}`}
                  onClick={() => handleAnswer(answer.answer)}
                  required={true}
                />
                <Label
                  className='text-sm md:text-md'
                  htmlFor={`${index + 1}`}>
                  {answer.answer}
                </Label>
              </div>
            ))}
          </RadioGroup>
          <div className='flex w-full items-center justify-between'>
            <Button
              variant='outline'
              onClick={e => handleExit(e)}>
              <span className='sr-only'>Exit</span>
              &larr; Exit
            </Button>
            <Button
              type='submit'
              variant='default'>
              <span className='sr-only'>Next</span>
              Next &rarr;
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}
