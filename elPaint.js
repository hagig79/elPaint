(function($) {
    'use strict';
    var down;
    var oldX;
    var oldY;
    var context;
    $.fn.elPaint = function() {
        var canvas = document.createElement('canvas');
        var width = $(this).width();
        var height = $(this).height();
        $(canvas).attr('width', width).attr('height', height);
        context = canvas.getContext("2d");
        
        var _start = '';
        var _move = '';
        var _end = '';
        var _enter = '';
        var _out = '';
        if (window.PointerEvent) {
            _start = 'pointerdown';
            _move = 'pointermove';
            _end = 'pointerup';
            _enter = 'pointerenter';
            _out = 'pointerout';
        } else if ('ontouchstart' in window) {
            _start = 'touchstart';
            _move = 'touchmove';
            _end = 'touchend';
        } else {
            _start = 'mousedown';
            _move = 'mousemove';
            _end = 'mouseup';
            _enter = 'mouseenter';
            _out = 'mouseout';
        }
        
        $(canvas).bind(_start, function(e) {
            var p = $(canvas).position();
            var event = e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0] : e;
            var x = event.clientX;
            var y = event.clientY;
            paintStart(x - p.left, y - p.top);
            e.preventDefault();
        });
        if (_enter) {
            $(canvas).bind(_enter, function(e) {
                if (e.buttons > 0) {
                    var p = $(canvas).position();
                    var event = e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0] : e;
                    var x = event.clientX;
                    var y = event.clientY;
                    paintStart(x - p.left, y - p.top);
                    e.preventDefault();
                }
            });
        }
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
        });
        if (_out) {
            $(canvas).bind(_out, function(e) {
                paintEnd();
            });
        }
        this.append($('<input name="tool" type="radio" value="pen" checked>pen</input>'));
        this.append($('<input name="tool" type="radio" value="eraser">eraser</input>'));
        $('input[name="tool"]').change(function() {
            if ($(this).val() === 'pen') {
                context.strokeStyle = 'rgb(0, 0, 0)';
                context.lineWidth = 10;
                context.globalCompositeOperation = 'source-over';
                airbrush = false;
            } else if ($(this).val() === 'eraser') {
                context.lineWidth = 10;
                context.globalCompositeOperation = 'destination-out';
                airbrush = false;
            }
        });
        context.strokeStyle = 'rgb(0, 0, 0)';
        context.lineWidth = 10;
        
        this.append(canvas);
        
        return this;
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