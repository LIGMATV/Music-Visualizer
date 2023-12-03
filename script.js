document.addEventListener('DOMContentLoaded', () => {
    const visualizer = document.getElementById('visualizer');
    const ctx = visualizer.getContext('2d');
    let audioContext; // Tambahkan variabel audioContext
    let currentColor = '#ff0000'; // Warna default (merah)
  
    function loadAudio() {
      const fileInput = document.getElementById('fileInput');
      const audioElement = document.getElementById('audio');
  
      const file = fileInput.files[0];
      const objectURL = URL.createObjectURL(file);
  
      audioElement.src = objectURL;
  
      // Hapus koneksi sebelumnya jika ada
      if (audioContext) {
        audioContext.close();
      }
  
      // Buat koneksi audio baru
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaElementSource(audioElement);
  
      source.connect(analyser);
      analyser.connect(audioContext.destination);
  
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
  
      const WIDTH = visualizer.width;
      const HEIGHT = visualizer.height;
  
      const barWidth = (WIDTH / bufferLength) * 2.5;
      let barHeight;
      let x = 0;
  
      function renderFrame() {
        requestAnimationFrame(renderFrame);
  
        x = 0;
  
        analyser.getByteFrequencyData(dataArray);
  
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
  
        for (let i = 0; i < bufferLength; i++) {
          barHeight = dataArray[i];
  
          // Menggunakan warna yang dipilih oleh pengguna
          ctx.fillStyle = currentColor;
          ctx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2);
  
          x += barWidth + 1;
        }
      }
  
      renderFrame();
    }
  
    // Tambahkan event listener untuk pemilihan file
    const fileInput = document.getElementById('fileInput');
    fileInput.addEventListener('change', loadAudio);
  
    // Fungsi untuk mengubah warna berdasarkan nilai yang dipilih oleh pengguna
    function changeColor() {
      const colorPicker = document.getElementById('colorPicker');
      currentColor = colorPicker.value;
    }
  
    // Tambahkan event listener untuk pemilihan warna
    const colorPicker = document.getElementById('colorPicker');
    colorPicker.addEventListener('input', changeColor);
  });
  