import app from '../app';
import 'dotenv/config';

const printRoutes = () => {
    console.log('Registered Routes:');

    app._router.stack.forEach((middleware: any) => {
        if (middleware.route) { // routes registered directly on the app
            console.log(`${Object.keys(middleware.route.methods).join(', ').toUpperCase()} ${middleware.route.path}`);
        } else if (middleware.name === 'router') { // router middleware 
            middleware.handle.stack.forEach((handler: any) => {
                const method = handler.route ? Object.keys(handler.route.methods).join(', ').toUpperCase() : '';
                const path = handler.route ? handler.route.path : '';
                const regex = middleware.regexp.toString();
                // This is a rough estimation of the mount point
                const mount = regex.replace('^\\', '').replace('\\/?(?=\\/|$)', '').replace('/^\\/api\\/v1\\//i', '/api/v1/');

                console.log(`[Router] ${method} ${path} (regex: ${middleware.regexp})`);
            });
        }
    });
};

printRoutes();
