[jemv](../README.md) / Schema

# Interface: Schema

## Table of contents

### Properties

- [$defs](Schema.md#$defs)
- [$extends](Schema.md#$extends)
- [$id](Schema.md#$id)
- [$ref](Schema.md#$ref)
- [$schema](Schema.md#$schema)
- [additionalItems](Schema.md#additionalitems)
- [additionalProperties](Schema.md#additionalproperties)
- [contains](Schema.md#contains)
- [contentEncoding](Schema.md#contentencoding)
- [contentMediaType](Schema.md#contentmediatype)
- [contentSchema](Schema.md#contentschema)
- [dependencies](Schema.md#dependencies)
- [dependentRequired](Schema.md#dependentrequired)
- [dependentSchemas](Schema.md#dependentschemas)
- [enum](Schema.md#enum)
- [exclusiveMaximum](Schema.md#exclusivemaximum)
- [exclusiveMinimum](Schema.md#exclusiveminimum)
- [format](Schema.md#format)
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
- [pattern](Schema.md#pattern)
- [patternProperties](Schema.md#patternproperties)
- [prefixItems](Schema.md#prefixitems)
- [properties](Schema.md#properties)
- [propertyNames](Schema.md#propertynames)
- [required](Schema.md#required)
- [title](Schema.md#title)
- [type](Schema.md#type)
- [unevaluatedItems](Schema.md#unevaluateditems)
- [unevaluatedProperties](Schema.md#unevaluatedproperties)
- [uniqueItems](Schema.md#uniqueitems)

## Properties

### $defs

• **$defs**: `any`

#### Defined in

[model/schema.ts:37](https://github.com/FlavioLionelRita/jemv/blob/b3abfe7/src/lib/model/schema.ts#L37)

___

### $extends

• `Optional` **$extends**: `string`

#### Defined in

[model/schema.ts:35](https://github.com/FlavioLionelRita/jemv/blob/b3abfe7/src/lib/model/schema.ts#L35)

___

### $id

• `Optional` **$id**: `string`

#### Defined in

[model/schema.ts:31](https://github.com/FlavioLionelRita/jemv/blob/b3abfe7/src/lib/model/schema.ts#L31)

___

### $ref

• `Optional` **$ref**: `string`

#### Defined in

[model/schema.ts:34](https://github.com/FlavioLionelRita/jemv/blob/b3abfe7/src/lib/model/schema.ts#L34)

___

### $schema

• `Optional` **$schema**: `string`

#### Defined in

[model/schema.ts:32](https://github.com/FlavioLionelRita/jemv/blob/b3abfe7/src/lib/model/schema.ts#L32)

___

### additionalItems

• `Optional` **additionalItems**: `any`

#### Defined in

[model/schema.ts:83](https://github.com/FlavioLionelRita/jemv/blob/b3abfe7/src/lib/model/schema.ts#L83)

___

### additionalProperties

• `Optional` **additionalProperties**: `any`

#### Defined in

[model/schema.ts:69](https://github.com/FlavioLionelRita/jemv/blob/b3abfe7/src/lib/model/schema.ts#L69)

___

### contains

• `Optional` **contains**: [`Contains`](Contains.md)

#### Defined in

[model/schema.ts:79](https://github.com/FlavioLionelRita/jemv/blob/b3abfe7/src/lib/model/schema.ts#L79)

___

### contentEncoding

• `Optional` **contentEncoding**: `string`

#### Defined in

[model/schema.ts:59](https://github.com/FlavioLionelRita/jemv/blob/b3abfe7/src/lib/model/schema.ts#L59)

___

### contentMediaType

• `Optional` **contentMediaType**: `string`

#### Defined in

[model/schema.ts:60](https://github.com/FlavioLionelRita/jemv/blob/b3abfe7/src/lib/model/schema.ts#L60)

___

### contentSchema

• `Optional` **contentSchema**: [`ContentSchema`](ContentSchema.md)

#### Defined in

[model/schema.ts:61](https://github.com/FlavioLionelRita/jemv/blob/b3abfe7/src/lib/model/schema.ts#L61)

___

### dependencies

• `Optional` **dependencies**: `any`

#### Defined in

[model/schema.ts:72](https://github.com/FlavioLionelRita/jemv/blob/b3abfe7/src/lib/model/schema.ts#L72)

___

### dependentRequired

• `Optional` **dependentRequired**: `any`

#### Defined in

[model/schema.ts:71](https://github.com/FlavioLionelRita/jemv/blob/b3abfe7/src/lib/model/schema.ts#L71)

___

### dependentSchemas

• `Optional` **dependentSchemas**: `any`

#### Defined in

[model/schema.ts:73](https://github.com/FlavioLionelRita/jemv/blob/b3abfe7/src/lib/model/schema.ts#L73)

___

### enum

• `Optional` **enum**: `string`[]

#### Defined in

[model/schema.ts:42](https://github.com/FlavioLionelRita/jemv/blob/b3abfe7/src/lib/model/schema.ts#L42)

___

### exclusiveMaximum

• `Optional` **exclusiveMaximum**: `boolean`

#### Defined in

[model/schema.ts:50](https://github.com/FlavioLionelRita/jemv/blob/b3abfe7/src/lib/model/schema.ts#L50)

___

### exclusiveMinimum

• `Optional` **exclusiveMinimum**: `boolean`

#### Defined in

[model/schema.ts:51](https://github.com/FlavioLionelRita/jemv/blob/b3abfe7/src/lib/model/schema.ts#L51)

___

### format

• `Optional` **format**: `string`

#### Defined in

[model/schema.ts:57](https://github.com/FlavioLionelRita/jemv/blob/b3abfe7/src/lib/model/schema.ts#L57)

___

### items

• `Optional` **items**: [`Schema`](Schema.md)

#### Defined in

[model/schema.ts:43](https://github.com/FlavioLionelRita/jemv/blob/b3abfe7/src/lib/model/schema.ts#L43)

___

### maxContains

• `Optional` **maxContains**: `number`

#### Defined in

[model/schema.ts:80](https://github.com/FlavioLionelRita/jemv/blob/b3abfe7/src/lib/model/schema.ts#L80)

___

### maxItems

• `Optional` **maxItems**: `number`

#### Defined in

[model/schema.ts:76](https://github.com/FlavioLionelRita/jemv/blob/b3abfe7/src/lib/model/schema.ts#L76)

___

### maxLength

• `Optional` **maxLength**: `number`

#### Defined in

[model/schema.ts:55](https://github.com/FlavioLionelRita/jemv/blob/b3abfe7/src/lib/model/schema.ts#L55)

___

### maxProperties

• `Optional` **maxProperties**: `number`

#### Defined in

[model/schema.ts:65](https://github.com/FlavioLionelRita/jemv/blob/b3abfe7/src/lib/model/schema.ts#L65)

___

### maximum

• `Optional` **maximum**: `any`

#### Defined in

[model/schema.ts:49](https://github.com/FlavioLionelRita/jemv/blob/b3abfe7/src/lib/model/schema.ts#L49)

___

### minContains

• `Optional` **minContains**: `number`

#### Defined in

[model/schema.ts:81](https://github.com/FlavioLionelRita/jemv/blob/b3abfe7/src/lib/model/schema.ts#L81)

___

### minItems

• `Optional` **minItems**: `number`

#### Defined in

[model/schema.ts:77](https://github.com/FlavioLionelRita/jemv/blob/b3abfe7/src/lib/model/schema.ts#L77)

___

### minLength

• `Optional` **minLength**: `number`

#### Defined in

[model/schema.ts:56](https://github.com/FlavioLionelRita/jemv/blob/b3abfe7/src/lib/model/schema.ts#L56)

___

### minProperties

• `Optional` **minProperties**: `number`

#### Defined in

[model/schema.ts:66](https://github.com/FlavioLionelRita/jemv/blob/b3abfe7/src/lib/model/schema.ts#L66)

___

### minimum

• `Optional` **minimum**: `any`

#### Defined in

[model/schema.ts:48](https://github.com/FlavioLionelRita/jemv/blob/b3abfe7/src/lib/model/schema.ts#L48)

___

### multipleOf

• **multipleOf**: `number`

#### Defined in

[model/schema.ts:52](https://github.com/FlavioLionelRita/jemv/blob/b3abfe7/src/lib/model/schema.ts#L52)

___

### name

• `Optional` **name**: `string`

#### Defined in

[model/schema.ts:40](https://github.com/FlavioLionelRita/jemv/blob/b3abfe7/src/lib/model/schema.ts#L40)

___

### pattern

• `Optional` **pattern**: `string`

#### Defined in

[model/schema.ts:58](https://github.com/FlavioLionelRita/jemv/blob/b3abfe7/src/lib/model/schema.ts#L58)

___

### patternProperties

• `Optional` **patternProperties**: `any`

#### Defined in

[model/schema.ts:68](https://github.com/FlavioLionelRita/jemv/blob/b3abfe7/src/lib/model/schema.ts#L68)

___

### prefixItems

• `Optional` **prefixItems**: `any`

#### Defined in

[model/schema.ts:82](https://github.com/FlavioLionelRita/jemv/blob/b3abfe7/src/lib/model/schema.ts#L82)

___

### properties

• `Optional` **properties**: `any`

#### Defined in

[model/schema.ts:44](https://github.com/FlavioLionelRita/jemv/blob/b3abfe7/src/lib/model/schema.ts#L44)

___

### propertyNames

• `Optional` **propertyNames**: [`PropertyNames`](PropertyNames.md)

#### Defined in

[model/schema.ts:67](https://github.com/FlavioLionelRita/jemv/blob/b3abfe7/src/lib/model/schema.ts#L67)

___

### required

• `Optional` **required**: `string`[]

#### Defined in

[model/schema.ts:64](https://github.com/FlavioLionelRita/jemv/blob/b3abfe7/src/lib/model/schema.ts#L64)

___

### title

• `Optional` **title**: `string`

#### Defined in

[model/schema.ts:39](https://github.com/FlavioLionelRita/jemv/blob/b3abfe7/src/lib/model/schema.ts#L39)

___

### type

• **type**: [`PropertyType`](../enums/PropertyType.md)

#### Defined in

[model/schema.ts:41](https://github.com/FlavioLionelRita/jemv/blob/b3abfe7/src/lib/model/schema.ts#L41)

___

### unevaluatedItems

• `Optional` **unevaluatedItems**: `any`

#### Defined in

[model/schema.ts:84](https://github.com/FlavioLionelRita/jemv/blob/b3abfe7/src/lib/model/schema.ts#L84)

___

### unevaluatedProperties

• `Optional` **unevaluatedProperties**: `any`

#### Defined in

[model/schema.ts:70](https://github.com/FlavioLionelRita/jemv/blob/b3abfe7/src/lib/model/schema.ts#L70)

___

### uniqueItems

• `Optional` **uniqueItems**: `boolean`

#### Defined in

[model/schema.ts:78](https://github.com/FlavioLionelRita/jemv/blob/b3abfe7/src/lib/model/schema.ts#L78)
