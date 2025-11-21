import operatorsData from '../data/operators.json'
import { Operator } from '../types'

const operators: Operator[] = operatorsData as Operator[]

export function getOperatorByCode(code: string): Operator | undefined {
  return operators.find((op) => op.code === code)
}

export function getAllOperators(): Operator[] {
  return operators
}

export function isNorthernRailway(code: string): boolean {
  const operator = getOperatorByCode(code)
  return operator?.isNorthern === true
}

