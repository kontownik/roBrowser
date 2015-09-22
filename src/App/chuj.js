/**
 * App/MapViewer.js
 *
 * Start a hacked map-viewer
 *
 * This file is part of ROBrowser, Ragnarok Online in the Web Browser (http://www.robrowser.com/).
 *
 * @author Vincent Thibault
 */

// Errors Handler (hack)
require.onError = function (err) {
    'use strict';

    if (require.defined('UI/Components/Error/Error')) {
        require('UI/Components/Error/Error').addTrace(err);
        return;
    }

    require(['UI/Components/Error/Error'], function( Errors ){
        Errors.addTrace(err);
    });
};


require({
    baseUrl: './src/',
    paths: {
        text:   'Vendors/text.require',
        jquery: 'Vendors/jquery-1.9.1'
    },
    urlArgs: Math.random()
},
    ['Utils/Queue',
     'Core/Configs', 'Core/Client', 'Core/Thread',
     'Audio/BGM',
     'Engine/SessionStorage',
     'Renderer/Renderer', 'Renderer/MapRenderer', 'Renderer/Camera', 'Renderer/Map/Altitude', 'Renderer/Entity/Entity',
     'Controls/MouseEventHandler', 'Controls/MapControl',
     "Renderer/EffectManager",
     ""],

function(
    Queue,
    Configs, Client, Thread,
    BGM,
    Session,
    Renderer, MapRenderer, Camera, Altitude, Entity,
    Mouse, MapControl,
    EffectManager
) {
    'use strict';


    /**
     * MapViewer namespace
     */
    var MapViewer = {};


    /**
     * @var {object} Entity to target
     */
    MapViewer.spot = Session.Entity = new Entity();


    /**
     * @var {HTMLElement} <select>
     */
    MapViewer.dropDown = null;


    /**
     * Initialize MapViewer
     */
    MapViewer.init = function Init()
    {
        // Increase max intersection test (because of the max zoom)
        Altitude.MAX_INTERSECT_COUNT = 500;

        var ready     = false;
        var maptoload = '';
        var q         = new Queue();

        // Waiting for the Thread to be ready
        q.add(function(){
            BGM.setAvailableExtensions(['mp3']);
            Thread.hook('THREAD_READY', q.next );
            Thread.init();
        });

        // Initialize renderer
        q.add(function(){
            Renderer.init();
            q._next();
        });

        q.add(function(){
            Client.init([]);
            Client.onFilesLoaded = q.next;
        });

        q.add(function(){
            MapRenderer.onLoad = MapViewer.onLoad;
            MapControl.init();
            MapControl.onRequestWalk = MapViewer.onMouseDown;
            MapRenderer.setMap('guild_vs4.rsw');
        });

        q.run();
    };


    /**
     * Once map is ready to render
     */
    MapViewer.onLoad = function()
    {
        BGM.stop();


        MapViewer.spot.position[0] = Altitude.width  >> 1;
        MapViewer.spot.position[1] = Altitude.height >> 1;
        MapViewer.spot.position[2] = Altitude.getCellHeight( MapViewer.spot.position[0], MapViewer.spot.position[1] );

        Camera.setTarget( MapViewer.spot );
        Camera.init();

        Camera.altitudeTo = -200;
        Camera.zoomFinal  =  200;
    };

    MapViewer.onMouseDown = function OnMouseDown()
    {

        var LPEffect = require('Renderer/Effects/LPEffect');
        EffectManager.add(new LPEffect([Mouse.world.x, Mouse.world.y, Mouse.world.z], +new Date()), 1234);



        if (Mouse.world.x > -1 && Mouse.world.y > -1) {
            MapViewer.spot.position[0] = Mouse.world.x;
            MapViewer.spot.position[1] = Mouse.world.y;
            MapViewer.spot.position[2] = Mouse.world.z;
        }
    };


    MapViewer.init();
});