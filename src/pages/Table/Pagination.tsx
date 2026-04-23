import { NysPaginationProps } from '@nysds/components/react'
import { Component, createSignal, Show } from 'solid-js'
import { TableData } from '../../parsing/VacancyTable'
import { useWaitForElt } from '../../util/useWaitForElt'

const Pagination: Component<{ data: TableData }> = (props) => {
  const [buttonContainer, setButtonContainer] =
    createSignal<HTMLDivElement | null>(null)

  useWaitForElt('div.dt-paging').then(setButtonContainer)

  const handlePageChange: NysPaginationProps['onNysChange'] = (e) => {
    const pageInfo = props.data.pages
    const toPage = e.detail.page

    let querySelector = ''
    if (toPage == 1) querySelector = '.first'
    else if (toPage == pageInfo.total) querySelector = '.last'
    else if (toPage - pageInfo.current == 1) querySelector = '.next'
    else if (toPage - pageInfo.current == -1) querySelector = '.previous'
    buttonContainer()
      ?.querySelector<HTMLButtonElement>(querySelector)
      ?.dispatchEvent(new Event('click'))
    // console.log(getPageInfo())
  }
  return (
    <div
      class="nys-display-flex nys-flex-align-center nys-flex-gap-50 nys-margin-50"
      style={{ 'justify-content': 'space-between' }}
    >
      <span>
        Showing {props.data.items.start} to {props.data.items.end} of{' '}
        {props.data.items.total} entries
      </span>
      <Show when={props.data.pages.current != 0}>
        <nys-pagination
          prop:currentPage={props.data.pages.current}
          prop:totalPages={props.data.pages.total}
          on:nys-change={handlePageChange}
        ></nys-pagination>{' '}
      </Show>
    </div>
  )
}

export default Pagination
