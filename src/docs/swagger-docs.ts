import fs from 'node:fs';
import type { Express } from 'express';
import swaggerUi from 'swagger-ui-express';

const openApiSpec = JSON.parse(
    fs.readFileSync(new URL('../../docs/openapi.json', import.meta.url), 'utf-8')
) as Record<string, unknown>;

export const mountDocs = (app: Express): void => {
    app.get('/api/docs', (req, res, next) => {
        const acceptsJson = req.accepts(['json', 'html']) === 'json';
        const isPostman = (req.get('user-agent') ?? '').toLowerCase().includes('postmanruntime');
        const wantsJson = req.query.format === 'json' || acceptsJson || isPostman;

        if (wantsJson) {
            res.json(openApiSpec);
            return;
        }

        next();
    });

    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec, {
        customSiteTitle: 'Expense Reimbursement API Docs',
        swaggerOptions: {
            persistAuthorization: true,
            displayRequestDuration: true,
        },
    }));
};
