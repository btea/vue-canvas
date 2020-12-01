import { options } from "less"

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
        this.create()
        this.renderAxis()
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
        console.log(el)
        this.el.appendChild(el)
    }
    getStyle(el) {
        if (window.getComputedStyle) {
            return window.getComputedStyle(el)
        }
        return el.currentStyle
    }
    pointsCalc(points) {
        const {xAxis, yAxis, type} = points
        const {max, min} = this.getPeakValue(yAxis)
        let w = this.width - this.left - this.right
        let h = this.height - this.top - this.bottom
        let len = xAxis.length
        let diffx = Math.floor(w / len)
        let x_p = [], p_s = []
        for(let i = 0; i < len; i++) {
            x_p.push(i * diffx + diffx / 2 + this.left)
        }
        let yLen = 5
        
        let diffY = Math.floor((max - min) / yLen)
        console.log(diffY)
        yAxis.forEach((y, i) => {
            let v = h / yLen * y / diffY
            v = this.height - this.bottom - Math.floor(v)
            p_s.push({
                x: x_p[i],
                y: v
            })
        })
        this.drawLine(p_s)
        this.drawPoint(p_s)
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
            ctx.arc(p.x, p.y, 5, 0, Math.PI * 2)
            ctx.stroke()
            ctx.closePath()
        })
    }
    renderAxis() {
        let ctx = this.ctx
        ctx.beginPath()
        ctx.moveTo(this.left, this.top)
        ctx.lineTo(this.left, this.height - this.bottom)
        ctx.lineTo(this.width - this.right, this.height - this.bottom)
        // ctx.closePath()
        ctx.stroke()
    }
    getPeakValue(points) {
        let max, min
        max = Math.max(...points)
        min = Math.min(...points)
        return {
            max, min
        }
    }
}