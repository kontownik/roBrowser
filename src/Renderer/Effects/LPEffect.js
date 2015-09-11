define(function( require ) {

    'use strict';


    // Load dependencies
    var WebGL    = require('Utils/WebGL');
    var Texture  = require('Utils/Texture');
    var glMatrix = require('Utils/gl-matrix');
    var Client   = require('Core/Client');


    /**
     * @var {WebGLTexture}
     */
    var _texture;


    /**
     * @var {WebGLProgram}
     */
    var _program;


    /**
     * @var {WebGLBuffer}
     */
    var _buffer;


    /**
     * @var {mat4}
     */
    var mat4 = glMatrix.mat4;


    /**
     * @var {mat4} rotation matrix
     */
    var _matrix = mat4.create();


    /**
     * @var {string} Vertex Shader
     */
    var z = Math.random() * 0.01;
    var _vertexShader   = [
        'attribute vec2 aPosition;',
        'attribute vec2 aTextureCoord;',

        'varying vec2 vTextureCoord;',

        'uniform mat4 uModelViewMat;',
        'uniform mat4 uProjectionMat;',
        'uniform mat4 uRotationMat;',

        'uniform vec3 uPosition;',
        'uniform float uSize;',

        'void main(void) {',
            'vec4 position  = vec4(uPosition.x + 0.5, -uPosition.z, uPosition.y + 0.5, 1.0);',
            'position      += vec4(aPosition.x * uSize, 0.0, aPosition.y * uSize, 0.0) * uRotationMat;',

            'gl_Position    = uProjectionMat * uModelViewMat * position;',
            'gl_Position.z -= ' + z + ';',

            'vTextureCoord  = aTextureCoord;',
        '}'
    ].join('\n');


    /**
     * @var {string} Fragment Shader
     */
    var _fragmentShader = [
        'varying vec2 vTextureCoord;',

        'uniform sampler2D uDiffuse;',


        'void main(void) {',
            'vec4 texture = texture2D( uDiffuse,  vTextureCoord.st );',

            'if (texture.r < 0.3 || texture.g < 0.3 || texture.b < 0.3) {',
            '   discard;',
            '}',
            'texture.a = 0.7;',
            'gl_FragColor     = texture;',

        '}'
    ].join('\n');



    function LPEffect(pos, startLifeTime)
    {
        this.position = pos;
        this.startLifeTime = startLifeTime;
    }


    LPEffect.prototype.init = function init( gl )
    {
        this.ready  = true;
    };

    LPEffect.prototype.free = function free( gl )
    {
        this.ready = false;
    };


    LPEffect.prototype.render = function render( gl, tick )
    {
        gl.uniform3fv( _program.uniform.uPosition,  this.position);

        var time = tick - this.startLifeTime;

        var sizeMult = Math.sin(tick / (540*Math.PI));
        gl.uniform1f(  _program.uniform.uSize, 1.4 + 0.1 * sizeMult);

        gl.bindBuffer( gl.ARRAY_BUFFER, _buffer );
        gl.drawArrays( gl.TRIANGLES, 0, 6 );

    };
    var Altitude = require('Renderer/Map/Altitude');
    LPEffect.init = function init(gl)
    {
        _program = WebGL.createShaderProgram( gl, _vertexShader, _fragmentShader );
        _buffer  = gl.createBuffer();

        gl.bindBuffer( gl.ARRAY_BUFFER, _buffer );
        gl.bufferData( gl.ARRAY_BUFFER, new Float32Array([
            -0.5, -0.5, 0.0, 0.0,
            +0.5, -0.5, 1.0, 0.0,
            +0.5, +0.5, 1.0, 1.0,
            +0.5, +0.5, 1.0, 1.0,
            -0.5, +0.5, 0.0, 1.0,
            -0.5, -0.5, 0.0, 0.0
        ]), gl.STATIC_DRAW );

        Client.loadFile('data/texture/effect/aaa copy.bmp', function(buffer) {
            Texture.load(buffer, function() {
                var ctx = this.getContext('2d');
                ctx.save();
                ctx.translate(  this.width/2,  this.height/2 );
                // ctx.rotate( 45 / 180 * Math.PI);
                ctx.translate( -this.width/2, -this.height/2 );
                ctx.drawImage( this, 0, 0);
                ctx.restore();

                _texture = gl.createTexture();
                gl.bindTexture( gl.TEXTURE_2D, _texture );
                gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this);
                gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.generateMipmap( gl.TEXTURE_2D );

                LPEffect.ready = true;
            });
        });
    };


    LPEffect.renderBeforeEntities = true;


    /**
     * Destroy objects
     *
     * @param {object} webgl context
     */
    LPEffect.free = function free(gl)
    {
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
    };


    /**
     * Before render, set up program
     *
     * @param {object} webgl context
     */
    LPEffect.beforeRender = function beforeRender(gl, modelView, projection, fog, tick)
    {
        var uniform   = _program.uniform;
        var attribute = _program.attribute;

        mat4.identity(_matrix);
        // mat4.rotateY( _matrix, _matrix, (tick/4) / 180 * Math.PI);

        gl.useProgram( _program );

        // Bind matrix
        gl.uniformMatrix4fv( uniform.uModelViewMat,  false, modelView );
        gl.uniformMatrix4fv( uniform.uProjectionMat, false, projection );
        gl.uniformMatrix4fv( uniform.uRotationMat,   false, _matrix);

        // Fog settings
        gl.uniform1i(  uniform.uFogUse,   fog.use && fog.exist );
        gl.uniform1f(  uniform.uFogNear,  fog.near );
        gl.uniform1f(  uniform.uFogFar,   fog.far  );
        gl.uniform3fv( uniform.uFogColor, fog.color );

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
    };


    /**
     * After render, clean attributes
     *
     * @param {object} webgl context
     */
    LPEffect.afterRender = function afterRender(gl)
    {
        gl.disableVertexAttribArray( _program.attribute.aPosition );
        gl.disableVertexAttribArray( _program.attribute.aTextureCoord );
    };


    /**
     * Export
     */
    return LPEffect;
});