// Utility Functions
function showToast(type, message) {
    // Using SweetAlert2 toast if available, otherwise fallback to alert
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: type === 'error' ? 'error' : type === 'success' ? 'success' : 'info',
            title: message,
            showConfirmButton: false,
            timer: 3000
        });
    } else {
        alert(message);
    }
}

function showLoading() {
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: 'Processando...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
    }
}

function hideLoading() {
    if (typeof Swal !== 'undefined') {
        Swal.close();
    }
}

function getCsrfToken() {
    const tokenMeta = document.querySelector('meta[name="csrf-token"]');
    return tokenMeta ? tokenMeta.getAttribute('content') : '';
}

// Função para mostrar referências extraídas
function showReferences(references, sectionId) {
    const refsDiv = document.getElementById(`extracted-references-${sectionId}`);
    if (!refsDiv) {
        console.error(`Elemento extracted-references-${sectionId} não encontrado`);
        return;
    }

    refsDiv.innerHTML = '';

    if (references && references.length > 0) {
        const title = document.createElement('h4');
        title.textContent = 'Referências Extraídas';
        refsDiv.appendChild(title);

        const list = document.createElement('ul');
        list.className = 'references-list list-group';

        references.forEach(ref => {
            const item = document.createElement('li');
            item.className = 'list-group-item';
            item.textContent = ref.text;
            list.appendChild(item);
        });

        refsDiv.appendChild(list);

        // Adiciona botão para salvar
        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Salvar Referências';
        saveBtn.className = 'btn btn-primary mt-3';
        saveBtn.onclick = () => saveReferences(references);
        refsDiv.appendChild(saveBtn);
    }
}

// Função para salvar referências
async function saveReferences(references) {
    try {
        const projectId = document.querySelector('[data-project-id]') ? document.querySelector('[data-project-id]').dataset.projectId : (document.querySelector('meta[name="project-id"]') ? document.querySelector('meta[name="project-id"]').getAttribute('content') : null);

        if (!projectId) {
            console.error('Project ID not found');
            return;
        }

        const response = await fetch(`/projects/${projectId}/references/save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCsrfToken()
            },
            body: JSON.stringify({
                references: references
            })
        });

        const data = await response.json();

        if (data.success) {
            showToast('success', 'Referências salvas com sucesso!');
        } else {
            showToast('error', 'Erro ao salvar referências: ' + data.message);
        }
    } catch (error) {
        console.error('Erro ao salvar referências:', error);
        showToast('error', 'Erro ao salvar referências');
    }
}

// Função para regenerar seção
async function regenerateSection(sectionId) {
    try {
        showLoading();

        const projectId = document.querySelector('[data-project-id]') ? document.querySelector('[data-project-id]').dataset.projectId : (document.querySelector('meta[name="project-id"]') ? document.querySelector('meta[name="project-id"]').getAttribute('content') : null);

        if (!projectId) {
            console.error('Project ID not found');
            return;
        }

        const response = await fetch(`/projects/${projectId}/sections/${sectionId}/regenerate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCsrfToken()
            },
            body: JSON.stringify({
                target_pages: 1 // Valor padrão se chamado por esta função simplificada
            })
        });

        const data = await response.json();

        if (data.success) {
            const editor = document.querySelector(`#section-${sectionId} .editor`);
            if (editor) {
                editor.innerHTML = data.content;
            }

            // Mostra referências se disponíveis
            if (data.references) {
                showReferences(data.references, sectionId);
            }

            showToast('success', 'Conteúdo regenerado com sucesso!');
        } else {
            showToast('error', 'Erro ao regenerar conteúdo: ' + data.message);
        }
    } catch (error) {
        console.error('Erro ao regenerar seção:', error);
        showToast('error', 'Erro ao regenerar conteúdo');
    } finally {
        hideLoading();
    }
}
