
export class InteractiveComponentGrp extends fabric.Group {
    constructor(objects, options) {
        super(objects, options);
        this.active = false;
    }
    _render(ctx) {
        super._render(ctx);
    }
    activate() {
        this.active = true;
        if (this.onActivate) {
            this.onActivate();
        }
    }
    deactivate() {
        this.active = false;
        if (this.onDeactivate) {
            this.onDeactivate();
        }
    }
}
