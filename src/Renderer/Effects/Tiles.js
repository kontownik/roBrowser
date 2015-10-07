import WebGL from 'Utils/WebGL';
import Texture from 'Utils/Texture';
import glMatrix from 'Utils/gl-matrix';
import Client from 'Core/Client';

const mat4 = glMatrix.mat4;

export var flatTextureVertexShader   = `
        attribute vec2 aPosition;
        attribute vec2 aTextureCoord;
        varying vec2 vTextureCoord;
        uniform mat4 uModelViewMat;
        uniform mat4 uProjectionMat;
        uniform vec3 uPosition;

        void main(void) {
            vec4 position  = vec4(uPosition.x + 0.5, -uPosition.z, uPosition.y + 0.5, 1.0);
            position      += vec4(aPosition.x, 0.0, aPosition.y, 0.0);
            gl_Position    = uProjectionMat * uModelViewMat * position;
            gl_Position.z -= 0.01;
            vTextureCoord  = aTextureCoord;
        }
`;

export var flatTextureFragmentShader = `
        varying vec2 vTextureCoord;
        uniform sampler2D uDiffuse;
        void main(void) {
            vec4 texture = texture2D( uDiffuse,  vTextureCoord.st );
            if (texture.r < 0.3 || texture.g < 0.3 || texture.b < 0.3) {
               discard;
            }
            texture.a = 0.7;
            gl_FragColor = texture;
        }
`;


export function loadTexture(gl, texture, cb){

    var _texture = gl.createTexture();

    Client.loadFile(texture.filename, function(buffer) {
        Texture.load(buffer, function() {
            var size = texture.size;
            var canvas = document.createElement('canvas');
            canvas.width = canvas.height = size;

            var ctx = canvas.getContext('2d');

            ctx.save();

            ctx.translate(  canvas.width/2,  canvas.height/2 );
            ctx.rotate(Math.PI);
            ctx.translate( -canvas.width/2, -canvas.height/2 );

            ctx.drawImage(this, 0, 0, size, size);
            ctx.restore();

            gl.bindTexture( gl.TEXTURE_2D, _texture );
            gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
            gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.generateMipmap( gl.TEXTURE_2D );

            cb(_texture)
        });
    });
}


export var FlatTexture = (textureFilename, size=64) => class {
    static get renderBeforeEntities(){
        return true;
    }

    static createShaderProgram(gl){
        return WebGL.createShaderProgram( gl, flatTextureVertexShader, flatTextureFragmentShader );
    }
    static init(gl){
        var self = this;

        this._program = this.createShaderProgram(gl);
        this._buffer  = gl.createBuffer();
        this._texture = null;

        gl.bindBuffer( gl.ARRAY_BUFFER, this._buffer );
        gl.bufferData( gl.ARRAY_BUFFER, new Float32Array([
            -1.0, -1.0, 0.0, 0.0,
            +1.0, -1.0, 1.0, 0.0,
            +1.0, +1.0, 1.0, 1.0,
            +1.0, +1.0, 1.0, 1.0,
            -1.0, +1.0, 0.0, 1.0,
            -1.0, -1.0, 0.0, 0.0
        ]), gl.STATIC_DRAW );

        loadTexture(gl, {filename: textureFilename, size}, texture => {
            self._texture = texture;
            self.ready = true;
        })
    }

    static free(gl){
        if (this._texture) {
            gl.deleteTexture(this._texture);
            this._texture = null;
        }

        if (this._program) {
            gl.deleteProgram(this._program);
            this._program = null;
        }

        if (this._buffer) {
            gl.deleteBuffer(this._buffer);
            this._buffer = null;
        }

        this.ready = false;
    }

    static beforeRender(gl, modelView, projection, fog, tick){
        var uniform   = this._program.uniform;
        var attribute = this._program.attribute;


        gl.useProgram( this._program );

        // Bind matrix
        gl.uniformMatrix4fv( uniform.uModelViewMat,  false, modelView );
        gl.uniformMatrix4fv( uniform.uProjectionMat, false, projection );

        // Texture
        gl.activeTexture( gl.TEXTURE0 );
        gl.bindTexture( gl.TEXTURE_2D, this._texture );
        gl.uniform1i( uniform.uDiffuse, 0 );

        // Enable all attributes
        gl.enableVertexAttribArray( attribute.aPosition );
        gl.enableVertexAttribArray( attribute.aTextureCoord );

        gl.bindBuffer( gl.ARRAY_BUFFER, this._buffer );

        gl.vertexAttribPointer( attribute.aPosition,     2, gl.FLOAT, false, 4*4,  0   );
        gl.vertexAttribPointer( attribute.aTextureCoord, 2, gl.FLOAT, false, 4*4,  2*4 );

        gl.depthMask(false);
    }

    static afterRender(gl) {
        gl.depthMask(true);
        gl.disableVertexAttribArray( this._program.attribute.aPosition );
        gl.disableVertexAttribArray( this._program.attribute.aTextureCoord );
    }

    constructor(pos, startLifeTime){
        this.position = pos;
    }

    init(){
        this.ready = true;
    }

    free(){
        this.ready = false;
    }

    render(gl, tick){
        gl.uniform3fv( this.constructor._program.uniform.uPosition,  this.position);
        gl.bindBuffer( gl.ARRAY_BUFFER, this.constructor._buffer );
        gl.drawArrays( gl.TRIANGLES, 0, 6 );
    }
}



var _hoveringNum = 0;
export var HoveringTexture = textureFilename => class extends FlatTexture(textureFilename){
    constructor(){
        super(...arguments);
        this.ix = ++_hoveringNum;
    }

    render(gl, tick){
        var oddEven = (this.ix % 2 === 0) ? Math.PI : 0;
        var heightMult = Math.sin(oddEven + (tick / (540 * Math.PI)));
        var position = [
            this.position[0],
            this.position[1],
            0.4 - 0.2 * heightMult
        ];

        gl.uniform3fv( this.constructor._program.uniform.uPosition, position);
        gl.bindBuffer( gl.ARRAY_BUFFER, this.constructor._buffer );
        gl.drawArrays( gl.TRIANGLES, 0, 6 );
    }
}
