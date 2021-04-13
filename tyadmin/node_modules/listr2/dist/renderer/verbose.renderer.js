"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerboseRenderer = void 0;
const logger_1 = require("../utils/logger");
class VerboseRenderer {
    constructor(tasks, options) {
        var _a, _b;
        this.tasks = tasks;
        this.options = options;
        if (!((_a = this.options) === null || _a === void 0 ? void 0 : _a.logger)) {
            this.logger = new logger_1.Logger({ useIcons: (_b = this.options) === null || _b === void 0 ? void 0 : _b.useIcons });
        }
        else {
            this.logger = new this.options.logger();
        }
        this.options = { ...VerboseRenderer.rendererOptions, ...this.options };
    }
    render() {
        this.verboseRenderer(this.tasks);
    }
    end() { }
    verboseRenderer(tasks) {
        return tasks === null || tasks === void 0 ? void 0 : tasks.forEach((task) => {
            task.subscribe((event) => {
                var _a, _b;
                if (task.isEnabled()) {
                    if (event.type === 'SUBTASK' && task.hasSubtasks()) {
                        this.verboseRenderer(task.subtasks);
                    }
                    else if (event.type === 'STATE') {
                        if (((_a = this.options) === null || _a === void 0 ? void 0 : _a.logEmptyTitle) !== false || task.hasTitle()) {
                            const taskTitle = task.hasTitle() ? task.title : 'Task without title.';
                            if (task.isPending()) {
                                this.logger.start(taskTitle);
                            }
                            else if (task.isCompleted()) {
                                this.logger.success(taskTitle);
                            }
                            else if (task.isSkipped()) {
                                this.logger.skip(task.output);
                            }
                        }
                    }
                    else if (event.type === 'DATA') {
                        if (task.hasFailed()) {
                            this.logger.fail(String(event.data));
                        }
                        else if (task.isSkipped()) {
                            this.logger.skip(String(event.data));
                        }
                        else {
                            this.logger.data(String(event.data));
                        }
                    }
                    else if (event.type === 'TITLE') {
                        if (((_b = this.options) === null || _b === void 0 ? void 0 : _b.logTitleChange) !== false) {
                            this.logger.title(String(event.data));
                        }
                    }
                }
            }, (err) => {
                this.logger.fail(err);
            });
        });
    }
}
exports.VerboseRenderer = VerboseRenderer;
VerboseRenderer.nonTTY = true;
VerboseRenderer.rendererOptions = {
    useIcons: false,
    logEmptyTitle: true,
    logTitleChange: true
};
//# sourceMappingURL=verbose.renderer.js.map