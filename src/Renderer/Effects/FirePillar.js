import Cylinder from 'Renderer/Effects/Cylinder';

export default class FirePillarEffect {

    static get renderBeforeEntities() {
        return true;
    }

    static init(gl){
        Cylinder.init(gl);
        this.ready = true;
    }

    static free(gl){
        this.ready = false;
        Cylinder.free(gl);
    }

    static beforeRender(){
        Cylinder.beforeRender(...arguments);
    }

    static afterRender(){
        Cylinder.afterRender(...arguments);
    }

    constructor(pos, tick, AID){
        this.cylinders = [
            new Cylinder(pos, 1.0, 0.5, 7, 'magic_red', tick),
            new Cylinder(pos, 1.5, 0.7, 5, 'magic_red', tick),
            new Cylinder(pos, 2.0, 1.0, 3, 'magic_red', tick)
        ]
    }

    init(gl){
        for (let cylinder of this.cylinders){
            cylinder.init(gl);
        }
        this.ready = true;
    }

    free(gl){
        this.ready = false;
        for (let cylinder of this.cylinders){
            cylinder.free(gl);
        }
    }

    render(){
        for (let cylinder of this.cylinders){
            cylinder.render(...arguments);
        }
    }
}
