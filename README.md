# Json to Swagger Schema


## Install

```shell
npm i @nextunicorn/json-to-swagger-schema --save
```


## Usage

```typescript
import jsonToSwaggerSchema from "@nextunicorn/json-to-swagger-schema";

const MyObjectSchmea = jsonToSwaggerSchema({
    myKey: 'string',
    isNumber: 1,
})
```