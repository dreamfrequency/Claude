(() => {
    let dotNetRef = null;
    let animationId = null;
    const keys = {};

    function onKeyDown(e) {
        if (['ArrowLeft', 'ArrowRight', 'a', 'd', 'A', 'D'].includes(e.key)) {
            e.preventDefault();
            keys[e.key] = true;
        }
    }

    function onKeyUp(e) {
        keys[e.key] = false;
    }

    window.pongInterop = {
        init(ref) {
            dotNetRef = ref;
            window.addEventListener('keydown', onKeyDown);
            window.addEventListener('keyup', onKeyUp);
        },

        start() {
            if (animationId) cancelAnimationFrame(animationId);
            Object.keys(keys).forEach(k => keys[k] = false);

            const loop = () => {
                const left = keys['ArrowLeft'] || keys['a'] || keys['A'] || false;
                const right = keys['ArrowRight'] || keys['d'] || keys['D'] || false;
                dotNetRef.invokeMethodAsync('Tick', left, right);
                animationId = requestAnimationFrame(loop);
            };
            animationId = requestAnimationFrame(loop);
        },

        stop() {
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        },

        dispose() {
            this.stop();
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('keyup', onKeyUp);
            dotNetRef = null;
        }
    };
})();
