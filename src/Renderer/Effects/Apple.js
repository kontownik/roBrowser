import WebGL from 'Utils/WebGL';
import Texture from 'Utils/Texture';
import glMatrix from 'Utils/gl-matrix';
import Client from 'Core/Client';

const mat4 = glMatrix.mat4;

var _texture;
var _program;
var _buffer;
var _matrix = mat4.create();

var _vertexShader   = `
        attribute vec2 aPosition;
        attribute vec2 aTextureCoord;
        varying vec2 vTextureCoord;
        uniform mat4 uModelViewMat;
        uniform mat4 uProjectionMat;
        uniform vec3 uPosition;

        uniform float uHeight;

        void main(void) {
            vec4 position  = vec4(uPosition.x + 0.5, -uPosition.z, uPosition.y + 0.5, 1.0);
            position      += vec4(aPosition.x, uHeight, aPosition.y, 0.0);
            gl_Position    = uProjectionMat * uModelViewMat * position;
            gl_Position.z -= 0.01;
            vTextureCoord  = aTextureCoord;
        }
`;
var _fragmentShader = `
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


var _num = 0;

class Apple {

    static init(gl){
        _program = WebGL.createShaderProgram( gl, _vertexShader, _fragmentShader );
        _buffer  = gl.createBuffer();

        gl.bindBuffer( gl.ARRAY_BUFFER, _buffer );
        gl.bufferData( gl.ARRAY_BUFFER, new Float32Array([
            -1.0, -1.0, 0.0, 0.0,
            +1.0, -1.0, 1.0, 0.0,
            +1.0, +1.0, 1.0, 1.0,
            +1.0, +1.0, 1.0, 1.0,
            -1.0, +1.0, 0.0, 1.0,
            -1.0, -1.0, 0.0, 0.0
        ]), gl.STATIC_DRAW );

        Client.loadFile('data/texture/effect/idun_apple.bmp', function(buffer) {
            Texture.load(buffer, function() {
                var canvas = document.createElement('canvas');
                canvas.width = canvas.height = 64;

                var ctx = canvas.getContext('2d');

                ctx.save();

                ctx.translate(  canvas.width/2,  canvas.height/2 );
                ctx.rotate(Math.PI);
                ctx.translate( -canvas.width/2, -canvas.height/2 );

                ctx.drawImage(this, 0, 0, 64, 64);
                ctx.restore();

                _texture = gl.createTexture();
                gl.bindTexture( gl.TEXTURE_2D, _texture );
                gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
                gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.generateMipmap( gl.TEXTURE_2D );

                Apple.ready = true;
            });
        });
    }

    static free(gl){
        if (_texture) {
            gl.deleteTexture(_texture);
            _texture = null;
        }

        if (_program) {
            gl.deleteProgram(_program);
            _program = null;
        }

        if (_buffer) {
            gl.deleteBuffer(_buffer);
        }

        this.ready = false;
    }

    static beforeRender(gl, modelView, projection, fog, tick){
        var uniform   = _program.uniform;
        var attribute = _program.attribute;

        mat4.identity(_matrix);

        gl.useProgram( _program );

        // Bind matrix
        gl.uniformMatrix4fv( uniform.uModelViewMat,  false, modelView );
        gl.uniformMatrix4fv( uniform.uProjectionMat, false, projection );

        // Texture
        gl.activeTexture( gl.TEXTURE0 );
        gl.bindTexture( gl.TEXTURE_2D, _texture );
        gl.uniform1i( uniform.uDiffuse, 0 );

        // Enable all attributes
        gl.enableVertexAttribArray( attribute.aPosition );
        gl.enableVertexAttribArray( attribute.aTextureCoord );

        gl.bindBuffer( gl.ARRAY_BUFFER, _buffer );

        gl.vertexAttribPointer( attribute.aPosition,     2, gl.FLOAT, false, 4*4,  0   );
        gl.vertexAttribPointer( attribute.aTextureCoord, 2, gl.FLOAT, false, 4*4,  2*4 );

        gl.depthMask(false);
    }

    static afterRender(gl) {
        gl.depthMask(true);
        gl.disableVertexAttribArray( _program.attribute.aPosition );
        gl.disableVertexAttribArray( _program.attribute.aTextureCoord );
    }

    constructor(pos, startLifeTime){
        this.position = pos;
        this.ix = _num++;
    }

    init(){
        this.ready = true;
    }

    free(){
        this.ready = false;
    }

    render(gl, tick){

        var oddEven = (this.ix % 2 === 0) ? Math.PI : 0;
        var heightMult = Math.sin(oddEven + (tick / (360 * Math.PI)));

        gl.uniform3fv( _program.uniform.uPosition,  this.position);
        gl.uniform1f(_program.uniform.uHeight, -0.3 - 0.2 * heightMult);

        gl.bindBuffer( gl.ARRAY_BUFFER, _buffer );
        gl.drawArrays( gl.TRIANGLES, 0, 6 );
    }
}


Apple.renderBeforeEntities = true;

export default Apple;