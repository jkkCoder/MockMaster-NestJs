#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
try {
    const config = (0, index_1.loadEnvironmentConfig)();
    console.log('✅ Environment configuration is valid!');
    console.log('\nLoaded configuration:');
    console.log(JSON.stringify(config, null, 2));
    process.exit(0);
}
catch (error) {
    console.error('❌ Environment configuration validation failed:');
    if (error instanceof Error) {
        console.error(error.message);
    }
    else {
        console.error(error);
    }
    process.exit(1);
}
//# sourceMappingURL=validate.js.map