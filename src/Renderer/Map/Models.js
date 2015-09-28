import WebGL from 'Utils/WebGL';

var _program = null;

var _vertexShader   = `
    attribute vec3 aPosition;
    attribute vec3 aVertexNormal;
    attribute vec2 aTextureCoord;
    attribute float aAlpha;
    varying vec2 vTextureCoord;
    varying float vLightWeighting;
    varying float vAlpha;
    uniform mat4 uModelViewMat;
    uniform mat4 uProjectionMat;
    uniform vec3 uLightDirection;
    uniform mat3 uNormalMat;
    void main(void) {
        gl_Position     = uProjectionMat * uModelViewMat * vec4( aPosition, 1.0);
        vTextureCoord   = aTextureCoord;
        vAlpha          = aAlpha;
        vec4 lDirection  = uModelViewMat * vec4( uLightDirection, 0.0);
        vec3 dirVector   = normalize(lDirection.xyz);
        float dotProduct = dot( uNormalMat * aVertexNormal, dirVector );
        vLightWeighting  = max( dotProduct, 0.5 );
    }
`;

var _fragmentShader = `
    varying vec2 vTextureCoord;
    varying float vLightWeighting;
    varying float vAlpha;
    uniform sampler2D uDiffuse;
    uniform bool  uFogUse;
    uniform float uFogNear;
    uniform float uFogFar;
    uniform vec3  uFogColor;
    uniform vec3  uLightAmbient;
    uniform vec3  uLightDiffuse;
    uniform float uLightOpacity;

    void main(void) {
        vec4 texture  = texture2D( uDiffuse,  vTextureCoord.st );

        if (texture.a == 0.0) {
            discard;
        }

        vec3 Ambient    = uLightAmbient * uLightOpacity;
        vec3 Diffuse    = uLightDiffuse * vLightWeighting;
        vec4 LightColor = vec4( Ambient + Diffuse, 1.0);
        gl_FragColor    = texture * clamp(LightColor, 0.0, 1.0);
        gl_FragColor.a *= vAlpha;

        if (uFogUse) {
            float depth     = gl_FragCoord.z / gl_FragCoord.w;
            float fogFactor = smoothstep( uFogNear, uFogFar, depth );
            gl_FragColor    = mix( gl_FragColor, vec4( uFogColor, gl_FragColor.w ), fogFactor );
        }
    }
`


export default class ModelRenderer {
    constructor(gl, data){
        var self = this;
        this._objects = [];
        this._buffer = gl.createBuffer();

        var objects = data.infos;

        if (!_program) {
            _program = WebGL.createShaderProgram( gl, _vertexShader, _fragmentShader );
        }

        gl.bindBuffer( gl.ARRAY_BUFFER, this._buffer );
        gl.bufferData( gl.ARRAY_BUFFER, data.buffer, gl.STATIC_DRAW );

        // Fetch all images, and draw them in a mega-texture
        this._objects = data.infos.map(objectInfo => {
            let obj = {
                vertCount: objectInfo.vertCount,
                vertOffset: objectInfo.vertOffset,
                complete: false
            };

            WebGL.texture(gl, objectInfo.texture, texture => {
                obj.texture  = texture;
                obj.complete = true;
            });
            return obj;
        });
    }

    render(gl, modelView, projection, normalMat, fog, light){
        var {uniform, attribute} = _program;

        gl.useProgram(_program);

        // Bind matrix
        gl.uniformMatrix4fv( uniform.uModelViewMat,  false, modelView );
        gl.uniformMatrix4fv( uniform.uProjectionMat, false, projection );
        gl.uniformMatrix3fv( uniform.uNormalMat,     false, normalMat );

        // Bind light
        gl.uniform3fv( uniform.uLightDirection, light.direction );
        gl.uniform1f(  uniform.uLightOpacity,   light.opacity );
        gl.uniform3fv( uniform.uLightAmbient,   light.ambient );
        gl.uniform3fv( uniform.uLightDiffuse,   light.diffuse );

        // Fog settings
        gl.uniform1i(  uniform.uFogUse,   fog.use && fog.exist );
        gl.uniform1f(  uniform.uFogNear,  fog.near );
        gl.uniform1f(  uniform.uFogFar,   fog.far );
        gl.uniform3fv( uniform.uFogColor, fog.color );

        // Enable all attributes
        gl.enableVertexAttribArray( attribute.aPosition );
        gl.enableVertexAttribArray( attribute.aVertexNormal );
        gl.enableVertexAttribArray( attribute.aTextureCoord );
        gl.enableVertexAttribArray( attribute.aAlpha );

        gl.bindBuffer( gl.ARRAY_BUFFER, this._buffer );

        // Link attribute
        gl.vertexAttribPointer( attribute.aPosition,      3, gl.FLOAT, false, 9*4, 0   );
        gl.vertexAttribPointer( attribute.aVertexNormal,  3, gl.FLOAT, false, 9*4, 3*4 );
        gl.vertexAttribPointer( attribute.aTextureCoord,  2, gl.FLOAT, false, 9*4, 6*4 );
        gl.vertexAttribPointer( attribute.aAlpha,         1, gl.FLOAT, false, 9*4, 8*4 );

        // Textures
        gl.activeTexture( gl.TEXTURE0 );
        gl.uniform1i( uniform.uDiffuse, 0 );

        for (let obj of this._objects) {
            if (obj.complete) {
                gl.bindTexture(gl.TEXTURE_2D, obj.texture);
                gl.drawArrays(gl.TRIANGLES, obj.vertOffset, obj.vertCount);
            }
        }

        // Is it needed ?
        gl.disableVertexAttribArray( attribute.aPosition );
        gl.disableVertexAttribArray( attribute.aVertexNormal );
        gl.disableVertexAttribArray( attribute.aTextureCoord );
        gl.disableVertexAttribArray( attribute.aAlpha );
    }

    free(gl){
        if (this._buffer) {
            gl.deleteBuffer(this._buffer);
            this._buffer = null;
        }

        // _program is global and might be used by other instances of ModelRenderer
        // in case you later decide to make _program an instance attribute, remember
        // to free it, ie. use these lines
        // if (_program) {
        //  gl.deleteProgram(_program);
        //  _program = null;
        // }

        for (let obj of this._objects) {
            gl.deleteTexture(obj.texture);
        }

        this._objects.length = 0;
    }

}