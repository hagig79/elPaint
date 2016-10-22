(function($) {
    'use strict';
    var down;
    var oldX;
    var oldY;
    var context;
    // スポイト
    var dropperFlag = false;
    jQuery.fn.elPaint = function() {
        var canvas = document.createElement('canvas');
        $(canvas).attr('width', 300).attr('height', 300);
        context = canvas.getContext("2d");
        
        if (window.PointerEvent) {
            canvas.addEventListener('pointerdown', function(e) {
                var p = $(canvas).position();
                oldX = e.clientX - p.left;
                oldY = e.clientY - p.top;
                down = true;
            });
            canvas.addEventListener('pointermove', function(e) {
                if (down) {
                    var p = $(canvas).position();
                    context.beginPath();
                    context.lineJoin = context.lineCap = 'round';
                    context.lineWidth = e.pressure * 10;
                    context.moveTo(oldX, oldY);
                    context.lineTo(e.clientX - p.left, e.clientY - p.top);
                    context.stroke();
                    context.closePath();
                    oldX = e.clientX - p.left;
                    oldY = e.clientY - p.top;
                }
            });
        } else {
            $(canvas).mousedown(function(e) {
                var p = $(canvas).position();
                oldX = e.clientX - p.left;
                oldY = e.clientY - p.top;
                down = true;
            });
            $(canvas).mousemove(function(e) {
                if (down) {
                    var p = $(canvas).position();
                    context.beginPath();
                    context.lineJoin = context.lineCap = 'round';
                    context.moveTo(oldX, oldY);
                    context.lineTo(e.clientX - p.left, e.clientY - p.top);
                    context.stroke();
                    context.closePath();
                    oldX = e.clientX - p.left;
                    oldY = e.clientY - p.top;
                }
            });
        }
        
        $(canvas).mouseup(function(e) {
            down = false;
        });
        
        this.append(canvas);
    };
})(jQuery);