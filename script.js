document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('drawing-area');
    const ctx = canvas.getContext('2d');
    const colorPicker = document.getElementById('color');
    const sizePicker = document.getElementById('size');
    const clearButton = document.getElementById('clear-button');
    const saveButton = document.getElementById('salvar-clear');

    let drawing = false;
    let lastX = 0;
    let lastY = 0;
    let savedImage = null;

    function resizeCanvas() {
        // Salva o desenho atual
        savedImage = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // Ajusta o tamanho do canvas para a tela
        canvas.width = window.innerWidth * 0.98;
        canvas.height = window.innerHeight * 0.7;

        // Restaura o desenho salvo, se houver
        if (savedImage) {
            ctx.putImageData(savedImage, 0, 0);
        }
    }

    // Redimensiona ao carregar e ao mudar o tamanho da janela
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function startDrawing(e) {
        drawing = true;
        [lastX, lastY] = getPointerPos(e);
    }

    function stopDrawing() {
        drawing = false;
    }

    function draw(e) {
        if (!drawing) return;
        const [x, y] = getPointerPos(e);
        ctx.strokeStyle = colorPicker.value;
        ctx.lineWidth = sizePicker.value;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();
        [lastX, lastY] = [x, y];
    }

    function getPointerPos(e) {
        const rect = canvas.getBoundingClientRect();
        if (e.touches && e.touches.length > 0) {
            return [
                e.touches[0].clientX - rect.left,
                e.touches[0].clientY - rect.top
            ];
        }
        return [
            (e.clientX || 0) - rect.left,
            (e.clientY || 0) - rect.top
        ];
    }

    // Mouse events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    canvas.addEventListener('mousemove', draw);

    // Touch events
    canvas.addEventListener('touchstart', function(e) {
        e.preventDefault();
        startDrawing(e);
    }, { passive: false });
    canvas.addEventListener('touchend', function(e) {
        e.preventDefault();
        stopDrawing();
    }, { passive: false });
    canvas.addEventListener('touchmove', function(e) {
        e.preventDefault();
        draw(e);
    }, { passive: false });

    clearButton.addEventListener('click', function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    saveButton.addEventListener('click', function() {
        const link = document.createElement('a');
        link.download = 'desenho.png';
        link.href = canvas.toDataURL();
        link.click();
    });
});