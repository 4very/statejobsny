import {
  Component,
  createMemo,
  createResource,
  createSignal,
  For,
  Show,
} from 'solid-js'
import Tag from '../../components/Tag'
import { getKeywordsFromDetails } from '../../util/keywords'
import { getDataFromLink } from '../details/data'
import { RowData } from './data'
import Details from '../details/Details'

const Row: Component<{ data: RowData; 'hide-row': () => void }> = (props) => {
  const [listingData] = createResource(props.data.link, getDataFromLink)
  const keywords = createMemo(() => getKeywordsFromDetails(listingData()))
  const [expanded, setExpanded] = createSignal(false)

  return (
    <>
      <tr>
        <td>
          <nys-button
            href={props.data.link}
            icon="open_in_new"
            circle
            size="sm"
            variant="ghost"
          ></nys-button>
          <nys-button
            id={`hide-button-${props.data.itemNum}`}
            on:nys-click={props['hide-row']}
            icon="visibility_off"
            circle
            size="sm"
            variant="ghost"
          ></nys-button>
          <nys-tooltip
            for={`hide-button-${props.data.itemNum}`}
            text="Hide Row from all search results"
            position="left"
          ></nys-tooltip>

          <nys-button
            id={props.data.itemNum}
            icon={expanded() ? 'chevron_up' : 'chevron_down'}
            circle
            size="sm"
            variant="ghost"
            on:nys-click={() => setExpanded(!expanded())}
          ></nys-button>
        </td>
        <td>{props.data.itemNum}</td>
        <td>
          {props.data.title}

          <Show when={keywords()?.length}>
            <div class="nys-display-flex nys-flex-gap-50 nys-flex-wrap nys-margin-100">
              <For each={keywords()}>
                {(keyword, index) => (
                  <Tag
                    label={keyword.keyword}
                    index={index()}
                    itemNum={props.data.itemNum}
                    skill={keyword.title}
                  ></Tag>
                )}
              </For>
            </div>
          </Show>
        </td>
        {/* <td>
          <div class="nys-display-flex nys-flex-gap-50 nys-flex-wrap">
            <For each={keywords()}>
              {(keyword, index) => (
                <Tag
                  label={keyword.keyword}
                  index={index()}
                  itemNum={props.data.itemNum}
                  skill={keyword.title}
                ></Tag>
              )}
            </For>
          </div>
        </td> */}
        <td>{props.data.grade}</td>
        <td>{props.data.posted}</td>
        <td>{props.data.deadline}</td>
        <td>{props.data.agency}</td>
        <td>{props.data.county}</td>
      </tr>
      <Show when={expanded() && listingData()}>
        <tr class="expanded">
          <td colspan="8">
            <Details data={listingData()}></Details>
          </td>
        </tr>
      </Show>
    </>
  )
}

export default Row
