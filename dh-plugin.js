// import "/src/scss/css-modules/dynamic-header.scss";
// import "/src/scss/dh-docs.scss";

export const dynamicHeader = function (header, options = {}) {
    if (!document.querySelector("header")) return;
    if (!header) {
        console.error("header selector/tag required");
        return;
    }
    let {
        menuIcon = ".header__burger",
        menuBody = ".header__menu-wrapper",
        menuItem = ".header__menu-item",
        menuLink = ".header__menu-link",
        shouldMenuOffsetHeader = false,
        pageLock = false,
		pageLockClass = "lock",
        menu = true,
        scrollWatch = false,
        headerScroll = false,
        dynamic = false,
        mediaQuery = false,
        scrollLock = false,
        shouldScrollOffsetHeader = false,
        shouldSmoothScroll = true,
        scrollMargin = 0,
        mainElement = false,
        mainElementScrollMargin = 0,
        menuItemActive = "active",
        menuOpenClass = "menu--open",
        hideClass = "visually-hidden",
        menuIconActive = "header__burger--active",
        on,
    } = options;
    const headerElem = document.querySelector(header);
    if (!headerElem) {
        console.error(`Не найден элемент с селектором "${header}"`);
        return;
    }
    const headerHeight = headerElem.offsetHeight;
    const menuIconElem = headerElem.querySelector(menuIcon);
    const menuBodyElem = headerElem.querySelector(menuBody);

    const mql = window.matchMedia(`(max-width: ${mediaQuery}px)`);

    if (menu && (!menuIconElem || !menuBodyElem)) {
        throw new Error(
            "\nНе заполнены обязательные поля:\nmenuIcon: class required\nmenuBody: class required"
        );
    }
    function objectConversion(mainParam, params, mainParamName) {
        if (mainParam) {
            const expectedKeys = Object.keys(mainParam);
            const requiredKeys = Object.keys(params);
            const invalidKeys = expectedKeys.filter((key) => !(key in params));

            if (invalidKeys.length > 0) {
                console.error(
                    `${mainParam} ${mainParamName}:\nInvalid keys: \n${invalidKeys.join(
                        ", \n"
                    )}\n-----------------\nAvailable keys: \n${requiredKeys.join(
                        ", \n"
                    )}`
                );
            }

            mainParam = { ...params, ...mainParam };
        }
        return mainParam;
    }
    const allObjectConversions = function () {
        const headerScrollParams = {
            headerScrollPosition: headerHeight,
            headerScrollEndPosition: false,
            headerScrollMobile: false,
            headerScrollClass: "header-dark",
        };
        headerScroll = objectConversion(
            headerScroll,
            headerScrollParams,
            "headerScroll"
        );

        const scrollLockParams = {
            scrollLockClass: "scroll-locked",
            scrollLockDesktop: true,
            scrollLockArray: [header],
        };
        scrollLock = objectConversion(
            scrollLock,
            scrollLockParams,
            "scrollLock"
        );
    };

    let stateOpen = shouldMenuOffsetHeader
        ? `top: ${headerElem.offsetHeight - 5}px;`
        : `top: 0;`;

    const stateHide = function () {
        if (menuOpenClass) {
            menuBodyElem.classList.remove(menuOpenClass);
        }
        menuBodyElem.style.cssText = `top: -${menuBodyElem.offsetHeight}px;`;
    };

    const menuState = function (state) {
        if (!menu || !menuBodyElem || !menuIconElem) {
            return console.error(
                "MenuState: \nRequired elements: \nmenu\nmenuBody\nmenuIcon"
            );
        }

        if (state == stateHide) {
            state();
            if (menuIconActive) {
                menuIconElem.classList.remove(menuIconActive);
            }
            if (pageLock) {
                document.documentElement.classList.remove(pageLockClass);
            }
        } else {
            menuBodyElem.style.cssText = state;

            if (menuIconActive) {
                menuIconElem.classList.add(menuIconActive);
            }
            if (pageLock) {
                document.documentElement.classList.add(pageLockClass);
            }
        }
    };

    const headerMenuOpen = function () {
        if (!menu) {
            return;
        }

        menuState(stateOpen);

        let { scrollLockArray, scrollLockClass } = scrollLock;

        if (scrollLock && scrollLockArray && scrollLockArray.length > 0) {
            scrollLockArray.forEach((el) => {
                document.querySelector(el).classList.add(scrollLockClass);
            });
        }

        setTimeout(() => {
            menuBodyElem.style.transition = "top 0s";
        }, 100);

        menuIconElem.blur();
        // window.addEventListener("click", headerMenuCloseTriggers);
        // window.addEventListener("keydown", menuKeyClose);
        // document.addEventListener("touchmove", handleTouchMove, {
        //     passive: false,
        // });
        // document.addEventListener("wheel", handleWheel, { passive: false });
        attachEvent(window, "click", headerMenuCloseTriggers);
        attachEvent(window, "keydown", menuKeyClose);
        attachEvent(document, "touchmove", handleTouchMove, { passive: false });
        attachEvent(document, "wheel", handleWheel, { passive: false });
    };

    const headerMenuClose = function () {
        if (!menu) {
            return;
        }

        menuState(stateHide);

        let { scrollLockClass, scrollLockArray } = scrollLock;

        if (scrollLock && scrollLockArray && scrollLockArray.length > 0) {
            scrollLockArray.forEach((scrollLockElement) => {
                document
                    .querySelector(scrollLockElement)
                    .classList.remove(scrollLockClass);
            });
        }

        window.removeEventListener("click", headerMenuCloseTriggers);
        window.removeEventListener("keydown", menuKeyClose);
        document.removeEventListener("touchmove", handleTouchMove, {
            passive: false,
        });
        document.removeEventListener("wheel", handleWheel, { passive: false });
    };

    const headerMenuCloseTriggers = function (event) {
        if (!menu) {
            return;
        }

        const stringTypeCheck = function (target) {
            return typeof target === "string"
                ? target
                : console.error(
                      `DynamicHeader: Указан неверный тип данных. Используйте класс для доступа к элементу:`,
                      target
                  );
        };

        const target = event.target;

        const menuBodySelector = stringTypeCheck(menuBody);
        const headerSelector = stringTypeCheck(header);
        const menuLinkSelector = stringTypeCheck(menuLink);

        if (
            (!target.closest(`${menuBodySelector}.${menuOpenClass}`) &&
                !target.closest(headerSelector)) ||
            target.closest(menuLinkSelector)
        ) {
            headerMenuClose();
        }
    };

    const menuKeyClose = function (event) {
        if (menu && event.code === "Escape") {
            headerMenuCloseTriggers(event);
        }
    };

    const handleTouchMove = function (event) {
        let { scrollLockClass } = scrollLock;
        if (menu && scrollLock && event.target.closest(`.${scrollLockClass}`)) {
            event.preventDefault();
        }
    };

    const handleWheel = function (event) {
        let { scrollLockClass, scrollLockDesktop } = scrollLock;
        if (
            scrollLock &&
            scrollLockDesktop &&
            event.target.closest(`.${scrollLockClass}`)
        ) {
            event.preventDefault();
        }
    };

    const headerPositionCheck = function () {
        if (mainElement) {
            const headerStyles = window.getComputedStyle(headerElem);
            const headerPosition = headerStyles.getPropertyValue("position");

            const main = document.querySelector(mainElement);
            if (main) {
                if (headerPosition == "absolute" || headerPosition == "fixed") {
                    main.style.marginTop = `${
                        headerElem.offsetHeight +
                        (mainElementScrollMargin ? mainElementScrollMargin : 0)
                    }px`;
                    headerElem.style.marginBottom = "";
                } else {
                    headerElem.style.marginBottom =
                        0 +
                        (mainElementScrollMargin
                            ? mainElementScrollMargin
                            : 0) +
                        "px";
                    main.style.marginTop = "";
                }
            }
        }
    };

    const headerHide = function () {
        if (dynamic) {
            const headerWithoutDot = header.replace(/^\./, "");
            headerElem.classList.add(`${headerWithoutDot}--dynamic`);
            const dynamicHeader = document.querySelector(`${header}--dynamic`);
            dynamicHeader.style.position = "fixed";

            let elemY = 0;
            let scroll = 0;

            const headerHideHandler = function () {
                const pos = window.pageYOffset;
                const headerHeight = headerElem.offsetHeight;
                const diff = scroll - pos;

                elemY = Math.min(0, Math.max(-headerHeight, elemY + diff));

                if (menu) {
                    stateOpen = shouldMenuOffsetHeader
                        ? `top: ${elemY + (headerHeight - 5)}px`
                        : `top: 0`;
                }

                if (menu && menuBodyElem.classList.contains(menuOpenClass)) {
                    menuBodyElem.style.top = `${elemY + (headerHeight - 5)}px`;
                }

                headerElem.style.top = `${elemY}px`;

                scroll = pos;
            };
            headerHideHandler();
            // window.addEventListener("scroll", headerHideHandler);
            attachEvent(window, "scroll", headerHideHandler);
        }
    };

    const headerScrollWatcher = function () {
        let {
            headerScrollPosition,
            headerScrollEndPosition,
            headerScrollMobile,
            headerScrollClass,
        } = headerScroll;

        let scrollPosition =
            headerScrollPosition !== undefined && headerScrollPosition !== false
                ? headerScrollPosition
                : headerHeight;

        let scrollEndPosition =
            headerScrollEndPosition !== undefined &&
            headerScrollEndPosition !== false
                ? headerScrollEndPosition
                : (headerScrollEndPosition =
                      scrollPosition > 0 ? scrollPosition - 1 : scrollPosition);
        const handleScrollWatch = function () {
            const pos = window.pageYOffset;
            const isMobile = headerScrollMobile ? true : !mql.matches;

            if (isMobile && pos >= scrollPosition) {
                headerElem.classList.add(headerScrollClass);
            } else if (pos <= scrollEndPosition) {
                headerElem.classList.remove(headerScrollClass);
            }
            headerPositionCheck();
        };
        if (scrollPosition >= scrollEndPosition) {
            // window.addEventListener("scroll", handleScrollWatch);
            attachEvent(window, "scroll", handleScrollWatch);
            handleScrollWatch();
        } else {
            headerElem.classList.remove(headerScrollClass);
            window.removeEventListener("scroll", handleScrollWatch);

            console.error(
                `headerScrollEndPosition must be less than or equal to headerScrollPosition`
            );
        }
    };

    const scrollWatcher = function () {
        if (scrollWatch && menuItem) {
            const menuItems = headerElem.querySelectorAll(menuItem);
            const headerHeight = headerElem.offsetHeight;
            const headerHeightTimes2 = headerHeight * 2;

            const handleScroll = function () {
                const scrollPosition = window.pageYOffset;
                let currentActiveMenuItem = null;

                menuItems.forEach((menuItem) => {
                    const targetId = menuLink
                        ? menuItem.querySelector(menuLink).getAttribute("href")
                        : menuItem.querySelector("a").getAttribute("href");
                    if (!targetId) {
                        console.error(
                            `${header}:\nОтсутствует тег "a" в menuItem, либо атрибут href.`
                        );
                        return;
                    }
                    const section = document.querySelector(targetId);
                    if (!section) {
                        console.error(
                            `${header}:\nОтсутствуют section с id, соответствующим href в menuLink.`
                        );
                        return;
                    }
                    const sectionTop =
                        section.getBoundingClientRect().top + scrollPosition;
                    const isSectionVisible =
                        sectionTop <= scrollPosition + headerHeightTimes2;

                    if (isSectionVisible) {
                        currentActiveMenuItem = menuItem;
                    }
                });

                menuItems.forEach((menuItem) => {
                    menuItem.classList.remove(menuItemActive);
                });

                if (currentActiveMenuItem) {
                    currentActiveMenuItem.classList.add(menuItemActive);
                }
            };

            // window.addEventListener("scroll", handleScroll);
            attachEvent(window, "scroll", handleScroll);
            handleScroll();
        }
    };

    let headerHeightEventAdded = false;
    const headerHeightAccounting = function () {
        const headerHeight = headerElem.offsetHeight;
        const anchorLinks = document.querySelectorAll(`a[href^="#"]`);

        if (!anchorLinks) {
            console.error(
                `${headerHeightAccounting.name}:\nНа странице отсутствуют ссылки`
            );
            return;
        }

        const headerStyles = window.getComputedStyle(headerElem);
        const headerPosition = headerStyles.getPropertyValue("position");

        anchorLinks.forEach((link) => {
            const handleHeightAccounting = function (event) {
                event.preventDefault();
                const targetId = link.getAttribute("href");
                if (targetId === "#") {
                    const scrollOptions = {
                        top: 0,
                        behavior: shouldSmoothScroll ? "smooth" : "auto",
                    };
                    window.scrollTo(scrollOptions);
                } else {
                    const targetElement = document.querySelector(targetId);

                    if (targetElement) {
                        const offsetTop =
                            targetElement.getBoundingClientRect().top;

                        let scrollOptions = {};

                        scrollOptions.behavior = shouldSmoothScroll
                            ? "smooth"
                            : "auto";

                        if (shouldScrollOffsetHeader) {
                            if (
                                !dynamic ||
                                (dynamic &&
                                    anchorLinks.length > 0 &&
                                    link == anchorLinks[0])
                            ) {
                                if (headerPosition == "fixed") {
                                    if (
                                        anchorLinks.length > 0 &&
                                        link == anchorLinks[0]
                                    ) {
                                        scrollOptions.top =
                                            offsetTop -
                                            headerHeight -
                                            mainElementScrollMargin;
                                    } else {
                                        scrollOptions.top =
                                            offsetTop -
                                            headerHeight -
                                            scrollMargin;
                                    }
                                } else {
                                    if (
                                        anchorLinks.length > 0 &&
                                        link == anchorLinks[0]
                                    ) {
                                        scrollOptions.top =
                                            offsetTop -
                                            headerHeight -
                                            mainElementScrollMargin;
                                    } else {
                                        scrollOptions.top =
                                            offsetTop - scrollMargin;
                                    }
                                }
                            } else {
                                if (dynamic) {
                                    if (
                                        //! experimental "+ headerHeight"
                                        targetElement.getBoundingClientRect()
                                            .y <
                                        0 + headerHeight
                                    ) {
                                        scrollOptions.top =
                                            offsetTop -
                                            headerHeight -
                                            scrollMargin;
                                    } else {
                                        scrollOptions.top =
                                            offsetTop - scrollMargin;
                                    }
                                }
                            }
                        } else {
                            if (dynamic) {
                                if (
                                    anchorLinks.length > 0 &&
                                    link == anchorLinks[0]
                                ) {
                                    scrollOptions.top =
                                        offsetTop -
                                        headerHeight -
                                        mainElementScrollMargin;
                                } else {
                                    scrollOptions.top =
                                        offsetTop - scrollMargin;
                                }
                            } else {
                                if (
                                    anchorLinks.length > 0 &&
                                    link == anchorLinks[0]
                                ) {
                                    scrollOptions.top =
                                        offsetTop -
                                        headerHeight -
                                        mainElementScrollMargin;
                                } else {
                                    scrollOptions.top =
                                        offsetTop - scrollMargin;
                                }
                            }
                        }

                        window.scrollBy(scrollOptions);
                    }
                }
            };
            if (!headerHeightEventAdded) {
                // link.addEventListener("click", handleHeightAccounting);
                attachEvent(link, "click", handleHeightAccounting);
            }
        });
    };

    const menuToggle = function () {
        if (menu && menuBodyElem) {
            menuBodyElem.classList.toggle(menuOpenClass);
            if (menuBodyElem.classList.contains(menuOpenClass)) {
                headerMenuOpen();
            } else {
                headerMenuClose();
            }
        }
    };

    let menuIconEventAdded = false;
    const menuIconFunc = function () {
        if (menu && menuIconElem && menuIcon && !menuIconEventAdded) {
            // menuIconElem.addEventListener("click", menuToggle);
            attachEvent(menuIconElem, "click", menuToggle);
            menuIconEventAdded = true;
            menuIconElem.classList.remove(hideClass);
        }
    };

    const mqlCheck = function () {
        if (!mql) {
            console.error("MediaQuery is not defined");
            return;
        }

        if (menu) {
            const handleMqlChange = function (event) {
                const headerWithoutDot = header.replace(/^\./, "");
                if (event.matches) {
                    headerElem.classList.add(`${headerWithoutDot}--mobile`);
                    menuIconFunc();
                    if (menuBodyElem.classList.contains(menuOpenClass)) {
                        headerMenuOpen();
                        menuBodyElem.style.transition = "top 0s";
                    } else {
                        headerMenuClose();
                    }
                    const { headerScrollMobile, headerScrollClass } =
                        headerScroll;
                    if (!headerScrollMobile) {
                        headerElem.classList.remove(headerScrollClass);
                    }
                } else {
                    menuIconElem.removeEventListener("click", menuToggle);
                    menuIconEventAdded = false;
                    menuIconElem.classList.add(hideClass);
                    headerElem.classList.remove(`${headerWithoutDot}--mobile`);
                }
            };

            // mql.addEventListener("change", handleMqlChange);
            attachEvent(mql, "change", handleMqlChange);
            handleMqlChange(mql);
        }
    };

    const customFunction = function () {
        if (on && typeof on.customEvent === "function") {
            on.customEvent();
        }
    };

    const handleScrollChange = function () {
        headerPositionCheck();
        // headerHeightAccounting();
    };

    const handleMediaQueryChange = function () {
        headerHide();

        headerPositionCheck();

        headerHeightAccounting();
        headerHeightEventAdded = true;

        headerScroll && headerScrollWatcher();
    };

    allObjectConversions();
    headerScroll && headerScrollWatcher();
    headerHide();
    scrollWatcher();
    headerHeightAccounting();
    headerPositionCheck();
    mqlCheck();
    customFunction();
    // window.addEventListener("scroll", handleScrollChange);
    attachEvent(window, "scroll", handleScrollChange);
    // mql.addEventListener("change", handleMediaQueryChange);
    attachEvent(mql, "change", handleMediaQueryChange);

    function attachEvent(element, event, handler, options) {
        element.addEventListener(event, handler, options);
        return {
            unsubscribe() {
                element.removeEventListener(event, handler);
            },
        };
    }

    const destroy = function () {
        menuIconElem.removeEventListener("click", menuToggle);
        // menuIconEventAdded = false;
        window.removeEventListener("scroll", handleScrollChange);
        mql.removeEventListener("change", handleMediaQueryChange);
    };

    return {
        header,
        menuIcon,
        menuBody,
        menuItem,
        menuLink,
        menu,
        scrollWatch,
        headerScroll,
        dynamic,
        mediaQuery,
        scrollLock,
        shouldScrollOffsetHeader,
        shouldSmoothScroll,
        scrollMargin,
        mainElement,
        mainElementScrollMargin,
        menuItemActive,
        menuOpenClass,
        hideClass,
        menuIconActive,
        on,
        options: {
            header,
            menuIcon,
            menuBody,
            menuItem,
            menuLink,
            menu,
            scrollWatch,
            headerScroll,
            dynamic,
            mediaQuery,
            scrollLock,
            shouldScrollOffsetHeader,
            shouldSmoothScroll,
            scrollMargin,
            mainElement,
            mainElementScrollMargin,
            menuItemActive,
            menuOpenClass,
            hideClass,
            menuIconActive,
            on,
        },
        destroy,
        headerMenuClose,
        headerMenuOpen,
    };
};
