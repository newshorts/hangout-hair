/* 
 *  Hair Demo in a hangout session - this shit has to be efficient
 */


var App = function(canvas) {
    var _canvas = canvas,
        _ctx = _canvas.getContext('2d');
        
    engine = new RenderEngine();
    
    for(var i = 0; i < 20; i++) {
        engine.addRope();
    }
    
    engine.render();
    
    setInterval(engine.render(), 1000 / 60);
};