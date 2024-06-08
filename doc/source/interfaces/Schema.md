[jemv](../README.md) / Schema

# Interface: Schema

## Hierarchy

- `Schema`

  ↳ **`Schema`**

## Table of contents

### Properties

- [$anchor](Schema.md#$anchor)
- [$defs](Schema.md#$defs)
- [$extends](Schema.md#$extends)
- [$id](Schema.md#$id)
- [$ref](Schema.md#$ref)
- [$schema](Schema.md#$schema)
- [additionalItems](Schema.md#additionalitems)
- [additionalProperties](Schema.md#additionalproperties)
- [allOf](Schema.md#allof)
- [anyOf](Schema.md#anyof)
- [const](Schema.md#const)
- [contains](Schema.md#contains)
- [contentEncoding](Schema.md#contentencoding)
- [contentMediaType](Schema.md#contentmediatype)
- [contentSchema](Schema.md#contentschema)
- [dependencies](Schema.md#dependencies)
- [dependentRequired](Schema.md#dependentrequired)
- [dependentSchemas](Schema.md#dependentschemas)
- [else](Schema.md#else)
- [enum](Schema.md#enum)
- [exclusiveMaximum](Schema.md#exclusivemaximum)
- [exclusiveMinimum](Schema.md#exclusiveminimum)
- [format](Schema.md#format)
- [if](Schema.md#if)
- [items](Schema.md#items)
- [maxContains](Schema.md#maxcontains)
- [maxItems](Schema.md#maxitems)
- [maxLength](Schema.md#maxlength)
- [maxProperties](Schema.md#maxproperties)
- [maximum](Schema.md#maximum)
- [minContains](Schema.md#mincontains)
- [minItems](Schema.md#minitems)
- [minLength](Schema.md#minlength)
- [minProperties](Schema.md#minproperties)
- [minimum](Schema.md#minimum)
- [multipleOf](Schema.md#multipleof)
- [name](Schema.md#name)
- [not](Schema.md#not)
- [oneOf](Schema.md#oneof)
- [pattern](Schema.md#pattern)
- [patternProperties](Schema.md#patternproperties)
- [prefixItems](Schema.md#prefixitems)
- [properties](Schema.md#properties)
- [propertyNames](Schema.md#propertynames)
- [required](Schema.md#required)
- [then](Schema.md#then)
- [title](Schema.md#title)
- [type](Schema.md#type)
- [unevaluatedItems](Schema.md#unevaluateditems)
- [unevaluatedProperties](Schema.md#unevaluatedproperties)
- [uniqueItems](Schema.md#uniqueitems)

## Properties

### $anchor

• `Optional` **$anchor**: `string`

#### Inherited from

SchemaBase.$anchor

#### Defined in

node_modules/schema-manager/model/schema.d.ts:3

___

### $defs

• **$defs**: `any`

#### Inherited from

SchemaBase.$defs

#### Defined in

node_modules/schema-manager/model/schema.d.ts:6

___

### $extends

• `Optional` **$extends**: `string`

#### Inherited from

SchemaBase.$extends

#### Defined in

node_modules/schema-manager/model/schema.d.ts:5

___

### $id

• `Optional` **$id**: `string`

#### Inherited from

SchemaBase.$id

#### Defined in

node_modules/schema-manager/model/schema.d.ts:2

___

### $ref

• `Optional` **$ref**: `string`

#### Inherited from

SchemaBase.$ref

#### Defined in

node_modules/schema-manager/model/schema.d.ts:7

___

### $schema

• `Optional` **$schema**: `string`

#### Inherited from

SchemaBase.$schema

#### Defined in

node_modules/schema-manager/model/schema.d.ts:4

___

### additionalItems

• `Optional` **additionalItems**: `any`

#### Defined in

[src/lib/model/schema.ts:78](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/model/schema.ts#L78)

___

### additionalProperties

• `Optional` **additionalProperties**: `any`

#### Defined in

[src/lib/model/schema.ts:63](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/model/schema.ts#L63)

___

### allOf

• `Optional` **allOf**: [`Schema`](Schema.md)[]

#### Defined in

[src/lib/model/schema.ts:80](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/model/schema.ts#L80)

___

### anyOf

• `Optional` **anyOf**: [`Schema`](Schema.md)[]

#### Defined in

[src/lib/model/schema.ts:81](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/model/schema.ts#L81)

___

### const

• `Optional` **const**: `any`

#### Defined in

[src/lib/model/schema.ts:76](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/model/schema.ts#L76)

___

### contains

• `Optional` **contains**: `Boolean` \| [`Schema`](Schema.md)

#### Defined in

[src/lib/model/schema.ts:73](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/model/schema.ts#L73)

___

### contentEncoding

• `Optional` **contentEncoding**: `string`

#### Defined in

[src/lib/model/schema.ts:53](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/model/schema.ts#L53)

___

### contentMediaType

• `Optional` **contentMediaType**: `string`

#### Defined in

[src/lib/model/schema.ts:54](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/model/schema.ts#L54)

___

### contentSchema

• `Optional` **contentSchema**: [`ContentSchema`](ContentSchema.md)

#### Defined in

[src/lib/model/schema.ts:55](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/model/schema.ts#L55)

___

### dependencies

• `Optional` **dependencies**: `any`

#### Defined in

[src/lib/model/schema.ts:66](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/model/schema.ts#L66)

___

### dependentRequired

• `Optional` **dependentRequired**: `any`

#### Defined in

[src/lib/model/schema.ts:65](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/model/schema.ts#L65)

___

### dependentSchemas

• `Optional` **dependentSchemas**: `any`

#### Defined in

[src/lib/model/schema.ts:67](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/model/schema.ts#L67)

___

### else

• `Optional` **else**: [`Schema`](Schema.md)

#### Defined in

[src/lib/model/schema.ts:86](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/model/schema.ts#L86)

___

### enum

• `Optional` **enum**: `string`[]

#### Defined in

[src/lib/model/schema.ts:38](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/model/schema.ts#L38)

___

### exclusiveMaximum

• `Optional` **exclusiveMaximum**: `number`

#### Defined in

[src/lib/model/schema.ts:44](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/model/schema.ts#L44)

___

### exclusiveMinimum

• `Optional` **exclusiveMinimum**: `number`

#### Defined in

[src/lib/model/schema.ts:45](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/model/schema.ts#L45)

___

### format

• `Optional` **format**: `string`

#### Defined in

[src/lib/model/schema.ts:51](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/model/schema.ts#L51)

___

### if

• `Optional` **if**: [`Schema`](Schema.md)

#### Defined in

[src/lib/model/schema.ts:84](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/model/schema.ts#L84)

___

### items

• `Optional` **items**: [`Schema`](Schema.md)

#### Defined in

[src/lib/model/schema.ts:36](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/model/schema.ts#L36)

___

### maxContains

• `Optional` **maxContains**: `number`

#### Defined in

[src/lib/model/schema.ts:74](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/model/schema.ts#L74)

___

### maxItems

• `Optional` **maxItems**: `number`

#### Defined in

[src/lib/model/schema.ts:70](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/model/schema.ts#L70)

___

### maxLength

• `Optional` **maxLength**: `number`

#### Defined in

[src/lib/model/schema.ts:49](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/model/schema.ts#L49)

___

### maxProperties

• `Optional` **maxProperties**: `number`

#### Defined in

[src/lib/model/schema.ts:59](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/model/schema.ts#L59)

___

### maximum

• `Optional` **maximum**: `number`

#### Defined in

[src/lib/model/schema.ts:43](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/model/schema.ts#L43)

___

### minContains

• `Optional` **minContains**: `number`

#### Defined in

[src/lib/model/schema.ts:75](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/model/schema.ts#L75)

___

### minItems

• `Optional` **minItems**: `number`

#### Defined in

[src/lib/model/schema.ts:71](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/model/schema.ts#L71)

___

### minLength

• `Optional` **minLength**: `number`

#### Defined in

[src/lib/model/schema.ts:50](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/model/schema.ts#L50)

___

### minProperties

• `Optional` **minProperties**: `number`

#### Defined in

[src/lib/model/schema.ts:60](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/model/schema.ts#L60)

___

### minimum

• `Optional` **minimum**: `number`

#### Defined in

[src/lib/model/schema.ts:42](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/model/schema.ts#L42)

___

### multipleOf

• **multipleOf**: `number`

#### Defined in

[src/lib/model/schema.ts:46](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/model/schema.ts#L46)

___

### name

• `Optional` **name**: `string`

#### Defined in

[src/lib/model/schema.ts:34](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/model/schema.ts#L34)

___

### not

• `Optional` **not**: [`Schema`](Schema.md)

#### Defined in

[src/lib/model/schema.ts:83](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/model/schema.ts#L83)

___

### oneOf

• `Optional` **oneOf**: [`Schema`](Schema.md)[]

#### Defined in

[src/lib/model/schema.ts:82](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/model/schema.ts#L82)

___

### pattern

• `Optional` **pattern**: `string`

#### Defined in

[src/lib/model/schema.ts:52](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/model/schema.ts#L52)

___

### patternProperties

• `Optional` **patternProperties**: `any`

#### Defined in

[src/lib/model/schema.ts:62](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/model/schema.ts#L62)

___

### prefixItems

• `Optional` **prefixItems**: `any`

#### Defined in

[src/lib/model/schema.ts:77](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/model/schema.ts#L77)

___

### properties

• `Optional` **properties**: `any`

#### Defined in

[src/lib/model/schema.ts:35](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/model/schema.ts#L35)

___

### propertyNames

• `Optional` **propertyNames**: [`PropertyNames`](PropertyNames.md)

#### Defined in

[src/lib/model/schema.ts:61](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/model/schema.ts#L61)

___

### required

• `Optional` **required**: `string`[]

#### Defined in

[src/lib/model/schema.ts:58](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/model/schema.ts#L58)

___

### then

• `Optional` **then**: [`Schema`](Schema.md)

#### Defined in

[src/lib/model/schema.ts:85](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/model/schema.ts#L85)

___

### title

• `Optional` **title**: `string`

#### Defined in

[src/lib/model/schema.ts:33](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/model/schema.ts#L33)

___

### type

• `Optional` **type**: [`PropertyType`](../enums/PropertyType.md) \| [`PropertyType`](../enums/PropertyType.md)[]

#### Defined in

[src/lib/model/schema.ts:37](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/model/schema.ts#L37)

___

### unevaluatedItems

• `Optional` **unevaluatedItems**: `any`

#### Defined in

[src/lib/model/schema.ts:79](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/model/schema.ts#L79)

___

### unevaluatedProperties

• `Optional` **unevaluatedProperties**: `any`

#### Defined in

[src/lib/model/schema.ts:64](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/model/schema.ts#L64)

___

### uniqueItems

• `Optional` **uniqueItems**: `boolean`

#### Defined in

[src/lib/model/schema.ts:72](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/model/schema.ts#L72)
