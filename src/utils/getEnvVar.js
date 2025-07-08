import dotenv from 'dotenv';

dotenv.config();

export function getEnvVar(name, defaultValue) {
    const valueEnv = process.env[name];

    if (valueEnv) {
        return valueEnv
    }

    if (defaultValue) {
        return defaultValue
    }

    throw new Error(`Missing: process.env['${name}']`);
}