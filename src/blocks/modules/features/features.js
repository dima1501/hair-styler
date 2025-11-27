document.addEventListener('DOMContentLoaded', function () {
    gsap.registerPlugin(Observer);

    // параметры колеса
    const gap = 120;
    const radius = 700 / 2;
    const angleStep = (gap / radius) * (180 / Math.PI);

    // элементы
    const screens = gsap.utils.toArray(".features__content-screen");
    const wheel = document.querySelector(".f-controls");
    const wheelItems = gsap.utils.toArray(".f-controls__item");

    let index = 0;
    let animating = false;

    const visualOffset = 2;

    gsap.set(screens[0], { autoAlpha: 1 });
    screens[0].classList.add("is-active");
    wheelItems.forEach((el, i) => el.classList.toggle("active", i === gsap.utils.wrap(0, wheelItems.length, 0 + visualOffset)));

    function updateActive(newIndex) {
        const activeIndex = gsap.utils.wrap(0, wheelItems.length, newIndex + visualOffset);
        wheelItems.forEach((el, i) => el.classList.toggle("active", i === activeIndex));
    }

    function gotoScreen(newIndex, direction) {
        if (animating) return;

        newIndex = gsap.utils.wrap(0, screens.length, newIndex);
        animating = true;

        const current = screens[index];
        const next = screens[newIndex];

        const tl = gsap.timeline({
            defaults: { duration: 1, ease: "power2.inOut" },
            onComplete: () => {
                animating = false;
                index = newIndex;
            }
        });

        // текущий экран
        tl.to(current, {
            autoAlpha: 0,
            yPercent: direction === 1 ? -30 : 30,
        }, 0);

        // новый экран
        tl.fromTo(next, {
            autoAlpha: 0,
            yPercent: direction === 1 ? 30 : -30,
        }, {
            autoAlpha: 1,
            yPercent: 0,
        }, 0);

        // колесо поворот
        tl.to(wheel, {
            rotate: angleStep * newIndex * -1,
        }, 0);

        tl.to(wheelItems, {
            rotate: (i) => angleStep * newIndex,
            duration: 1,
            ease: "power2.inOut"
        }, 0);

        // переключение класса active
        updateActive(newIndex);

        current.classList.remove("is-active");
        next.classList.add("is-active");
    }

    // скролл смена экрана
    Observer.create({
        type: "wheel,touch,pointer",
        wheelSpeed: -1,
        onUp: () => gotoScreen(index + 1, 1),
        onDown: () => gotoScreen(index - 1, -1),
        tolerance: 10,
        preventDefault: true,
    });

    // старт
    gotoScreen(0, 1);

})