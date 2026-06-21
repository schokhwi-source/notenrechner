document.addEventListener('DOMContentLoaded', () => {
    let grades = [];
    const averageValueEl = document.getElementById('average-value');
    const gradesListEl = document.getElementById('grades-list');
    const soundToggle = document.getElementById('sound-toggle');
    const helpBtn = document.getElementById('help-btn');
    const helpModal = document.getElementById('help-modal');
    const closeModal = document.getElementById('close-modal');
    
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    const playClickSound = () => {
        if (!soundToggle.checked) return;
        
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.05);
        
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.05);
    };

    const updateDisplay = () => {
        if (grades.length === 0) {
            averageValueEl.textContent = '-';
            gradesListEl.textContent = 'Keine Noten eingegeben';
            return;
        }

        const sum = grades.reduce((acc, curr) => acc + curr, 0);
        const average = sum / grades.length;
        
        // Format to 2 decimal places, but remove trailing zeros if possible
        averageValueEl.textContent = average.toFixed(2).replace(/\.?0+$/, '');
        
        gradesListEl.textContent = grades.join(' • ');
        // Scroll to the end of the grades list
        gradesListEl.scrollTop = gradesListEl.scrollHeight;
    };

    const addGrade = (grade) => {
        playClickSound();
        grades.push(grade);
        updateDisplay();
    };

    const undoLast = () => {
        if (grades.length > 0) {
            playClickSound();
            grades.pop();
            updateDisplay();
        }
    };

    const clearAll = () => {
        if (grades.length > 0) {
            playClickSound();
        } else {
            // Immer noch klicken lassen beim Löschen, auch wenn leer
            playClickSound();
        }
        grades = [];
        updateDisplay();
    };

    document.querySelectorAll('.note-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const note = parseInt(e.target.dataset.note);
            addGrade(note);
            
            // Add a small pop animation
            e.target.style.transform = 'scale(0.95)';
            setTimeout(() => {
                e.target.style.transform = '';
            }, 100);
        });
    });

    document.getElementById('undo-btn').addEventListener('click', undoLast);
    document.getElementById('clear-btn').addEventListener('click', clearAll);

    // Modal logic
    helpBtn.addEventListener('click', () => {
        helpModal.classList.remove('hidden');
    });

    closeModal.addEventListener('click', () => {
        helpModal.classList.add('hidden');
    });

    helpModal.addEventListener('click', (e) => {
        if (e.target === helpModal) {
            helpModal.classList.add('hidden');
        }
    });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (e.key >= '1' && e.key <= '6') {
            addGrade(parseInt(e.key));
        } else if (e.key === 'Backspace') {
            undoLast();
        } else if (e.key === 'Delete' || e.key === 'Escape') {
            clearAll();
        }
    });
});
