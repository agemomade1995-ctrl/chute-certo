// Função para obter o token CSRF do meta tag
function getCSRFToken() {
    return document.querySelector('meta[name="csrf-token"]').getAttribute('content');
}

// Configurar o token CSRF para todas as requisições AJAX
document.addEventListener('DOMContentLoaded', function() {
    // Adicionar o token CSRF ao cabeçalho de todas as requisições AJAX
    let token = getCSRFToken();
    
    if (token) {
        // Configurar o cabeçalho X-CSRFToken para todas as requisições AJAX
        let oldXHR = window.XMLHttpRequest;
        function newXHR() {
            let xhr = new oldXHR();
            xhr.addEventListener('readystatechange', function() {
                if (xhr.readyState === 1) {
                    xhr.setRequestHeader('X-CSRFToken', token);
                }
            });
            return xhr;
        }
        window.XMLHttpRequest = newXHR;

        // Configurar o cabeçalho X-CSRFToken para requisições fetch
        let originalFetch = window.fetch;
        window.fetch = function() {
            let args = Array.prototype.slice.call(arguments);
            
            if (args[1] === undefined) {
                args[1] = {};
            }
            if (args[1].headers === undefined) {
                args[1].headers = {};
            }
            
            if (!(args[1].headers instanceof Headers)) {
                args[1].headers = new Headers(args[1].headers);
            }
            
            args[1].headers.set('X-CSRFToken', token);
            
            return originalFetch.apply(this, args);
        };
    }
});