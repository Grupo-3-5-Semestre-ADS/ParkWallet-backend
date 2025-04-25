import express from 'express';
import swaggerUi from 'swagger-ui-express';
import axios from 'axios';
import dotenv from "dotenv";

const router = express.Router();

dotenv.config();

const catalogUrl = `http://${process.env.CATALOG_HOST}:${process.env.CATALOG_PORT}`
const chatUrl = `http://${process.env.CHAT_HOST}:${process.env.CHAT_PORT}`
const notificationUrl = `http://${process.env.NOTIFICATION_HOST}:${process.env.NOTIFICATION_PORT}`
const transactionUrl = `http://${process.env.TRANSACTION_HOST}:${process.env.TRANSACTION_PORT}`
const walletUrl = `http://${process.env.WALLET_HOST}:${process.env.WALLET_PORT}`
const userUrl = `http://${process.env.USER_HOST}:${process.env.USER_PORT}`

const swaggerEndpoint = "/swagger/swagger.json"

const swaggerSources = {
    catalog: `${catalogUrl}${swaggerEndpoint}`,
    chat: `${chatUrl}${swaggerEndpoint}`,
    notification: `${notificationUrl}${swaggerEndpoint}`,
    transaction: `${transactionUrl}${swaggerEndpoint}`,
    wallet: `${walletUrl}${swaggerEndpoint}`,
    user: `${userUrl}${swaggerEndpoint}`,
};

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function updateRefs(obj, mapping) {
    for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            updateRefs(obj[key], mapping);
        } else if (key === '$ref' && typeof obj[key] === 'string') {
            if (mapping[obj[key]]) {
                obj[key] = mapping[obj[key]];
            }
        }
    }
}


async function getCombinedSwagger() {
    const base = {
        openapi: '3.0.0',
        info: {
            title: 'API Gateway - Documentation',
            version: '1.0.0',
        },
        paths: {},
        components: {
            schemas: {},
            responses: {},
            parameters: {},
            examples: {},
            requestBodies: {},
            headers: {},
            securitySchemes: {},
            links: {},
            callbacks: {},
        },
        tags: [],
    };

    for (const [serviceName, url] of Object.entries(swaggerSources)) {
        console.log(`Attempting to fetch Swagger for ${serviceName} from ${url}`);
        try {
            const {data} = await axios.get(url);

            const componentMappings = {};
            if (data.components) {
                for (const componentType in data.components) {
                    if (!base.components[componentType]) {
                        base.components[componentType] = {};
                    }
                    for (const componentName in data.components[componentType]) {
                        const newComponentName = `${capitalizeFirstLetter(serviceName)}${componentName}`;
                        const originalRef = `#/components/${componentType}/${componentName}`;
                        const newRef = `#/components/${componentType}/${newComponentName}`;

                        base.components[componentType][newComponentName] = data.components[componentType][componentName];
                        componentMappings[originalRef] = newRef;
                    }
                }
            }

            if (data.paths) {
                for (const [path, methods] of Object.entries(data.paths)) {
                    const updatedMethods = JSON.parse(JSON.stringify(methods));
                    updateRefs(updatedMethods, componentMappings);
                    base.paths[path] = updatedMethods;
                }
            }


            if (data.tags) {
                base.tags.push(
                    ...data.tags.map(tag => ({
                        ...tag,
                        name: `${serviceName} - ${tag.name}`,
                    }))
                );
            }

            for (const pathItem of Object.values(base.paths)) {
                for (const operation of Object.values(pathItem)) {
                    if (operation.tags && Array.isArray(operation.tags)) {
                        operation.tags = operation.tags.map(tagName => {
                            const originalTag = data.tags?.find(t => t.name === tagName);
                            if (originalTag) {
                                return `${serviceName} - ${tagName}`;
                            }
                            return tagName;
                        }).filter((value, index, self) => self.indexOf(value) === index);
                    }
                }
            }


            console.log(`Successfully processed swagger for ${serviceName}`);

        } catch (err) {
            console.error(`Error processing swagger ${serviceName} from ${url}:`, err.message);
            if (err.response) {
                console.error('Error Status:', err.response.status);
            } else if (err.request) {
                console.error('Error Request: No response received');
            } else {
                console.error('Error Config:', err.config);
            }
        }
    }

    for (const componentType in base.components) {
        if (Object.keys(base.components[componentType]).length === 0) {
            delete base.components[componentType];
        }
    }


    return base;
}

router.use('/swagger-ui', swaggerUi.serve, async (req, res, next) => {
    try {
        const swaggerDocument = await getCombinedSwagger();
        if (!swaggerDocument || !swaggerDocument.paths) {
            console.error("Failed to generate combined swagger document.");
            return res.status(500).send("Failed to generate combined swagger document.");
        }
        swaggerUi.setup(swaggerDocument)(req, res, next);
    } catch (error) {
        console.error("Error in swagger-ui route handler:", error);
        next(error);
    }
});

export default router;
