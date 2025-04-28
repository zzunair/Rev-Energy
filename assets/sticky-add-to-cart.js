class StickyAddToCart extends HTMLElement {
    constructor() {
        super();
        this._product_container = document.querySelector('[product-container]');
        this._scrollToSectionButton = this.querySelector("[scroll-to-section]")
        this._drawerScrollToSection = document.querySelector("drawer-component [scroll-to-section]")
        this.drawerType = this.querySelector("[drawer-to-open]") ? this.querySelector("[drawer-to-open]").getAttribute("drawer-to-open") : "sticky-add-to-cart-drawer"
        document.addEventListener('scroll', this._scrollHandler.bind(this));
        this._scrollToSectionButton && this._scrollToSectionButton.addEventListener("click", this._scrollToSection.bind(this))
        this._drawerScrollToSection && this._drawerScrollToSection.addEventListener("click", this._scrollToSection.bind(this))

        document.addEventListener(_EVENT_HELPER.triggerVariantAddToCartError, (e) => {
            this.componentState = this.getAttribute("aria-hidden")
            if (this.componentState === "false") {
                this._scrollToSection(e)
            }
        })

    }
    connectedCallback() {
        this._product_containerOffsetTop = this._product_container.offsetTop;
        this._product_containerHeight = this._product_container.offsetHeight;
        this._totalScrollHeight = this._product_containerOffsetTop + this._product_containerHeight;
    }

    _scrollHandler() {
        if (window.scrollY > this._totalScrollHeight) {
            this.classList.add("active")
        } else {
            this.classList.remove("active")
        }
    }

    _scrollToSection(e) {
        e.preventDefault()
        this.scrollTosectionElement = this._scrollToSectionButton.getAttribute("scroll-to-section") || this._drawerScrollToSection.getAttribute("scroll-to-section")
        this.scrollTosectionElementOffset = document.querySelector(`[${this.scrollTosectionElement}]`).offsetTop
        HELPER_UTIL.dispatchCustomEvent(_EVENT_HELPER.hideDrawer, this, {
            drawerType: this.drawerType,
        });
        window.scrollTo({
            top: this.scrollTosectionElementOffset,
            behavior: 'smooth'
        })
    }

    disconnectedCallback() {
        document.removeEventListener('scroll', this._scrollHandler.bind(this));
        this._scrollToSectionButton && this._scrollToSectionButton.removeEventListener("click", this._scrollToSection.bind(this))
        this._drawerScrollToSection && this._drawerScrollToSection.removeEventListener("click", this._scrollToSection.bind(this))
    }


}
window.customElements.define('sticky-add-to-cart', StickyAddToCart);


class StickyAddToCartContent extends HTMLElement {
    constructor() {
        super();
        document.addEventListener(_EVENT_HELPER.updateStickyAddToCartContent, this._updateStickyAddToCartContent.bind(this));
        this.variantList = this.querySelector("[sticky-add-to-cart-variants]");
        this.addToCartButton = this.querySelector("[add-to-cart-button]");
        this.sticky_bar_button = this.querySelector("[sticky-bar-button]");
        this.layout_type = this.getAttribute("layout-type")
        document.addEventListener(_EVENT_HELPER.updateStickyAddToCartContentUnAvailable, this._updateStickyAddToCartContentUnAvailable.bind(this));
    }

    _updateStickyAddToCartContent(e) {

        let content_list = e.detail.sticky_content
        content_list.forEach(element => {
            if (element.getAttribute("layout-type") === this.layout_type) {
                this.querySelector("[sticky-add-to-cart-variants]").innerHTML = element.querySelector("[sticky-add-to-cart-variants]").innerHTML
                this.querySelector("[add-to-cart-button]").innerHTML = element.querySelector("[add-to-cart-button]").innerHTML
                this.togleAddToCartButton(true)
            }
        });

    }

    _updateStickyAddToCartContentUnAvailable(e) {
        this.variantList.textContent = e.detail.variantOptions.join(", ")
        this.togleAddToCartButton(false)
    }

    togleAddToCartButton(buttonEnabled) {
        if (this.addToCartButton) {
            if (buttonEnabled) {
                this.addToCartButton.removeAttribute("disabled")
            }
            else {
                if (!this.addToCartButton.classList.contains("sticky-icon-button")) {
                    this.addToCartButton.textContent = window.variantStrings.unavailable
                }
                this.addToCartButton.removeAttribute("form")
                this.addToCartButton.setAttribute("disabled", true);
            }
        }
    }


    disconnectedCallback() {
        document.removeEventListener(_EVENT_HELPER.updateStickyAddToCartContent, this._updateStickyAddToCartContent.bind(this));
    }
}

window.customElements.define('sticky-add-to-cart-content', StickyAddToCartContent);