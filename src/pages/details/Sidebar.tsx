import { Component, Index } from 'solid-js'
import { sections } from '../../parsing/VacancyDetails'

const Sidebar: Component = () => {

  let navItems: Record<string, HTMLLIElement> = {}
  function setActive() {
    let activeKey = 'information'
    for (const key in navItems) {
      const element = navItems[key]
      element.classList.remove('onpage-nav__item--active')
      const sectionElt = document.getElementById(`new-${key}`)
      if (window.scrollY + 50 >= (sectionElt?.offsetTop ?? Infinity)) {
        activeKey = key
      }
    }

    navItems[activeKey]?.classList.add('onpage-nav__item--active')
  }
  document.addEventListener('scroll', setActive, { passive: true })

  return (
    <div class="nys-grid-col-2">
      <nav
        class="onpage-nav"
        aria-label="Section Navigation"
        data-pagefind-ignore="all"
        style={{}}
      >
        <ul class="onpage-nav__list">
          <Index each={sections}>
            {(section, i) => (
              <li
                class="onpage-nav__item"
                classList={{
                  'onpage-nav__item--active': i == 0,
                }}
                ref={(el) => (navItems[section()[0]] = el)}
              >
                <a
                  class="onpage-nav__link"
                  href={`#new-${section()[0]}`}
                >
                  {section()[1]}
                </a>
              </li>
            )}
          </Index>
        </ul>
      </nav>
    </div>
  )
}

export default Sidebar
