/**
 * Course Content Protection Script
 * 
 * This script implements several protection measures:
 * 1. Prevents right-click on course content
 * 2. Blocks keyboard shortcuts for saving/printing/viewing source
 * 3. Blocks browser developer tools (F12)
 * 4. Adds watermarks to course content
 * 5. Prevents screen capture when possible
 * 6. Blocks text selection and copying
 */

(function() {
    // Only apply protections on course pages
    if (window.location.pathname.includes('/tutorials') || 
        window.location.pathname.includes('/lessons') ||
        window.location.pathname.includes('/secure-player')) {
        
        // Block right-click
        document.addEventListener('contextmenu', function(e) {
            // Permitir right-click para administradores nas páginas de edição
            if (window.location.pathname.includes('/admin/tutorials/lesson/') || 
                window.location.pathname.includes('/admin/lesson/')) {
                return true; // Permite a ação para administradores nas páginas de edição
            }
            e.preventDefault();
            showProtectionAlert('O menu de contexto foi desativado nesta aula para proteger o conteúdo.');
            return false;
        });
        
        // Block keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            // Block: Ctrl+S (save), Ctrl+P (print), Ctrl+Shift+I (dev tools), 
            // Ctrl+U (view source), F12 (dev tools)
            if ((e.ctrlKey && (e.keyCode === 83 || e.keyCode === 80 || e.keyCode === 85)) || 
                (e.ctrlKey && e.shiftKey && e.keyCode === 73) || 
                e.keyCode === 123) {
                e.preventDefault();
                showProtectionAlert('Esta combinação de teclas está desativada nesta aula para proteger o conteúdo.');
                return false;
            }
            
            // Block copy/paste: Ctrl+C, Ctrl+V, Ctrl+X
            if (e.ctrlKey && (e.keyCode === 67 || e.keyCode === 86 || e.keyCode === 88)) {
                // Permitir copy/paste para administradores na página de edição de lição
                if (window.location.pathname.includes('/admin/tutorials/lesson/') || 
                    window.location.pathname.includes('/admin/lesson/')) {
                    return true; // Permite a ação para administradores nas páginas de edição
                }
                e.preventDefault();
                showProtectionAlert('A cópia e colagem de conteúdo está desativada nesta aula.');
                return false;
            }
        });
        
        // Block text selection in lesson content
        const lessonContent = document.querySelector('.lesson-description');
        if (lessonContent) {
            // Não bloquear seleção de texto para administradores nas páginas de edição
            if (!window.location.pathname.includes('/admin/tutorials/lesson/') && 
                !window.location.pathname.includes('/admin/lesson/')) {
                lessonContent.addEventListener('selectstart', function(e) {
                    e.preventDefault();
                    return false;
                });
                
                // Make content non-selectable
                lessonContent.style.userSelect = 'none';
                lessonContent.style.webkitUserSelect = 'none';
                lessonContent.style.msUserSelect = 'none';
                lessonContent.style.mozUserSelect = 'none';
            }
        }
        
        // Block screen capture API if available
        if (navigator.mediaDevices && typeof navigator.mediaDevices.getDisplayMedia === 'function') {
            const originalGetDisplayMedia = navigator.mediaDevices.getDisplayMedia.bind(navigator.mediaDevices);
            navigator.mediaDevices.getDisplayMedia = function(constraints) {
                showProtectionAlert('A captura de tela foi bloqueada nesta aula para proteger o conteúdo.');
                return Promise.reject(new Error('Screen capture is disabled for this content'));
            };
        }
        
        // Detect and block browser developer tools
        function detectDevTools() {
            // Aumentar o limite para permitir uso durante desenvolvimento
            const widthThreshold = window.outerWidth - window.innerWidth > 500;
            const heightThreshold = window.outerHeight - window.innerHeight > 500;
            
            // Usar E lógico em vez de OU para ser menos sensível
            if (widthThreshold && heightThreshold) {
                document.body.innerHTML = `
                    <div style="text-align: center; padding: 50px;">
                        <h2>Ferramentas de desenvolvedor detectadas</h2>
                        <p>Por favor, feche as ferramentas de desenvolvedor para acessar o conteúdo do curso.</p>
                        <button onclick="location.reload()">Recarregar</button>
                    </div>
                `;
            }
        }
        
        // Comentado temporariamente para desenvolvimento
        // setInterval(detectDevTools, 1000);
        
        // Add dynamic watermark if not already present
        if (!document.getElementById('dynamic-watermark')) {
            const userName = document.querySelector('.navbar-nav .nav-link')?.textContent.trim() || 'Usuário';
            createDynamicWatermark(userName);
        }
    }
    
    // Show protection alert to user
    function showProtectionAlert(message) {
        const alertDiv = document.createElement('div');
        alertDiv.style.position = 'fixed';
        alertDiv.style.top = '20px';
        alertDiv.style.left = '50%';
        alertDiv.style.transform = 'translateX(-50%)';
        alertDiv.style.backgroundColor = '#f8d7da';
        alertDiv.style.color = '#721c24';
        alertDiv.style.padding = '10px 20px';
        alertDiv.style.borderRadius = '5px';
        alertDiv.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        alertDiv.style.zIndex = '9999';
        alertDiv.style.maxWidth = '80%';
        alertDiv.style.textAlign = 'center';
        alertDiv.innerHTML = `<i class="fas fa-shield-alt"></i> ${message}`;
        
        document.body.appendChild(alertDiv);
        
        setTimeout(() => {
            alertDiv.style.opacity = '0';
            alertDiv.style.transition = 'opacity 0.5s';
            
            setTimeout(() => {
                document.body.removeChild(alertDiv);
            }, 500);
        }, 3000);
    }
    
    // Create dynamic watermark with user info
    function createDynamicWatermark(userName) {
        const watermarkText = `${userName} • ${new Date().toLocaleDateString()} • amsolucoesacademica`;
        const watermark = document.createElement('div');
        watermark.id = 'dynamic-watermark';
        watermark.style.position = 'fixed';
        watermark.style.top = '0';
        watermark.style.left = '0';
        watermark.style.width = '100%';
        watermark.style.height = '100%';
        watermark.style.zIndex = '-1';
        watermark.style.pointerEvents = 'none';
        watermark.style.userSelect = 'none';
        
        // Create canvas for watermark
        const canvas = document.createElement('canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        
        const ctx = canvas.getContext('2d');
        ctx.font = '16px Arial';
        ctx.fillStyle = 'rgba(200, 200, 200, 0.2)';
        ctx.textAlign = 'center';
        
        // Draw diagonal watermarks
        for (let i = -canvas.height; i < canvas.width; i += 200) {
            ctx.save();
            ctx.translate(i, 0);
            ctx.rotate(Math.PI / 4);
            ctx.fillText(watermarkText, 0, 0);
            ctx.restore();
        }
        
        watermark.appendChild(canvas);
        document.body.appendChild(watermark);
        
        // Redraw on window resize
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            
            ctx.font = '16px Arial';
            ctx.fillStyle = 'rgba(200, 200, 200, 0.2)';
            ctx.textAlign = 'center';
            
            for (let i = -canvas.height; i < canvas.width; i += 200) {
                ctx.save();
                ctx.translate(i, 0);
                ctx.rotate(Math.PI / 4);
                ctx.fillText(watermarkText, 0, 0);
                ctx.restore();
            }
        });
    }
})(); 
