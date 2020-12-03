export default class Canvas{
    constructor(el) {
        let {width, height} = this.getStyle(el)
        width = parseInt(width)
        height = parseInt(height)
        this.width = width
        this.height = height
        this.left = 100
        this.top = 150
        this.right = 100
        this.bottom = 150
        this.el = el
        this.tickLen = 5
        this.r = 3
        this.create()
        this.renderAxis()
        this.bindEvent()
    }
    create() {
        let el = document.createElement('canvas')
        let ratio = window.devicePixelRatio
        el.style.width = this.width + 'px'
        el.style.height = this.height + 'px'
        el.width = this.width * ratio 
        el.height = this.height * ratio
        let ctx = el.getContext('2d')
        ctx.scale(ratio, ratio)
        this.ctx = ctx
        this.el.appendChild(el)
    }
    getStyle(el) {
        if (window.getComputedStyle) {
            return window.getComputedStyle(el)
        }
        return el.currentStyle
    }
    bindEvent() {
        this.el.addEventListener('mousemove', this.throttle((e) => {
            let x = e.offsetX, y = e.offsetY, isIn = false
            let {points, r, el} = this
            for(let i = 0; i < points.length; i++) {
                let a, b, v,p = points[i]
                a = Math.abs(p.x - x)
                b = Math.abs(p.y - y)
                v = Math.hypot(a, b)
                if (v <= r) {
                    el.style.cursor = 'pointer'
                    isIn = true
                    break
                }
            }
            if (!isIn) {
                el.style.cursor = 'default'
            }
        }))
    }
    throttle(fn, time = 200) {
        let timer = null
        return (e) => {
            if (timer) {
                clearTimeout(timer)
                timer = null
            }
            setTimeout(fn, time, e)
        }
    }
    pointsCalc(points) {
        const {xAxis, yAxis, type} = points
        this.smooth = points.smooth || false
        const {max, min} = this.getPeakValue(yAxis)
        let w = this.width - this.left - this.right
        let h = this.height - this.top - this.bottom
        let len = xAxis.length
        let diffx = Math.floor(w / len)
        let x_p = [], p_s = [], x_tick = [], y_tick = [], y_label = []
        for(let i = 0; i < len; i++) {
            let v = i * diffx + diffx / 2 + this.left
            x_p.push(v)
            x_tick.push((i + 1) * diffx + this.left)
        }
        let yLen = 5
        
        let diffY = Math.floor(max / yLen)
        yAxis.forEach((y, i) => {
            let v = h / yLen * y / diffY
            v = this.height - this.bottom - Math.floor(v)
            p_s.push({
                x: x_p[i],
                y: v
            })
        })
        for(let i = 0; i <= yLen; i++) {
            y_tick.push(h  * i / yLen + this.top)
            y_label.push(diffY * i)
        }
        this.points = p_s
        this.x_tick = x_tick
        this.y_tick = y_tick
        this.y_label = y_label
        if (this.smooth) {
            this.drawBezierCurve()
        }else {
            this.drawLine(p_s)
        }
        this.drawPoint(p_s)  // 绘制数据点
        this.drawTick()      // 绘制刻度
        this.drawSplitLine() // 绘制辅助线
    }
    drawLine(points) {
        let ctx = this.ctx
        ctx.beginPath()
        ctx.save()
        ctx.moveTo(points[0].x, points[0].y)
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y)
        }
        ctx.strokeStyle = '#6cf'
        ctx.stroke()
        ctx.restore()
    }
    drawPoint(points) {
        let ctx = this.ctx
        points.forEach(p => {
            ctx.beginPath()
            ctx.strokeStyle = 'aqua'
            ctx.arc(p.x, p.y, this.r, 0, Math.PI * 2)
            ctx.stroke()
            ctx.closePath()
        })
    }
    drawBezierCurve() {
        const {points, ctx} = this
        ctx.save()
        ctx.beginPath()
        ctx.strokeStyle = '#6cf'
        points.forEach((item, index) => {
            let scale = 0.1
            // 前一个点坐标
            let last1X, last1Y, last2X, last2Y, nowX, nowY, nextX, nextY;
            let cAx, cAy, cBx, cBy;
            nowX = item.x
            nowY = item.y
            if (index === 0) {
                ctx.moveTo(nowX, nowY)
                return
            }
            last1X = points[index - 1].x
            last1Y = points[index - 1].y
            if (index !== points.length - 1) {
                nextX = points[index + 1].x
                nextY = points[index + 1].y
                cBx = nowX - (nextX - last1X) * scale
                cBy = nowY - (nextY - last1Y) * scale
            }
            if (index === 1) {
                cAx = last1X + nowX * scale
                if (last1Y > nowY) {
                    cAy = last1Y - nowY * scale
                }else {
                    cAy = last1Y + nowX * scale
                }
                ctx.bezierCurveTo(cAx, cAy, cBx, cBy, nowX, nowY)
                return
            }
            last2X = points[index - 2].x
            last2Y = points[index - 2].y
            cAx = last1X + (nowX - last2X) * scale
            cAy = last1Y + (nowY - last2Y) * scale
            if (index === points.length - 1) {
                cBx = nowX - (nowX - last1X) * scale
                cBy = nowY - (nowY - last1Y) * scale
            }
            ctx.bezierCurveTo(cAx, cAy, cBx, cBy, nowX, nowY)
        })
        ctx.stroke();
        ctx.restore();
    }
    drawTick() {
        const {ctx, x_tick, y_tick, y_label} = this
        let y = this.height - this.bottom
        let x = this.left
        x_tick.forEach(tick => {
            ctx.save()
            ctx.beginPath()
            ctx.strokeStyle = '#000'
            ctx.moveTo(tick, y)
            ctx.lineTo(tick, y + this.tickLen)
            ctx.stroke()
            ctx.closePath()
            ctx.restore()
        })
        y_tick.forEach((tick, i) => {
            ctx.save()
            ctx.beginPath()
            ctx.strokeStyle = '#000'
            ctx.moveTo(x, tick)
            ctx.lineTo(x - this.tickLen, tick)
            ctx.stroke()
            ctx.closePath()
            ctx.restore()
        })
        y_label.forEach((label, i) => {
            ctx.font = '14px "微软雅黑"'
            ctx.textBaseline = 'middle'
            ctx.textAlign = 'right'
            ctx.fillText(y_label[y_label.length - i - 1], x - this.tickLen, y_tick[i])
        })
    }
    drawSplitLine() {
        const {ctx, y_tick} = this
        let y = this.width - this.right
        let x = this.left
        // 最后一条线和坐标轴重合，可忽略
        y_tick.slice(0, -1).forEach(v => {
            ctx.save()
            ctx.beginPath()
            ctx.strokeStyle = '#000'
            ctx.lineWidth = 0.5
            ctx.moveTo(x, v)
            ctx.lineTo(y, v)
            ctx.stroke()
            ctx.restore()
        })        
    }
    renderAxis() {
        let ctx = this.ctx
        ctx.save()
        ctx.beginPath()
        ctx.strokeStyle = '#000'
        ctx.moveTo(this.left, this.top)
        ctx.lineTo(this.left, this.height - this.bottom)
        ctx.lineTo(this.width - this.right, this.height - this.bottom)
        // ctx.closePath()
        ctx.stroke()
        ctx.restore()
    }
    getPeakValue(points) {
        let max, min
        max = Math.max(...points)
        min = Math.min(...points)
        return {
            max, min
        }
    }
    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height)
    }
}