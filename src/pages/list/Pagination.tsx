import { Component, createSignal, onMount, Suspense } from 'solid-js'
import { TableData } from './data'
import { NysPagination } from '@nysds/components'
import { NysPaginationProps } from '@nysds/components/react'

const Pagination: Component<{ data: TableData }> = (props) => {
  let buttonMutationObserver = null

  const watchButtonsContainer = () => {
    if (watchButtonsContainer !== null) return
    const buttonsContainer = document.querySelector('div.dt-paging')
    if (!buttonsContainer) return console.warn('button container not found')
    buttonMutationObserver = new MutationObserver(() =>
      setPageInfo(getPageInfo()),
    )
    buttonMutationObserver.observe(buttonsContainer!, {
      subtree: true,
      childList: true,
    })
  }

  onMount(() => watchButtonsContainer())

  const getPageInfo = () => {
    watchButtonsContainer()
    const buttons = document.querySelector('div.dt-paging')
    const currentButton = buttons?.querySelector('.current')
    const lastButton = buttons?.querySelector('.dt-paging-button:has(+ .next)')

    if (currentButton && lastButton)
      return {
        current: Number(currentButton!.textContent),
        last: Number(lastButton!.textContent),
      }
    else
      return {
        current: (props.data.start - 1) / props.data.pageSize + 1,
        last: Math.floor(props.data.total / props.data.pageSize) + 1,
      }
  }

  const [pageInfo, setPageInfo] = createSignal(getPageInfo())

  const handlePageChange: NysPaginationProps['onNysChange'] = (e) => {
    const currentPage = pageInfo()
    const toPage = e.detail.page
    const buttons = document.querySelector('div.dt-paging')

    let querySelector = ''
    console.log(pageInfo())
    if (toPage == 1) querySelector = '.first'
    else if (toPage == currentPage.last) querySelector = '.last'
    else if (toPage - currentPage.current == 1) querySelector = '.next'
    else if (toPage - currentPage.current == -1) querySelector = '.previous'
    buttons
      ?.querySelector<HTMLButtonElement>(querySelector)
      ?.dispatchEvent(new Event('click'))
    console.log(getPageInfo())
    setPageInfo(getPageInfo())
  }
  return (
    <nys-pagination
      prop:currentPage={pageInfo().current}
      prop:totalPages={pageInfo().last}
      on:nys-change={handlePageChange}
    ></nys-pagination>
  )
}

export default Pagination
