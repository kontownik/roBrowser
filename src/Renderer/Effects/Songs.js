import {HoveringTexture} from 'es6!Renderer/Effects/Tiles';
import FlatColorTile from 'Renderer/Effects/FlatColorTile';


export const AppleEffects = [
    FlatColorTile('yellow', {r: 1.0, g: 1.0, b: 0, a: 0.05}),
    HoveringTexture('data/texture/effect/idun_apple.bmp')
];
