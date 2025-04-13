import express from 'express';
import swaggerUi from 'swagger-ui-express';
import axios from 'axios';
import dotenv from "dotenv";

const router = express.Router();

dotenv.config();

const catalogService = process.env.CATALOG_URL;

const swaggerSources = {
    catalog: `${catalogService}/swagger/swagger.json`,
};

async function getCombinedSwagger() {
    const base = {
        openapi: '3.0.0',
        info: {
            title: 'API Gateway - Documentation',
            version: '1.0.0',
        },
        paths: {},
        components: {},
        tags: [],
    };

    for (const [name, url] of Object.entries(swaggerSources)) {
        try {
            const {data} = await axios.get(url);

            for (const [path, methods] of Object.entries(data.paths)) {
                base.paths[`/${name}${path}`] = methods;
            }

            if (data.tags) {
                base.tags.push(
                    ...data.tags.map(tag => ({
                        ...tag,
                        name: `${name} - ${tag.name}`,
                    }))
                );
            }

            if (data.components) {
                base.components = {
                    ...base.components,
                    ...data.components,
                };
            }
        } catch (err) {
            console.error(`Error while loading swagger ${name}:`, err.message);
        }
    }

    return base;
}

router.use('/swagger-ui', swaggerUi.serve, async (req, res) => {
    const swaggerDocument = await getCombinedSwagger();
    swaggerUi.setup(swaggerDocument)(req, res);
});

export default router;
