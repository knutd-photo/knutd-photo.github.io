(function() {

    var width, height, canvas, ctx, points, target, animation;

    function circle(pos,rad,color) {
        var thisLocal = this;

        (function() {
            thisLocal.pos = pos || null;
            thisLocal.radius = rad || null;
            thisLocal.color = color || null;
        })();

        this.draw = function() {
            if(!thisLocal.active) return;
            ctx.beginPath();
            ctx.arc(thisLocal.pos.x, thisLocal.pos.y, thisLocal.radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = "rgba(255,230,210," + thisLocal.active + ")"; //circle color
            ctx.fill();
        };
    }

    function getDistance(p1, p2) {
        return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
    }

    function initHeader() {
        width = window.innerWidth;
        height = window.innerHeight;
        target = {x: width/2, y: height/2};

        canvas = document.getElementById("main-canvas");
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext("2d");

        points = [];
        for(var x = 0; x < width; x = x + width/10) {          //circle frequency
            for (var y = 0; y < height; y = y + height / 14) {
                var rand = Math.random();

                if (Math.random() > 0.5)
                    rand = rand * (-1);

                var px = x + rand * width / 5;
                var py = y + rand * height / 7;
                var p = {x: px, originX: px, y: py, originY: py };
                points.push(p);
            }
        }

        // for each point find the 5 closest points
        for(var i = 0; i < points.length; i++) {
            var closest = [];
            var p1 = points[i];
            for(var j = 0; j < points.length; j++) {
                var p2 = points[j];
                if(!(p1 === p2)) {
                    var placed = false;
                    for (var z = 0; z < 4; z++) {
                        if(!placed) {
                            if(closest[z] == undefined) {
                                closest[z] = p2;
                                placed = true;
                            }
                        }
                    }

                    for(var k = 0; k < 4; k++) {
                        if(!placed) {
                            if(getDistance(p1, p2) < getDistance(p1, closest[k])) {
                                closest[k] = p2;
                                placed = true;
                            }
                        }
                    }
                }
            }
            p1.closest = closest;
        }

        for(var pt in points) {
            if (points.hasOwnProperty(pt)) {
                var c = new circle(points[pt], 4 + Math.random() * 2, "rgba(0,0,0,0.2)"); //circle size
                points[pt].circle = c;
            }
        }
    }

    function drawLines(p) {
        if(!p.active) return;
        for(var i in p.closest) {
            if (p.closest.hasOwnProperty(i)) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p.closest[i].x, p.closest[i].y);
                ctx.strokeStyle = "rgba(255,230,210," + p.active + ")"; //ine color
                ctx.stroke();
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        for (var i in points) {
            if (points.hasOwnProperty(i)) {
                points[i].active = 0.9;           //line opacity
                points[i].circle.active = 0.9;    //circle opacity
                drawLines(points[i]);
                points[i].circle.draw();
            }
        }
        animation = window.requestAnimationFrame(animate, canvas);
    }

    function shiftPoint(p) {
        window.TweenLite.to(p, 1+1*Math.random(), {x:p.originX-50+Math.random()*100,
            y: p.originY-50+Math.random()*100, ease:window.Circ.easeInOut,
            onComplete: function() {
                shiftPoint(p);
            }});
    }

    function initAnimation() {
        if (!animation) {
            animate();
            for (var i in points) {
                if (points.hasOwnProperty(i)) {
                    shiftPoint(points[i]);
                }
            }
        }
    }

    function resize() {
        if (animation) {
            window.cancelAnimationFrame(animation);
            animation = undefined;
        }
        width = null;
        height = null;
        canvas = null;
        ctx = null;
        points = null;
        target = null;

        initHeader();
        initAnimation();
    }

    function addListeners() {
        window.addEventListener("resize", resize);
    }

    initHeader();
    initAnimation();
    addListeners();
})();