// Menu Responsive Enhancement
document.addEventListener('DOMContentLoaded', function() {
    
    // Função para ajustar o menu baseado no tamanho da tela
    function adjustMenuForScreenSize() {
        const navbar = document.querySelector('.navbar');
        const navbarNav = document.querySelector('.navbar-nav');
        const rightMenu = document.querySelector('.navbar-nav:last-child');
        const leftMenu = document.querySelector('.navbar-nav:first-child');
        const navbarCollapse = document.querySelector('.navbar-collapse');
        
        if (!navbar || !navbarNav) return;
        
        const screenWidth = window.innerWidth;
        const isLoggedIn = document.querySelector('.navbar-nav .nav-item.dropdown') !== null;
        
        // Garantir que o menu seja sempre visível em desktop
        if (screenWidth >= 992) {
            if (navbarCollapse) {
                navbarCollapse.classList.remove('collapse');
                navbarCollapse.classList.add('show');
                navbarCollapse.style.display = 'flex';
            }
            
            // Menu principal sempre visível e centralizado
            if (leftMenu) {
                leftMenu.style.justifyContent = 'center';
                leftMenu.style.flexWrap = 'nowrap';
                leftMenu.style.gap = '0.8rem';
                leftMenu.style.flex = '1';
            }
            
            // Menu direito alinhado à direita
            if (rightMenu) {
                rightMenu.style.justifyContent = 'flex-end';
                rightMenu.style.flexWrap = 'nowrap';
                rightMenu.style.gap = '0.8rem';
                rightMenu.style.marginTop = '0';
                rightMenu.style.marginLeft = 'auto';
            }
            
            // Ajustar tamanho dos itens para desktop
            const navItems = document.querySelectorAll('.navbar-nav .nav-item');
            navItems.forEach(item => {
                item.style.flex = '0 0 auto';
                item.style.minWidth = 'auto';
                item.style.textAlign = 'left';
            });
        }
        
        // Ajustes para telas pequenas
        if (screenWidth <= 575.98) {
            // Telas muito pequenas - reorganizar itens
            if (leftMenu) {
                leftMenu.style.justifyContent = 'center';
                leftMenu.style.flexWrap = 'wrap';
                leftMenu.style.gap = '0.3rem';
            }
            
            if (rightMenu) {
                rightMenu.style.justifyContent = 'center';
                rightMenu.style.flexWrap = 'wrap';
                rightMenu.style.gap = '0.3rem';
                rightMenu.style.marginTop = '0.5rem';
            }
            
            // Ajustar tamanho dos itens
            const navItems = document.querySelectorAll('.navbar-nav .nav-item');
            navItems.forEach(item => {
                item.style.flex = '1 1 auto';
                item.style.minWidth = '120px';
                item.style.textAlign = 'center';
            });
        }
        
        // Ajustes para telas médias
        if (screenWidth >= 768 && screenWidth <= 991.98) {
            if (leftMenu) {
                leftMenu.style.justifyContent = 'center';
                leftMenu.style.gap = '0.5rem';
            }
            
            if (rightMenu) {
                rightMenu.style.justifyContent = 'center';
                rightMenu.style.gap = '0.5rem';
                rightMenu.style.marginTop = '0.5rem';
            }
        }
        
        // Ajustes para telas grandes
        if (screenWidth >= 992 && screenWidth <= 1199.98) {
            if (leftMenu) {
                leftMenu.style.justifyContent = 'center';
                leftMenu.style.gap = '0.6rem';
            }
            
            if (rightMenu) {
                rightMenu.style.justifyContent = 'center';
                rightMenu.style.gap = '0.6rem';
                rightMenu.style.marginTop = '0.5rem';
            }
        }
        
        // Ajustes para telas muito grandes
        if (screenWidth >= 1200) {
            if (leftMenu) {
                leftMenu.style.justifyContent = 'center';
                leftMenu.style.gap = '1rem';
            }
            
            if (rightMenu) {
                rightMenu.style.justifyContent = 'flex-end';
                rightMenu.style.gap = '0.8rem';
                rightMenu.style.marginTop = '0';
            }
        }
        
        // Ajustes para telas ultra-wide
        if (screenWidth >= 1400) {
            if (leftMenu) {
                leftMenu.style.gap = '1.2rem';
            }
            
            if (rightMenu) {
                rightMenu.style.gap = '1rem';
            }
        }
    }
    
    // Função para melhorar a experiência do menu mobile
    function enhanceMobileMenu() {
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('.navbar-collapse');
        
        if (!navbarToggler || !navbarCollapse) return;
        
        // Adicionar animação suave ao abrir/fechar menu
        navbarToggler.addEventListener('click', function() {
            setTimeout(() => {
                adjustMenuForScreenSize();
            }, 100);
        });
        
        // Melhorar comportamento dos dropdowns em mobile
        function setupMobileDropdowns() {
            const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
            
            dropdownToggles.forEach(toggle => {
                // Remover listeners anteriores se existirem
                if (toggle._mobileDropdownHandler) {
                    toggle.removeEventListener('click', toggle._mobileDropdownHandler);
                }
                
                // Criar handler específico para mobile
                toggle._mobileDropdownHandler = function(e) {
                    if (window.innerWidth <= 991.98) {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        const dropdown = this.closest('.dropdown');
                        const menu = dropdown.querySelector('.dropdown-menu');
                        
                        // Toggle do dropdown com animação suave
                        if (menu.classList.contains('show')) {
                            menu.classList.remove('show');
                            dropdown.classList.remove('show');
                            menu.style.maxHeight = '0';
                            menu.style.opacity = '0';
                            setTimeout(() => {
                                menu.style.display = 'none';
                            }, 300);
                        } else {
                            // Fechar outros dropdowns abertos
                            document.querySelectorAll('.dropdown-menu.show').forEach(openMenu => {
                                openMenu.classList.remove('show');
                                openMenu.closest('.dropdown').classList.remove('show');
                                openMenu.style.maxHeight = '0';
                                openMenu.style.opacity = '0';
                                setTimeout(() => {
                                    openMenu.style.display = 'none';
                                }, 300);
                            });
                            
                            // Abrir este dropdown com animação
                            menu.style.display = 'block';
                            menu.style.maxHeight = '0';
                            menu.style.opacity = '0';
                            menu.classList.add('show');
                            dropdown.classList.add('show');
                            
                            // Animar abertura
                            setTimeout(() => {
                                menu.style.maxHeight = menu.scrollHeight + 'px';
                                menu.style.opacity = '1';
                            }, 10);
                        }
                    }
                };
                
                // Adicionar o novo handler
                toggle.addEventListener('click', toggle._mobileDropdownHandler);
            });
        }
        
        // Configurar dropdowns inicialmente
        setupMobileDropdowns();
        
        // Reconfigurar dropdowns quando o menu for aberto
        navbarToggler.addEventListener('click', function() {
            setTimeout(setupMobileDropdowns, 100);
        });
        
        // Fechar menu ao clicar em um item (apenas em mobile) - exceto dropdowns
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Não fechar o menu se for um dropdown toggle
                if (this.classList.contains('dropdown-toggle')) {
                    return;
                }
                
                // Não fechar o menu se for um item de dropdown
                if (this.closest('.dropdown-menu')) {
                    return;
                }
                
                // Fechar menu apenas para links normais em mobile
                if (window.innerWidth <= 991.98) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                    bsCollapse.hide();
                }
            });
        });
        
        // Melhorar comportamento do menu collapse
        navbarCollapse.addEventListener('show.bs.collapse', function() {
            this.style.transition = 'all 0.35s ease';
        });
        
        navbarCollapse.addEventListener('hide.bs.collapse', function() {
            this.style.transition = 'all 0.35s ease';
        });
    }
    
    // Função para otimizar o layout do menu
    function optimizeMenuLayout() {
        const screenWidth = window.innerWidth;
        
        // Em desktop, garantir que o menu seja sempre visível
        if (screenWidth >= 992) {
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse) {
                navbarCollapse.classList.remove('collapse');
                navbarCollapse.classList.add('show');
                navbarCollapse.style.display = 'flex';
            }
            
            // Ocultar botão toggle em desktop
            const navbarToggler = document.querySelector('.navbar-toggler');
            if (navbarToggler) {
                navbarToggler.style.display = 'none';
            }
        } else {
            // Em mobile, mostrar botão toggle
            const navbarToggler = document.querySelector('.navbar-toggler');
            if (navbarToggler) {
                navbarToggler.style.display = 'block';
            }
        }
    }
    
    // Função para garantir que o menu seja sempre visível em desktop
    function ensureDesktopMenuVisibility() {
        const screenWidth = window.innerWidth;
        
        if (screenWidth >= 992) {
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse) {
                navbarCollapse.style.display = 'flex';
                navbarCollapse.style.flexDirection = 'row';
                navbarCollapse.style.alignItems = 'center';
                navbarCollapse.style.justifyContent = 'space-between';
                navbarCollapse.style.width = '100%';
                navbarCollapse.classList.remove('collapse');
                navbarCollapse.classList.add('show');
            }
            
            // Garantir que os menus tenham o layout correto
            const leftMenu = document.querySelector('.navbar-nav:first-child');
            const rightMenu = document.querySelector('.navbar-nav:last-child');
            
            if (leftMenu) {
                leftMenu.style.flex = '1';
                leftMenu.style.justifyContent = 'flex-start';
                leftMenu.style.gap = '0.3rem';
                leftMenu.style.marginRight = '1rem';
            }
            
            if (rightMenu) {
                rightMenu.style.flex = '0 0 auto';
                rightMenu.style.justifyContent = 'flex-end';
                rightMenu.style.gap = '0.3rem';
                rightMenu.style.marginLeft = '0';
            }
            
            // Ocultar botão toggle em desktop
            const navbarToggler = document.querySelector('.navbar-toggler');
            if (navbarToggler) {
                navbarToggler.style.display = 'none';
            }
        } else {
            // Em mobile, mostrar botão toggle
            const navbarToggler = document.querySelector('.navbar-toggler');
            if (navbarToggler) {
                navbarToggler.style.display = 'block';
            }
        }
    }
    
    // Função para otimizar o espaçamento dos itens do menu
    function optimizeMenuSpacing() {
        const screenWidth = window.innerWidth;
        
        if (screenWidth >= 992) {
            // Desktop: otimizar espaçamento
            const navItems = document.querySelectorAll('.navbar-nav .nav-item');
            navItems.forEach(item => {
                item.style.margin = '0 0.05rem';
                item.style.flexShrink = '0';
            });
            
            // Ajustar tamanho dos textos e ícones
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                if (screenWidth >= 992 && screenWidth <= 1199.98) {
                    // Telas médias: reduzir ainda mais
                    link.style.padding = '0.3rem 0.5rem';
                    link.style.fontSize = '0.8rem';
                } else if (screenWidth >= 1200 && screenWidth <= 1399.98) {
                    // Telas grandes: tamanho médio
                    link.style.padding = '0.4rem 0.7rem';
                    link.style.fontSize = '0.9rem';
                } else if (screenWidth >= 1400) {
                    // Telas ultra-wide: tamanho normal
                    link.style.padding = '0.5rem 0.9rem';
                    link.style.fontSize = '1rem';
                }
            });
            
            // Garantir que o nome do usuário seja visível
            const userMenu = document.querySelector('.navbar-nav:last-child .nav-link');
            if (userMenu) {
                userMenu.style.maxWidth = '250px';
                userMenu.style.overflow = 'hidden';
                userMenu.style.textOverflow = 'ellipsis';
                userMenu.style.whiteSpace = 'nowrap';
            }
        }
    }
    
    // Função para forçar a visibilidade do menu em desktop
    function forceDesktopMenuVisibility() {
        const screenWidth = window.innerWidth;
        
        if (screenWidth >= 992) {
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse) {
                // Forçar visibilidade
                navbarCollapse.style.display = 'flex';
                navbarCollapse.style.visibility = 'visible';
                navbarCollapse.style.opacity = '1';
                navbarCollapse.style.height = 'auto';
                navbarCollapse.style.overflow = 'visible';
                
                // Remover classes que possam estar escondendo o menu
                navbarCollapse.classList.remove('collapse', 'collapsing');
                navbarCollapse.classList.add('show');
                
                // Garantir que o layout seja horizontal
                navbarCollapse.style.flexDirection = 'row';
                navbarCollapse.style.alignItems = 'center';
                navbarCollapse.style.justifyContent = 'space-between';
                navbarCollapse.style.width = '100%';
            }
            
            // Ocultar botão toggle
            const navbarToggler = document.querySelector('.navbar-toggler');
            if (navbarToggler) {
                navbarToggler.style.display = 'none';
            }
        }
    }
    
    // Executar ajustes iniciais
        adjustMenuForScreenSize();
        optimizeMenuLayout();
    ensureDesktopMenuVisibility();
    optimizeMenuSpacing();
    forceDesktopMenuVisibility();
        
    // Executar ajustes quando a janela for redimensionada
        window.addEventListener('resize', function() {
            adjustMenuForScreenSize();
            optimizeMenuLayout();
        ensureDesktopMenuVisibility();
        optimizeMenuSpacing();
        forceDesktopMenuVisibility();
    });
    
    // Executar ajustes quando o DOM for modificado
    const observer = new MutationObserver(function() {
        adjustMenuForScreenSize();
        optimizeMenuLayout();
        ensureDesktopMenuVisibility();
        optimizeMenuSpacing();
        forceDesktopMenuVisibility();
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Executar ajustes adicionais no carregamento da página
        window.addEventListener('load', function() {
            setTimeout(() => {
            forceDesktopMenuVisibility();
            optimizeMenuSpacing();
            }, 100);
        });
    
    // Executar ajustes adicionais para garantir responsividade
    // Removido setInterval que causava processamento contínuo
    
    // Melhorar menu mobile
    enhanceMobileMenu();
    
    // Ajustes adicionais para garantir responsividade
    function additionalResponsivenessFixes() {
        const screenWidth = window.innerWidth;
        
        // Garantir que o menu seja sempre visível em desktop
        if (screenWidth >= 992) {
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                navbar.style.flexWrap = 'nowrap';
            }
            
            const navbarNav = document.querySelectorAll('.navbar-nav');
            navbarNav.forEach(nav => {
                nav.style.flexDirection = 'row';
                nav.style.alignItems = 'center';
                nav.style.flexWrap = 'nowrap';
            });
        }
        
        // Ajustar tamanho dos itens baseado na tela
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            if (screenWidth >= 992) {
                link.style.whiteSpace = 'nowrap';
                link.style.overflow = 'hidden';
                link.style.textOverflow = 'ellipsis';
            } else {
                link.style.whiteSpace = 'normal';
                link.style.overflow = 'visible';
                link.style.textOverflow = 'clip';
            }
        });
    }
    
    // Executar ajustes adicionais
    additionalResponsivenessFixes();
    
    // Executar ajustes adicionais no redimensionamento
    window.addEventListener('resize', additionalResponsivenessFixes);
});

// Função para verificar se o menu está visível em diferentes resoluções
function checkMenuVisibility() {
    const rightMenu = document.querySelector('.navbar-nav:last-child');
    const leftMenu = document.querySelector('.navbar-nav:first-child');
    
    if (rightMenu) {
        const menuItems = rightMenu.querySelectorAll('.nav-item');
        const visibleItems = Array.from(menuItems).filter(item => {
            const rect = item.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0;
        });
        
        console.log(`Itens visíveis no menu direito: ${visibleItems.length}/${menuItems.length}`);
    }
    
    if (leftMenu) {
        const menuItems = leftMenu.querySelectorAll('.nav-item');
        const visibleItems = Array.from(menuItems).filter(item => {
            const rect = item.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0;
        });
        
        console.log(`Itens visíveis no menu esquerdo: ${visibleItems.length}/${menuItems.length}`);
    }
}

// Exportar função para uso global
window.checkMenuVisibility = checkMenuVisibility; 