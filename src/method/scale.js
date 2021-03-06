export default class CanvasScale{
    constructor(obj){
        this.el = obj.el || null
        this.image = obj.image || ''
        this.x = 0 // 鼠标进行滚动，放大缩小时鼠标所处的水平方向位置
        this.y = 0 // ...,垂直方向坐标
        this.isMove = false // 用来控制是否拖拽移动
        this.moveX = 0  // 进行拖拽的时候，开始拖拽的位置
        this.moveY = 0
        this.wheelX = 0
        this.wheelWidth = 0
        this.wheelHeight = 0
        this.wheelY = 0
        this.scale = 1
        this.enlarge = 1.1 // 放大比例
        this.narrow = 0.9 // 缩小比例
        this.left = 0
        this.top = 0
        this.init()
    }
    init() {
        if (!this.el) {
            return
        }
        if (!this.image) {
            return
        }
        if (typeof this.image === 'string') {
            let img = new Image()
            img.onload = () => {
                this.image = img
                this.wheelWidth = this.width = this.image_w = img.width * .4
                this.wheelHeight = this.height = this.image_h = img.height * .4
                this.startRender()
            }
            img.src = this.image
        }
    }
    startRender() {
        if (this.image_w) {
            this.el.width = this.image_w
            this.el.style.width = `${this.image_w}px`
            this.el.height = this.image_h
            this.el.style.height = `${this.image_h}px`
            this.ctx = this.el.getContext('2d')
            this.ctx.drawImage(this.image, 0, 0, this.image_w, this.image_h)
            this.addEvent()
        }
    }
    addEvent() {
        let el = this.el
        // 拖拽操作不做节流比节流之后看着流畅舒服很多
        el.addEventListener('mousemove', (e) => {
            this.wheelX = e.layerX
            this.wheelY = e.layerY
            if (this.isMove) {
                this.startMove(e)
            }
        })
        el.addEventListener('mousedown', (e) => {
            this.isMove = true
            this.moveX = e.layerX
            this.moveY = e.layerY
            this.el.style.cursor = 'grabbing'
        })
        window.addEventListener('mouseup', (e) => {
            this.isMove = false
            this.endMove(e)
            this.el.style.cursor = 'grab'
        })
        el.addEventListener('wheel', this.throttle((e) => {
            e.preventDefault()
            e.stopPropagation()
            let state = e.deltaY
            this.wheelX = e.layerX
            this.wheelY = e.layerY
            if (state > 0) {
                // 缩小
                // this.narrow *= .9
                this.scale *= .95
                this.startNarrow()
            }else {
                // 放大
                // this.enlarge *= 1.1
                this.scale *= 1.05
                this.startEnlarge()
            }
        }))
    }
    // 开始拖拽移动
    startMove(e) {
        let x = e.layerX
        let y = e.layerY
        let vx = x - this.moveX
        let vy = y - this.moveY
        // 清空画布
        // 注：不清空画布的话，反复绘制，拖拽的时候会看到很多重叠，看着还挺有意思的
        this.ctx.clearRect(0, 0, this.width, this.height)
        // 直接重新绘制，拖拽完成之后，再重新赋值left、top
        this.ctx.drawImage(this.image, this.left + vx, this.top + vy, this.wheelWidth, this.wheelHeight)
    }
    endMove(e) {
        let x = e.layerX
        let y = e.layerY
        let vx = x - this.moveX
        let vy = y - this.moveY
        this.left += vx
        this.top += vy
    }
    // 开始放大
    startEnlarge() {
        // this.wheelWidth = this.width * this.enlarge
        // this.wheelHeight = this.height * this.enlarge
        // let left = this.wheelX - this.wheelX * this.enlarge
        // let top = this.wheelY - this.wheelY * this.enlarge
        this.wheelWidth = this.width * this.scale
        this.wheelHeight = this.height * this.scale
        let left = this.wheelX - this.wheelX * this.scale
        let top = this.wheelY - this.wheelY * this.scale
        this.rePaint(left, top)
    }
    // 开始缩小
    startNarrow() {
        // this.wheelWidth = this.width * this.narrow
        // this.wheelHeight = this.height * this.narrow
        // let left = this.wheelX - this.wheelX * this.narrow
        // let top = this.wheelY - this.wheelY * this.narrow
        this.wheelWidth = this.width * this.scale
        this.wheelHeight = this.height * this.scale
        let left = this.wheelX - this.wheelX * this.scale
        let top = this.wheelY - this.wheelY * this.scale
        this.rePaint(left, top)
    }
    clearPaint() {
        this.ctx.clearRect(0, 0, this.width, this.height)
    }
    rePaint(left, top) {
        this.clearPaint()
        this.left = left
        this.top = top
        this.ctx.drawImage(this.image, left, top, this.wheelWidth, this.wheelHeight)
    }
    // 放大缩小以及拖拽都可以做节流
    throttle(fn, time = 100) {
        let timer
        return (e) => {
            if (timer) {
                return
            }
            timer = setTimeout(() => {
                fn(e)
                timer = null
            }, time)
        }
    }
}