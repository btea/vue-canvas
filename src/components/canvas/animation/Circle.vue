<template>
    <div class="circle-box" ref="circle">
        <canvas ref="bubble" style="background: rgba(102, 204, 255, .2);"></canvas>
    </div>
</template>
<script>
export default {
    data() {
        return {
            width: null,
            height: null,
            num: 20,
            max: 100,
            min: 50,
        };
    },
    mounted() {
        this.getStyle();
    },
    methods: {
        getStyle() {
            let box = this.$refs.circle;
            let style = window.getComputedStyle(box);
            let w = parseInt(style.width);
            let h = parseInt(style.height);
            this.width = w;
            this.height = h;
            this.initCanvas(w, h);
        },
        initCanvas(w, h) {
            this.el = this.$refs.bubble;
            this.ctx = this.el.getContext("2d");
            // let ratio = this.getPixelRatio(this.ctx)
            let ratio = 1;
            this.el.width = w * ratio;
            this.el.height = h * ratio;
            this.el.style.width = w + "px";
            this.el.style.height = h + "px";

            this.bubbles();
            this.startDraw();
            // this.startAnimation();

            this.animation();
        },
        getPixelRatio(context) {
            let backingStore =
                context.backingStorePixelRatio ||
                context.webkitBackingStorePixelRatio ||
                context.mozBackingStorePixelRatio ||
                context.msBackingStorePixelRatio ||
                context.oBackingStorePixelRatio ||
                context.backingStorePixelRatio ||
                1;
            return (window.devicePixelRatio || 1) / backingStore;
        },
        animation() {
            let timer;
            timer = setInterval(() => {
                this.startDraw();
                // if(this.lists[0].y <= 0) {
                // 	clearInterval(timer)
                // }
            }, 16.7);
        },
        startDraw() {
            this.ctx.clearRect(0, 0, this.width, this.height);
            this.lists.forEach((bubble, i) => {
                let r1 = bubble.r * 0.6;
                let rgb = bubble.rgb.join(",");
                let c = this.ctx.createRadialGradient(
                    bubble.x,
                    bubble.y,
                    r1,
                    bubble.x,
                    bubble.y,
                    bubble.r
                );
                c.addColorStop(0, `rgba(${rgb}, 0)`);
                c.addColorStop(0.7, `rgba(${rgb}, .1)`);
                c.addColorStop(1, `rgba(${rgb}, .8)`);
                this.ctx.beginPath();
                this.ctx.fillStyle = c;
                this.ctx.arc(bubble.x, bubble.y, bubble.r, 0, 2 * Math.PI);
                // this.ctx.stroke()
                this.ctx.fill();
                this.ctx.beginPath();
                let children = bubble.children;
                let c_c = this.ctx.createRadialGradient(
                    children.x,
                    children.y,
                    children.r * 0.8,
                    children.x,
                    children.y,
                    children.r
                );
                c_c.addColorStop(0, `rgba(255, 255, 255, 0)`);
                c_c.addColorStop(0.8, `rgba(255, 255, 255, .7)`);
                c_c.addColorStop(1, "rgba(255, 255, 255, .8)");
                this.ctx.fillStyle = c_c;
                this.ctx.lineTo(children.x, children.y);
                this.ctx.arc(children.x, children.y, children.r, Math.PI * (-5 / 6), 0);
                this.ctx.fill();

                this.ctx.save();
                this.ctx.beginPath();
                let w = 20;
                let h = 10;
                let C = "rgba(255, 255, 255, .5)";
                let $x, $y;
                $x = bubble.x - 20;
                $y = bubble.y - bubble.r + 15;

                this.ctx.fillStyle = C;
                // this.ctx.translate($x + w / 2, $y + h / 2)
                // this.ctx.rotate(-20 * Math.PI / 180)
                // this.ctx.rect(-w / 2, -h / 2, w, h)
                // this.ctx.fill()
                // this.ctx.beginPath()
                // this.ctx.arc(-w / 2, 0, h / 2, 0, Math.PI * 2)
                // this.ctx.fill()
                // this.ctx.beginPath()
                // this.ctx.arc(w / 2, 0, h / 2, 0, Math.PI * 2)
                // this.ctx.fill()
                this.ctx.ellipse($x, $y, w / 2, h / 2, -Math.PI / 8, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.restore();
                bubble.y = bubble.y - bubble.s;
                children.y = children.y - bubble.s;
                bubble.x += 0.5;
                children.x += 0.5;
                if (bubble.y <= bubble.r || bubble.x >= this.width) {
                    bubble.y = this.height;
                    children.y = this.height - (bubble.r - children.r);
                    bubble.c = this.color();
                    children.x = bubble.x = this.random(this.width - bubble.r, bubble.r);
                    bubble.rgb = this.colorTorgb(bubble.c);
                    children.c = bubble.c;
                    // children.x = bubble.x
                }
            });
        },
        bubbles() {
            let lists = [];
            for (let i = 0; i < this.num; i++) {
                lists.push(this.createBubble());
            }
            this.lists = lists;
        },
        createBubble() {
            let obj = {};
            let r = this.random(this.max, this.min);
            let r1 = r * 0.8;
            let s = (Math.random() * 5).toFixed(1);
            obj.x = this.random(this.width - r, r);
            obj.y = this.height - r;
            obj.s = s;
            obj.c = this.color();
            obj.r = r;
            obj.rgb = this.colorTorgb(obj.c);
            obj.children = {
                x: obj.x,
                y: obj.y - (r - r1),
                s: s,
                c: obj.c,
                r: r1,
            };
            return obj;
        },
        colorTorgb(str) {
            let r, g, b;
            str = str.slice(1);
            r = str.slice(0, 2);
            g = str.slice(2, 4);
            b = str.slice(4);

            r = parseInt(r, 16);
            g = parseInt(g, 16);
            b = parseInt(b, 16);
            return [r, g, b];
        },
        color() {
            let str = "0123456789abcdef";
            let s = "#";
            for (let i = 0; i < 6; i++) {
                s += str[this.random(15, 0)];
            }
            return s;
        },
        random(max, min) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        },
    },
};
</script>
<style lang="less" scoped>
.circle-box {
    height: 100%;
}
</style>
