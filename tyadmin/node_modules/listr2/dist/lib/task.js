"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
const rxjs_1 = require("rxjs");
const stream_1 = require("stream");
const listr_interface_1 = require("../interfaces/listr.interface");
const state_constants_1 = require("../interfaces/state.constants");
const index_1 = require("../index");
const renderer_1 = require("../utils/renderer");
class Task extends rxjs_1.Subject {
    constructor(listr, tasks, options, rendererOptions) {
        var _a, _b, _c;
        super();
        this.listr = listr;
        this.tasks = tasks;
        this.options = options;
        this.rendererOptions = rendererOptions;
        this.id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 || 0;
            const v = c === 'x' ? r : r && 0x3 || 0x8;
            return v.toString(16);
        });
        this.title = (_a = this.tasks) === null || _a === void 0 ? void 0 : _a.title;
        this.task = this.tasks.task;
        this.skip = ((_b = this.tasks) === null || _b === void 0 ? void 0 : _b.skip) || (() => false);
        this.enabledFn = ((_c = this.tasks) === null || _c === void 0 ? void 0 : _c.enabled) || (() => true);
        this.rendererTaskOptions = this.tasks.options;
        this.renderHook$ = this.listr.renderHook$;
        this.subscribe(() => {
            this.renderHook$.next();
        });
    }
    set state$(state) {
        this.state = state;
        this.next({
            type: 'STATE',
            data: state
        });
    }
    async check(ctx) {
        if (this.state === undefined) {
            if (typeof this.enabledFn === 'function') {
                this.enabled = await this.enabledFn(ctx);
            }
            else {
                this.enabled = this.enabledFn;
            }
            this.next({
                type: 'ENABLED',
                data: this.enabled
            });
        }
    }
    hasSubtasks() {
        var _a;
        return ((_a = this.subtasks) === null || _a === void 0 ? void 0 : _a.length) > 0;
    }
    isPending() {
        return this.state === state_constants_1.stateConstants.PENDING;
    }
    isSkipped() {
        return this.state === state_constants_1.stateConstants.SKIPPED;
    }
    isCompleted() {
        return this.state === state_constants_1.stateConstants.COMPLETED;
    }
    hasFailed() {
        return this.state === state_constants_1.stateConstants.FAILED;
    }
    isEnabled() {
        return this.enabled;
    }
    hasTitle() {
        return typeof (this === null || this === void 0 ? void 0 : this.title) === 'string';
    }
    isPrompt() {
        if (this.prompt) {
            return true;
        }
        else {
            return false;
        }
    }
    async run(context, wrapper) {
        const handleResult = (result) => {
            if (result instanceof index_1.Listr) {
                result.options = { ...this.options, ...result.options };
                const rendererClass = renderer_1.getRenderer('silent');
                result.rendererClass = rendererClass.renderer;
                result.renderHook$.subscribe(() => {
                    this.renderHook$.next();
                });
                this.subtasks = result.tasks;
                this.next({ type: 'SUBTASK' });
                result = result.run(context);
            }
            else if (this.isPrompt()) {
            }
            else if (result instanceof Promise) {
                result = result.then(handleResult);
            }
            else if (result instanceof stream_1.Readable) {
                result = new Promise((resolve, reject) => {
                    result.on('data', (data) => {
                        this.output = data.toString();
                        this.next({
                            type: 'DATA',
                            data: data.toString()
                        });
                    });
                    result.on('error', (error) => reject(error));
                    result.on('end', () => resolve());
                });
            }
            else if (result instanceof rxjs_1.Observable) {
                result = new Promise((resolve, reject) => {
                    result.subscribe({
                        next: (data) => {
                            this.output = data;
                            this.next({
                                type: 'DATA',
                                data
                            });
                        },
                        error: reject,
                        complete: resolve
                    });
                });
            }
            return result;
        };
        this.state$ = state_constants_1.stateConstants.PENDING;
        let skipped;
        if (typeof this.skip === 'function') {
            skipped = await this.skip(context);
        }
        if (skipped) {
            if (typeof skipped === 'string') {
                this.output = skipped;
            }
            else if (this.hasTitle()) {
                this.output = this.title;
            }
            this.state$ = state_constants_1.stateConstants.SKIPPED;
            return;
        }
        try {
            await handleResult(this.task(context, wrapper));
            if (this.isPending()) {
                this.state$ = state_constants_1.stateConstants.COMPLETED;
            }
        }
        catch (error) {
            this.state$ = state_constants_1.stateConstants.FAILED;
            if (this.prompt instanceof listr_interface_1.PromptError) {
                error = new Error(this.prompt.message);
            }
            if (error instanceof listr_interface_1.ListrError) {
                wrapper.report(error);
                return;
            }
            if (!this.hasSubtasks()) {
                this.title = error.message;
            }
            wrapper.report(error);
            if (this.listr.options.exitOnError !== false) {
                throw error;
            }
        }
        finally {
            this.complete();
        }
    }
}
exports.Task = Task;
//# sourceMappingURL=task.js.map