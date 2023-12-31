var Autocomplete = (function () {
  "use strict";
  function t(t, e, s) {
    return (
      e in t
        ? Object.defineProperty(t, e, {
            value: s,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (t[e] = s),
      t
    );
  }
  return class {
    constructor(
      e,
      {
        delay: s = 500,
        clearButton: i = !0,
        howManyCharacters: h = 1,
        selectFirst: o = !1,
        insertToInput: r = !1,
        showAllValues: l = !1,
        cache: a = !1,
        disableCloseOnSelect: n = !1,
        classGroup: c,
        classPreventClosing: d,
        onSearch: u,
        onResults: m = () => {},
        onSubmit: p = () => {},
        onOpened: L = () => {},
        onReset: v = () => {},
        onRender: A = () => {},
        onClose: f = () => {},
        noResults: g = () => {},
        onSelectedItem: x = () => {},
      }
    ) {
      var b;
      t(this, "init", () => {
        const t = this.root;
        this.clearbutton(),
          this.output(),
          t.addEventListener("input", this.handleInput),
          this.showAll && t.addEventListener("click", this.handleInput),
          this.onRender({ element: t, results: this.resultList });
      }),
        t(this, "cacheAct", (t, e) => {
          const s = this.root;
          this.cache &&
            ("update" === t
              ? s.setAttribute(this.cacheData, e.value)
              : "remove" === t
              ? s.removeAttribute(this.cacheData)
              : (s.value = s.getAttribute(this.cacheData)));
        }),
        t(this, "handleInput", ({ target: t, type: e }) => {
          if (
            "true" === this.root.getAttribute("aria-expanded") &&
            "click" === e
          )
            return;
          const s = t.value.replace(this.regex, "\\$&");
          if ((this.cacheAct("update", t), this.showAll && "click" === e))
            return this.reset(), void this.searchItem(s.trim());
          clearTimeout(this.timeout),
            (this.timeout = setTimeout(() => {
              this.searchItem(s.trim());
            }, this.delay));
        }),
        t(this, "output", () => {
          this.setAttr(this.resultList, {
            id: this.outputUl,
            tabIndex: "0",
            role: "listbox",
          }),
            this.setAttr(this.resultWrap, {
              id: this.outputUl + "-wrapper",
              addClass: "auto-output-search",
            }),
            this.resultWrap.insertAdjacentElement("beforeend", this.resultList),
            this.root.parentNode.insertBefore(
              this.resultWrap,
              this.root.nextSibling
            );
        }),
        t(this, "reset", () => {
          var t;
          this.setAttr(this.root, {
            "aria-owns": this.search + "-list",
            "aria-expanded": "false",
            "aria-autocomplete": "list",
            "aria-activedescendant": "",
            role: "combobox",
            removeClass: "auto-expanded",
          }),
            this.resultWrap.classList.remove(this.isActive),
            this.scrollResultsToTop(),
            ((0 ==
              (null === (t = this.matches) || void 0 === t
                ? void 0
                : t.length) &&
              !this.toInput) ||
              this.showAll) &&
              (this.resultList.innerHTML = ""),
            (this.index = this.selectFirst ? 0 : -1),
            this.onClose();
        }),
        t(this, "scrollResultsToTop", () => {
          this.resultList.scrollTop =
            this.resultList.offsetTop - this.resultWrap.offsetHeight;
        }),
        t(this, "searchItem", (t) => {
          (this.value = t),
            this.onLoading(!0),
            this.showBtn(),
            0 == t.length &&
              this.clearButton &&
              this.cBtn.classList.add("hidden"),
            this.characters > t.length && !this.showAll
              ? this.onLoading()
              : this.onSearch({ currentValue: t, element: this.root })
                  .then((e) => {
                    const s = this.root.value.length,
                      i = e.length;
                    (this.matches = Array.isArray(e)
                      ? [...e]
                      : JSON.parse(JSON.stringify(e))),
                      this.onLoading(),
                      this.error(),
                      0 == i && 0 == s && this.cBtn.classList.add("hidden"),
                      0 == i && s
                        ? (this.root.classList.remove("auto-expanded"),
                          this.reset(),
                          this.noResults({
                            element: this.root,
                            currentValue: t,
                            template: this.results,
                          }),
                          this.events())
                        : (i > 0 ||
                            ((t) =>
                              t &&
                              "object" == typeof t &&
                              t.constructor === Object)(e)) &&
                          ((this.index = this.selectFirst ? 0 : -1),
                          this.results(),
                          this.events());
                  })
                  .catch(() => {
                    this.onLoading(), this.reset();
                  });
        }),
        t(this, "onLoading", (t) =>
          this.root.parentNode.classList[t ? "add" : "remove"](this.isLoading)
        ),
        t(this, "error", () => this.root.classList.remove(this.err)),
        t(this, "events", () => {
          this.root.addEventListener("keydown", this.handleKeys),
            this.root.addEventListener("click", this.handleShowItems),
            ["mousemove", "click"].map((t) => {
              this.resultList.addEventListener(t, this.handleMouse);
            }),
            document.addEventListener("click", this.handleDocClick);
        }),
        t(this, "results", (t) => {
          this.setAttr(this.root, {
            "aria-expanded": "true",
            addClass: "auto-expanded",
          }),
            (this.resultList.innerHTML =
              0 === this.matches.length
                ? this.onResults({
                    currentValue: this.value,
                    matches: 0,
                    template: t,
                  })
                : this.onResults({
                    currentValue: this.value,
                    matches: this.matches,
                    classGroup: this.classGroup,
                  })),
            this.resultWrap.classList.add(this.isActive),
            this.scrollResultsToTop();
          const e = this.classGroup ? `:not(.${this.classGroup})` : "";
          (this.itemsLi = document.querySelectorAll(
            `#${this.outputUl} > li${e}`
          )),
            this.selectFirstEl(),
            this.onOpened({
              type: "results",
              element: this.root,
              results: this.resultList,
            }),
            this.addAria();
        }),
        t(this, "handleDocClick", ({ target: t }) => {
          let e = null;
          ((t.closest("ul") && this.disableCloseOnSelect) ||
            t.closest("." + this.classPreventClosing)) &&
            (e = !0),
            t.id === this.search || e || this.reset();
        }),
        t(this, "addAria", () => {
          for (let t = 0; t < this.itemsLi.length; t++)
            this.setAttr(this.itemsLi[t], {
              role: "option",
              tabindex: "-1",
              "aria-selected": "false",
              "aria-setsize": this.itemsLi.length,
              "aria-posinset": t,
            });
        }),
        t(this, "selectFirstEl", () => {
          if (
            (this.remAria(document.querySelector("." + this.activeList)),
            !this.selectFirst)
          )
            return;
          const { firstElementChild: t } = this.resultList,
            e =
              this.classGroup && this.matches.length > 0 && this.selectFirst
                ? t.nextElementSibling
                : t;
          this.setAttr(e, {
            id: this.selectedOption + "-0",
            addClass: this.activeList,
            "aria-selected": "true",
          }),
            this.setAriaDes(this.selectedOption + "-0"),
            this.follow(t);
        }),
        t(this, "showBtn", () => {
          this.cBtn &&
            (this.cBtn.classList.remove("hidden"),
            this.cBtn.addEventListener("click", this.destroy));
        }),
        t(this, "setAttr", (t, e) => {
          for (let s in e)
            "addClass" === s
              ? t.classList.add(e[s])
              : "removeClass" === s
              ? t.classList.remove(e[s])
              : t.setAttribute(s, e[s]);
        }),
        t(this, "handleShowItems", () => {
          const t = this.resultWrap;
          this.resultList.textContent.length > 0 &&
            !t.classList.contains(this.isActive) &&
            (this.setAttr(this.root, {
              "aria-expanded": "true",
              addClass: "auto-expanded",
            }),
            t.classList.add(this.isActive),
            this.scrollResultsToTop(),
            this.selectFirstEl(),
            this.onOpened({
              type: "showItems",
              element: this.root,
              results: this.resultList,
            }));
        }),
        t(this, "handleMouse", (t) => {
          t.preventDefault();
          const { target: e, type: s } = t,
            i = e.closest("li"),
            h = null == i ? void 0 : i.hasAttribute("role"),
            o = this.activeList,
            r = document.querySelector("." + o);
          i &&
            h &&
            ("click" === s && this.getTextFromLi(i),
            "mousemove" !== s ||
              i.classList.contains(o) ||
              (this.remAria(r),
              this.setAria(i),
              (this.index = this.indexLiSelected(i)),
              this.onSelectedItem({
                index: this.index,
                element: this.root,
                object: this.matches[this.index],
              })));
        }),
        t(this, "getTextFromLi", (t) => {
          t && 0 !== this.matches.length
            ? (this.addToInput(t),
              this.onSubmit({
                index: this.index,
                element: this.root,
                object: this.matches[this.index],
                results: this.resultList,
              }),
              this.disableCloseOnSelect || (this.remAria(t), this.reset()),
              this.clearButton && this.cBtn.classList.remove("hidden"),
              this.cacheAct("remove"))
            : !this.disableCloseOnSelect && this.reset();
        }),
        t(this, "firstElement", (t) => t.firstElementChild || t),
        t(this, "addToInput", (t) => {
          this.root.value = this.firstElement(t).textContent.trim();
        }),
        t(this, "indexLiSelected", (t) =>
          Array.prototype.indexOf.call(this.itemsLi, t)
        ),
        t(this, "handleKeys", (t) => {
          const e = this.keyCodes,
            { keyCode: s } = t,
            i = this.resultWrap.classList.contains(this.isActive),
            h = this.matches.length + 1;
          switch (
            ((this.selectedLi = document.querySelector("." + this.activeList)),
            s)
          ) {
            case e.UP:
            case e.DOWN:
              if ((t.preventDefault(), (h <= 1 && this.selectFirst) || !i))
                return;
              s === e.UP
                ? (this.index < 0 && (this.index = h - 1), (this.index -= 1))
                : ((this.index += 1), this.index >= h && (this.index = 0)),
                this.remAria(this.selectedLi),
                h > 0 && this.index >= 0 && this.index < h - 1
                  ? (this.onSelectedItem({
                      index: this.index,
                      element: this.root,
                      object: this.matches[this.index],
                    }),
                    this.setAria(this.itemsLi[this.index]),
                    this.toInput &&
                      i &&
                      this.addToInput(this.itemsLi[this.index]))
                  : (this.cacheAct(), this.setAriaDes());
              break;
            case e.ENTER:
              this.getTextFromLi(this.selectedLi);
              break;
            case e.TAB:
            case e.ESC:
              this.reset();
          }
        }),
        t(this, "setAria", (t) => {
          const e = `${this.selectedOption}-${this.indexLiSelected(t)}`;
          this.setAttr(t, {
            id: e,
            "aria-selected": "true",
            addClass: this.activeList,
          }),
            this.setAriaDes(e),
            this.follow(t);
        }),
        t(this, "getClassGroupHeight", () => {
          const t = document.querySelectorAll(
            `#${this.outputUl} > li:not(.${this.classGroup})`
          );
          let e = 0;
          return [].slice.call(t).map((t) => (e += t.offsetHeight)), e;
        }),
        t(this, "follow", (t) => {
          const e = this.resultList,
            s = e.previousSibling,
            i = s ? s.offsetHeight : 0;
          if (
            ("0" == t.getAttribute("aria-posinset") &&
              (e.scrollTop = t.offsetTop - this.getClassGroupHeight()),
            t.offsetTop - i < e.scrollTop)
          )
            e.scrollTop = t.offsetTop - i;
          else {
            const s = t.offsetTop + t.offsetHeight - i;
            s > e.scrollTop + e.offsetHeight &&
              (e.scrollTop = s - e.offsetHeight);
          }
        }),
        t(this, "remAria", (t) => {
          t &&
            this.setAttr(t, {
              id: "",
              removeClass: this.activeList,
              "aria-selected": "false",
            });
        }),
        t(this, "setAriaDes", (t) =>
          this.root.setAttribute("aria-activedescendant", t || "")
        ),
        t(this, "clearbutton", () => {
          this.clearButton &&
            (this.setAttr(this.cBtn, {
              id: "auto-clear-" + this.search,
              class: "auto-clear hidden",
              type: "button",
              "aria-label": "claar text from input",
            }),
            this.root.insertAdjacentElement("afterend", this.cBtn));
        }),
        t(this, "destroy", () => {
          this.clearButton && this.cBtn.classList.add("hidden"),
            (this.root.value = ""),
            this.root.focus(),
            (this.resultList.textContent = ""),
            this.reset(),
            this.error(),
            this.onReset(this.root),
            this.root.removeEventListener("keydown", this.handleKeys),
            this.root.removeEventListener("click", this.handleShowItems),
            document.removeEventListener("click", this.handleDocClick);
        }),
        (this.search = e),
        (this.root = document.getElementById(this.search)),
        (this.onSearch =
          ((b = u),
          Boolean(b && "function" == typeof b.then)
            ? u
            : ({ currentValue: t, element: e }) =>
                Promise.resolve(u({ currentValue: t, element: e })))),
        (this.onResults = m),
        (this.onRender = A),
        (this.onSubmit = p),
        (this.onSelectedItem = x),
        (this.onOpened = L),
        (this.onReset = v),
        (this.noResults = g),
        (this.onClose = f),
        (this.delay = s),
        (this.characters = h),
        (this.clearButton = i),
        (this.selectFirst = o),
        (this.toInput = r),
        (this.showAll = l),
        (this.classGroup = c),
        (this.classPreventClosing = d),
        (this.disableCloseOnSelect = n),
        (this.cache = a),
        (this.outputUl = "auto-" + this.search),
        (this.cacheData = "data-cache-auto-" + this.search),
        (this.isLoading = "auto-is-loading"),
        (this.isActive = "auto-is-active"),
        (this.activeList = "auto-selected"),
        (this.selectedOption = "auto-selected-option"),
        (this.err = "auto-error"),
        (this.regex = /[|\\{}()[\]^$+*?.]/g),
        (this.timeout = null),
        (this.resultWrap = document.createElement("div")),
        (this.resultList = document.createElement("ul")),
        (this.cBtn = document.createElement("button")),
        (this.keyCodes = { ESC: 27, ENTER: 13, UP: 38, DOWN: 40, TAB: 9 }),
        this.init();
    }
  };
})();
