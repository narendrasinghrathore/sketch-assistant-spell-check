import { resolve } from 'path'
import { testAssistant } from '@sketch-hq/sketch-assistant-utils'

import Assistant from '..'
const fileName = './test.sketch';
const sample1 = './sample1.sketch';
const sample2 = './sample2.sketch';
const sample3 = './sample3.sketch';

test('spell-check-test: test', async () => {
  const { violations, ruleErrors } = await testAssistant(
    resolve(__dirname, fileName),
    Assistant,
  )
  console.log(violations)
  const message = violations && violations[0]?.message;
  if (!message) return;
  // expect(message).toMatch(validateWith);
  expect(ruleErrors).toHaveLength(0)
})

test('spell-check-test: Sample 1', async () => {
  const { violations, ruleErrors } = await testAssistant(
    resolve(__dirname, sample1),
    Assistant,
  )
  console.log(violations)
  const message = violations && violations[0]?.message;
  if (!message) return;
  // expect(message).toMatch(validateWith);
  expect(ruleErrors).toHaveLength(0)
})


test('spell-check-test: Sample 2', async () => {
  const { violations, ruleErrors } = await testAssistant(
    resolve(__dirname, sample2),
    Assistant,
  )
  console.log(violations)
  const message = violations && violations[0]?.message;
  if (!message) return;
  // expect(message).toMatch(validateWith);
  expect(ruleErrors).toHaveLength(0)
})

test('spell-check-test: Sample 3', async () => {
  const { violations, ruleErrors } = await testAssistant(
    resolve(__dirname, sample3),
    Assistant,
  )
  console.log(violations)
  const message = violations && violations[0]?.message;
  if (!message) return;
  // expect(message).toMatch(validateWith);
  expect(ruleErrors).toHaveLength(0)
})


