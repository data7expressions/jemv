[jemv](../README.md) / IConstraint

# Interface: IConstraint

## Implemented by

- [`AndConstraint`](../classes/AndConstraint.md)
- [`FunctionConstraint`](../classes/FunctionConstraint.md)

## Table of contents

### Methods

- [eval](IConstraint.md#eval)

## Methods

### eval

▸ **eval**(`value`, `path`): [`EvalError`](EvalError.md)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |
| `path` | `string` |

#### Returns

[`EvalError`](EvalError.md)[]

#### Defined in

[src/lib/model/schema.ts:99](https://github.com/data7expressions/jemv/blob/d9a8263/src/lib/model/schema.ts#L99)
