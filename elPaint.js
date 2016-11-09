(function($) {
    'use strict';
    var down;
    var oldX;
    var oldY;
    var context;
    var penSize;
    var eraserSize;
    $.fn.elPaint = function(options) {
    
        options = $.extend(true, {}, defaults, options);
        
        var canvas = document.createElement('canvas');
        $(canvas).attr('width', options.canvasWidth).attr('height', options.canvasHeight);
        context = canvas.getContext('2d');
        
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
            if ('ontouchstart' in window) {
                $(canvas).bind('touchmove', function(e) {
                    e.preventDefault();
                });
            }
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
        $(canvas).bind(_end, function() {
            paintEnd();
        });
        if (_out) {
            $(canvas).bind(_out, function() {
                paintEnd();
            });
        }
        this.append($('<input name="tool" type="radio" value="pen" checked>pen</input>'));
        this.append($('<input name="tool" type="radio" value="eraser">eraser</input>'));
        $('input[name="tool"]').change(function() {
            if ($(this).val() === 'pen') {
                context.strokeStyle = 'rgb(0, 0, 0)';
                context.lineWidth = penSize;
                context.globalCompositeOperation = 'source-over';
                $('#brush_size').val(penSize);
            } else if ($(this).val() === 'eraser') {
                context.lineWidth = eraserSize;
                context.globalCompositeOperation = 'destination-out';
                $('#brush_size').val(eraserSize);
            }
        });
        context.strokeStyle = 'rgb(0, 0, 0)';
        
        let radio = $('<select>').attr('id', 'brush_size');
        radio.append($('<option>').val(2).text(2));
        radio.append($('<option>').val(5).text(5));
        radio.append($('<option>').val(10).text(10));
        radio.append($('<option>').val(20).text(20));
        radio.append($('<option>').val(30).text(30));
        radio.change(function() {
            let tool = $('input[name="tool"]:checked').val();
            if(tool === 'pen') {
                penSize = $(this).val();
                context.lineWidth = penSize;
            } else if(tool === 'eraser') {
                eraserSize = $(this).val();
                context.lineWidth = eraserSize;
            }
        });
        this.append(radio);
        penSize = 10;
        eraserSize = 10;
        context.lineWidth = penSize;
        $('#brush_size').val(penSize);
        
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
    
    var defaults = {
        canvasWidth: 400,
        canvasHeight: 400
    };
    
})(jQuery);