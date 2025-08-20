// tunnel scrolling and interaction logic

document.addEventListener('DOMContentLoaded', () => {
    initializeTunnel();
});

function initializeTunnel() {
    // hide loading screen after a short delay
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    }, 1500);

    // get elements
    const tunnelContainer = document.getElementById('tunnel-container');
    const tunnelContent = document.getElementById('tunnel-content');
    const tunnelGrid = document.getElementById('tunnel-grid');
    const sections = document.querySelectorAll('.tunnel-section');
    const depthCounter = document.getElementById('depth-counter');
    const depthProgress = document.getElementById('depth-progress');
    const scrollIndicator = document.querySelector('.scroll-indicator');

    // create wireframe grid
    createWireframeGrid();

    // update tunnel based on scroll
    function updateTunnel() {
        const scrollY = window.scrollY;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const scrollProgress = Math.min(scrollY / maxScroll, 1);
        
        // update depth indicator
        const depth = Math.round(scrollProgress * 500);
        depthCounter.textContent = `${depth}m`;
        depthProgress.style.width = `${scrollProgress * 100}%`;

        // hide scroll indicator after initial scroll
        if (scrollY > 100) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.pointerEvents = 'none';
        } else {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.pointerEvents = 'auto';
        }

        // update tunnel grid animation
        animateWireframeGrid(scrollProgress);

        // move content sections through tunnel
        sections.forEach((section, index) => {
            const sectionProgress = index / (sections.length - 1);
            // reverse direction - we're moving into the tunnel
            const distance = (sectionProgress - scrollProgress) * -5000;
            
            // position section in z-space
            const z = distance;
            
            // show sections from much farther away
            if (z > -2000 && z < 5000) {
                section.style.visibility = 'visible';
                section.style.transform = `translateZ(${z}px)`;
                
                // smoother fade based on distance
                let opacity;
                if (z > 4000) {
                    // very far sections fade in gradually
                    opacity = Math.max(0, (5000 - z) / 1000) * 0.3;
                } else if (z > 2000) {
                    // distant sections becoming visible
                    opacity = 0.3 + ((4000 - z) / 2000) * 0.4;
                } else if (z > 500) {
                    // approaching sections fade in smoothly
                    opacity = 0.7 + ((2000 - z) / 1500) * 0.3;
                } else if (z > -500) {
                    // sections right around us are fully visible
                    opacity = 1;
                } else if (z > -1500) {
                    // sections we just passed fade out gradually
                    opacity = Math.max(0, 1 - ((Math.abs(z) - 500) / 1000));
                } else {
                    // far behind sections fade completely
                    opacity = 0;
                }
                section.style.opacity = opacity;
                // removed transition to prevent jitter
                
                // smoother panel scaling based on depth
                const panels = section.querySelectorAll('.panel');
                panels.forEach((panel, panelIndex) => {
                    let scale;
                    if (z > 4000) {
                        // very far panels start tiny
                        scale = 0.1 + ((5000 - z) / 1000) * 0.05;
                    } else if (z > 3000) {
                        // distant panels growing
                        scale = 0.15 + ((4000 - z) / 1000) * 0.1;
                    } else if (z > 2000) {
                        // far panels more visible
                        scale = 0.25 + ((3000 - z) / 1000) * 0.2;
                    } else if (z > 1000) {
                        // approaching panels
                        scale = 0.45 + ((2000 - z) / 1000) * 0.25;
                    } else if (z > 0) {
                        // close panels near full size
                        scale = 0.7 + ((1000 - z) / 1000) * 0.3;
                    } else if (z > -500) {
                        // panels at viewing position
                        scale = 1;
                    } else if (z > -1500) {
                        // panels we're passing grow slightly
                        scale = 1 + Math.min(0.1, (Math.abs(z) - 500) / 1000);
                    } else {
                        // panels far behind shrink
                        scale = Math.max(0.8, 1.1 - (Math.abs(z) - 1500) / 2000);
                    }
                    
                    const parallaxOffset = (sectionProgress - scrollProgress) * 40 * (panelIndex % 2 === 0 ? -1 : 1);
                    panel.style.transform = `scale(${scale}) translateX(${parallaxOffset}px)`;
                    // removed transition to prevent jitter
                });
            } else {
                section.style.visibility = 'hidden';
            }
        });

        // subtle rotation of entire tunnel
        tunnelContent.style.transform = `rotateZ(${Math.sin(scrollProgress * Math.PI * 2) * 1}deg)`;
    }

    // create the wireframe grid structure
    function createWireframeGrid() {
        // create multiple grid segments for depth
        const segmentCount = 25;
        const gridHTML = [];
        
        for (let i = 0; i < segmentCount; i++) {
            // reverse the sizing - start small and get bigger as we go deeper
            const size = 50 + (i * 10); // start smaller, increase more dramatically
            const opacity = 0.1 + (i * 0.03); // start faint, get brighter as we go deeper
            
            // start grid lines further ahead by adding initial offset
            const initialZOffset = -2000; // start 2000px ahead in the tunnel
            
            gridHTML.push(`
                <div class="grid-segment" data-segment="${i}" style="
                    transform: translateZ(${initialZOffset + (i * -400)}px);
                    opacity: ${Math.min(opacity, 1)};
                ">
                    <div class="grid-ring" style="
                        width: ${size}px;
                        height: ${size}px;
                        border-color: rgba(0, 255, 255, ${Math.min(opacity, 0.8)});
                    "></div>
                </div>
            `);
        }
        
        // add connecting lines between rings
        for (let angle = 0; angle < 360; angle += 30) {
            gridHTML.push(`
                <div class="grid-line" style="
                    transform: rotateZ(${angle}deg) translateX(100px);
                    height: 10000px;
                    background: linear-gradient(to bottom,
                        transparent 0%,
                        rgba(0, 255, 255, 0.1) 20%,
                        rgba(0, 255, 255, 0.2) 50%,
                        rgba(0, 255, 255, 0.1) 80%,
                        transparent 100%);
                "></div>
            `);
        }
        
        tunnelGrid.innerHTML = gridHTML.join('');
    }

    // animate the wireframe grid based on scroll
    function animateWireframeGrid(scrollProgress) {
        const gridSegments = document.querySelectorAll('.grid-segment');
        
        gridSegments.forEach((segment, index) => {
            const initialZOffset = -2000; // match the initial offset from createWireframeGrid
            const baseZ = initialZOffset + (index * -400); // match the spacing from createWireframeGrid
            const scrollOffset = scrollProgress * 6000; // move forward into the tunnel
            const z = baseZ + scrollOffset;
            
            // set transform without looping for smoother effect
            segment.style.transform = `translateZ(${z}px)`;
            
            // smooth opacity based on distance
            let opacity;
            if (z > 200) {
                // rings we've passed through fade out smoothly
                opacity = Math.max(0, 1 - ((z - 200) / 800));
            } else if (z > -3000) {
                // rings in view or approaching
                const distanceFactor = Math.abs(z) / 3000;
                opacity = 1 - (distanceFactor * 0.7);
            } else {
                // far away rings barely visible
                opacity = 0.3;
            }
            
            // apply opacity with smooth transition
            segment.style.opacity = Math.max(0.1, Math.min(1, opacity));
            segment.style.transition = 'opacity 0.3s ease-out';
            
            // scale rings based on distance for perspective
            const ring = segment.querySelector('.grid-ring');
            if (ring) {
                let scale;
                if (z > 0) {
                    // rings behind us get bigger
                    scale = 1 + (z / 500);
                } else {
                    // rings ahead stay proportional to distance
                    scale = Math.max(0.1, 1 + (z / 3000));
                }
                
                // subtle pulse only for very close rings
                const pulse = (z > -200 && z < 200) ? 
                    1 + Math.sin(Date.now() * 0.002 + index) * 0.02 : 
                    1;
                    
                ring.style.transform = `translate(-50%, -50%) scale(${Math.max(0.1, scale * pulse)})`;
                ring.style.transition = 'transform 0.2s ease-out';
            }
        });
        
        // rotate grid lines for motion effect - move in same direction as rings
        const gridLines = document.querySelectorAll('.grid-line');
        gridLines.forEach((line, index) => {
            // rotate in the same direction as we move forward
            line.style.transform = `
                rotateZ(${index * 30 + scrollProgress * 15}deg) 
                translateX(100px)
            `;
            line.style.transition = 'transform 0.1s linear';
        });
    }



    // initialize panel interactions
    function initializePanelInteractions() {
        const panels = document.querySelectorAll('.panel');
        
        panels.forEach(panel => {
            panel.addEventListener('mouseenter', () => {
                panel.style.animation = 'pulse 0.5s';
            });
            
            panel.addEventListener('mouseleave', () => {
                panel.style.animation = '';
            });
        });
    }

    // keyboard navigation
    function initializeKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            const scrollAmount = window.innerHeight / 2;
            
            switch(e.key) {
                case 'ArrowDown':
                case ' ':
                    e.preventDefault();
                    window.scrollBy({
                        top: scrollAmount,
                        behavior: 'smooth'
                    });
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    window.scrollBy({
                        top: -scrollAmount,
                        behavior: 'smooth'
                    });
                    break;
                case 'Home':
                    e.preventDefault();
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                    break;
                case 'End':
                    e.preventDefault();
                    window.scrollTo({
                        top: document.body.scrollHeight,
                        behavior: 'smooth'
                    });
                    break;
            }
        });
    }

    // smooth scroll with wheel
    let isScrolling = false;
    let scrollTimeout;
    let lastScrollTime = 0;
    let scrollVelocity = 0;
    
    function smoothScroll(e) {
        e.preventDefault();
        
        const now = Date.now();
        const timeDelta = now - lastScrollTime;
        lastScrollTime = now;
        
        // calculate smooth scroll amount with momentum
        const delta = e.deltaY;
        const targetVelocity = delta * 0.5;
        
        // smooth out the velocity changes
        scrollVelocity = scrollVelocity * 0.8 + targetVelocity * 0.2;
        
        window.scrollBy({
            top: scrollVelocity,
            behavior: 'auto'
        });
        
        if (!isScrolling) {
            isScrolling = true;
            requestAnimationFrame(() => updateTunnel());
        }
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            isScrolling = false;
            scrollVelocity = 0;
        }, 150);
    }

    // create ambient particles
    function createAmbientParticles() {
        const particleContainer = document.createElement('div');
        particleContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `;
        document.body.appendChild(particleContainer);
        
        // create floating particles
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 3 + 1}px;
                height: ${Math.random() * 3 + 1}px;
                background: rgba(0, 255, 255, ${Math.random() * 0.5 + 0.2});
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float-particle ${Math.random() * 15 + 10}s infinite linear;
                box-shadow: 0 0 ${Math.random() * 10 + 5}px rgba(0, 255, 255, 0.5);
            `;
            particleContainer.appendChild(particle);
        }
        
        // add particle animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float-particle {
                0% {
                    transform: translateY(100vh) translateX(0);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 1;
                }
                100% {
                    transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px);
                    opacity: 0;
                }
            }
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
        `;
        document.head.appendChild(style);
    }

    // continuous animation loop for smooth rendering
    let animationId;
    let lastTime = 0;
    const targetFPS = 60;
    const frameInterval = 1000 / targetFPS;
    
    function animate(currentTime) {
        const deltaTime = currentTime - lastTime;
        
        // throttle to target FPS to reduce jitter
        if (deltaTime >= frameInterval) {
            updateTunnel();
            lastTime = currentTime - (deltaTime % frameInterval);
        }
        
        animationId = requestAnimationFrame(animate);
    }
    
    // initialize everything
    initializePanelInteractions();
    initializeKeyboardNavigation();
    createAmbientParticles();
    
    // set up event listeners
    window.addEventListener('wheel', smoothScroll, { passive: false });
    window.addEventListener('resize', updateTunnel);
    
    // start animation loop
    animate();
    
    // cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    });
    
    // log initialization
    console.log('tunnel initialized - ready to explore');
    console.log('sections found:', sections.length);
}