<template>
    <div class="scale">
        <canvas id="scale" style="cursor: grab;"></canvas>
    </div>
</template>
<script>
import { onMounted } from 'vue'
import CanvasScale from '../method/scale'
export default {
    setup() {
        onMounted(() => {
            new CanvasScale({
                el: document.getElementById('scale'),
                // image: 'https://i0.hdslb.com/bfs/album/41b3b7d38a0438057ea18bc7779dc451e6333175.jpg'
                image: 'https://img2.huashi6.com/images/resource/2019/03/12/73h635834p0.png?imageView2/3/q/100/interlace/1/w/1600/h/1600/format/webp'
            })
        })
    }
}
</script>