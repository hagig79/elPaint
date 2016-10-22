(function($) {
    'use strict';
    var down;
    var oldX;
    var oldY;
    var context;
    jQuery.fn.elPaint = function(el) {
        var canvas = document.createElement('canvas');
        var width = $(this).width();
        var height = $(this).height();
        $(canvas).attr('width', width).attr('height', height);
        context = canvas.getContext("2d");
        
        var _start = '';
        var _move = '';
        var _end = '';
        if (window.PointerEvent) {
            _start = 'pointerdown';
            _move = 'pointermove';
            _end = 'pointerup';
        } else if ('ontouchstart' in window) {
            _start = 'touchstart';
            _move = 'touchmove';
            _end = 'touchend';
        } else {
            _start = 'mousedown';
            _move = 'mousemove';
            _end = 'mouseup';
        }
        
        $(canvas).bind(_start, function(e) {
            var p = $(canvas).position();
            var event = e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0] : e;
            var x = event.clientX;
            var y = event.clientY;
            paintStart(x - p.left, y - p.top);
            e.preventDefault();
        });
        $(canvas).bind(_move, function(e) {
            if (down) {
                var p = $(canvas).position();
                var event = e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0] : e;
                var x = event.clientX;
                var y = event.clientY;
                paintMove(x - p.left, y - p.top);
            }
            e.preventDefault();
        });
        $(canvas).bind(_end, function(e) {
            paintEnd();
        })
        
        this.append(canvas);
    };
    
    function paintStart(x, y) {
        oldX = x;
        oldY = y;
        down = true;
    }
    
    function paintMove(newX, newY) {
        context.beginPath();
        context.lineJoin = context.lineCap = 'round';
        context.moveTo(oldX, oldY);
        context.lineTo(newX, newY);
        context.stroke();
        context.closePath();
        oldX = newX;
        oldY = newY;
    }
    
    function paintEnd() {
        down = false;
    }
})(jQuery);