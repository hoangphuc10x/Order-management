import { Router } from 'express';

export abstract class BaseRoutes {
    protected router: Router;

    constructor() {
        this.router = Router();
        this.autoBindControllerMethods();
    }

    // Automatically bind all controller methods to the instance
    protected autoBindControllerMethods() {
        const prototype = Object.getPrototypeOf(this);
        const methodNames = Object.getOwnPropertyNames(prototype)
            .filter(name => typeof (this as any)[name] === 'function' && name !== 'constructor');

        methodNames.forEach(name => {
            (this as any)[name] = (this as any)[name].bind(this);
        });
    }

    public getRouter(): Router {
        return this.router;
    }
}
