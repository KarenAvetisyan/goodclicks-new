document.addEventListener('DOMContentLoaded', function(){
        /*Easy selector helper function */
        const select = (el, all = false) => {
                el = el.trim()
                if (all) {
                return [...document.querySelectorAll(el)]
                } else {
                return document.querySelector(el)
                }
        }
        /* Easy event listener function */
        const on = (type, el, listener, all = false) => {
                let selectEl = select(el, all)
                if (selectEl) {
                if (all) {
                selectEl.forEach(e => e.addEventListener(type, listener))
                } else {
                selectEl.addEventListener(type, listener)
                }
                }
        }
        /* Easy on scroll event listener  */
        const onscroll = (el, listener) => {
        el.addEventListener('scroll', listener)
        }
        
        // якоря 
        document.body.addEventListener('click', function(e) {
        if (!e.target.matches('.scrollTo')) return;
        let href = e.target.getAttribute('href');
        if (!href) return;
        if (href.startsWith('/')) href = href.slice(1);
        if (href.startsWith('#')) {
                const targetElement = document.querySelector(href);
                if (!targetElement) return;

                e.preventDefault();

                const header = document.querySelector('.header');
                const headerHeight = header ? header.offsetHeight : 0;
                const duration = 800; // Faster scroll (800ms)
                const start = window.scrollY;
                let startTime = null;

                function easeInOutQuad(t) {
                return t < 0.5 ? 2*t*t : -1 + (4 - 2*t)*t;
                }

                function step(timestamp) {
                if (!startTime) startTime = timestamp;
                const elapsed = timestamp - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = easeInOutQuad(progress);

                // Recalculate target position dynamically
                const targetY = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
                const scrollTo = start + (targetY - start) * easedProgress;

                window.scrollTo(0, scrollTo);

                if (progress < 1) {
                        requestAnimationFrame(step);
                }
                }

                requestAnimationFrame(step);
        }
        }, true);

        // бургер
        on('click', '.js-burger', function(e){
                select('.header').classList.toggle('header__nav-show');
        })
        on('click', '.header__nav-link',  function(e){
                e.preventDefault();
                select('.header').classList.toggle('header__nav-show');
        }, true)

        // марквеве 
        const marq = document.querySelector('.partners__marq');

        function initMarquee() {
                const items = marq.querySelectorAll('img');
                const count = items.length;
                marq.style.setProperty('--count', count);
                items.forEach((el, i) => {
                el.style.setProperty('--i', i + 1);
                });
                }
        initMarquee();
                
        // swiper slider 
        const mq = window.matchMedia('(max-width: 992px)');
        let swiperInstance = null;
        let swiperLoaded = false;

        function loadSwiperScript() {
        return new Promise((resolve) => {
        if (swiperLoaded) return resolve();

        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.js';
        script.onload = () => {
                swiperLoaded = true;
                resolve();
        };
                document.body.appendChild(script);
        });
        }

        // инициализация
        async function initSwiper() {
        if (swiperInstance) return;

        await loadSwiperScript();

                swiperInstance = new Swiper('.mobile-slider', {
                        slidesPerView: 'auto',
                        centeredSlides: true,
                        spaceBetween: 8,
                        speed: 400,
                        initialSlide: 1,
                        pagination: {
                                el: '.swiper-pagination',
                                clickable: true
                        }
                });
        }

        // уничтожение
        function destroySwiper() {
        if (!swiperInstance) return;
                swiperInstance.destroy(true, true);
                swiperInstance = null;
        }

        // основной контроллер
        async function handleSlider(e) {
        if (e.matches) {
                await initSwiper();
        } else {
                destroySwiper();
        }
        }
        handleSlider(mq);
        mq.addEventListener('change', handleSlider);


        // observer, анимация на скролле 
        const inViewport = (entries, observer) => {
        entries.forEach(entry => {
                const el = entry.target;

                el.classList.toggle("is-inViewport", entry.isIntersecting);

                if (entry.isIntersecting && !el.classList.contains('watched')) {
                let delay = el.getAttribute('data-delay');
                if (window.innerWidth < 992 && delay) {
                        const delayNum = parseFloat(delay) || 0;
                        delay = Math.min(delayNum, 0.2) + 's';
                }

                if (delay) {
                        el.style.transitionDelay = delay;
                        el.style.animationDelay = delay;
                }

                el.classList.add("watched");
                }
        });
        };

        let ioConfiguration = {
        rootMargin: '0% 0% 0% 0%',
        threshold: 0.2
        };

        const Obs = new IntersectionObserver(inViewport, ioConfiguration);
        document.querySelectorAll('[data-inviewport]').forEach(EL => {
        Obs.observe(EL);
        });

})
