import {Schema} from "swagger-schema-official";

type Options = {
    indexSchema?: Schema
    strictNumber?: boolean;
};
const isObject = (val: any) => {
    return typeof val === 'object' &&
        !Array.isArray(val) &&
        val !== null
}

const isInt = (n: number) => {
    return Number(n) === n && n % 1 === 0;
}

const anyToSwaggerSchema = (anyValue: any, options?: Options): Schema => {
    let ret: Schema;

    if (isObject(anyValue)) {
        ret = {
            type: 'object',
        };
        Object.entries(anyValue).forEach(([key, val]) => {
            if (!ret.properties) {
                ret.properties = {};
            }
            if (!ret.required) {
                ret.required = [];
            }
            ret.properties[key] = anyToSwaggerSchema(val, options);
            ret.required.push(key);
        });
    } else if (Array.isArray(anyValue)) {
        if (anyValue.length === 0) {
            ret = {
                type: 'array',
                items: {
                    type: 'object',
                    additionalProperties: true,
                }
            };
        } else {
            ret = {
                type: 'array',
                items: anyToSwaggerSchema(anyValue[0], options),
            }
        }
    } else {
        if (typeof anyValue === 'number') {
            if (options?.strictNumber) {
                if (isInt(anyValue)) {
                    ret = {
                        type: 'integer',
                    };
                } else {
                    ret = {
                        type: 'number',
                        format: 'double',
                    };
                }
            } else {
                ret = {
                    type: 'number',
                };
            }
        } else if (typeof anyValue === 'string') {
            ret = {
                type: 'string',
            };
        } else if (typeof anyValue === 'boolean') {
            ret = {
                type: 'boolean',
            };
        } else {
            ret = {
                type: 'object'
            }
        }
    }
    return ret;
}
const jsonToSwaggerSchema = (json: string | Record<string, unknown>, options?: Options): Schema => {

    if (typeof json === 'string') {
        json = JSON.parse(json);
    }
    const ret = anyToSwaggerSchema(json, options)


    if (options) {
        if (options.indexSchema) {
            ret.additionalProperties = options.indexSchema;
        }
    }

    return ret;
}


export default jsonToSwaggerSchema;