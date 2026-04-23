import { Component, createSignal, For, Show } from 'solid-js'
import Tag from '../../components/Tag'
import { refreshStaleDetails, vacancyLookup } from '../../store'
import Details from '../details/Details'

const Row: Component<{ itemNum: string; 'hide-row': () => void }> = (props) => {
  refreshStaleDetails(props.itemNum)

  const vacancyData = () => vacancyLookup[props.itemNum]
  const [expanded, setExpanded] = createSignal(false)
  return (
    <>
      <tr>
        <td>
          <nys-button
            href={vacancyData().table.link}
            icon="open_in_new"
            circle
            size="sm"
            variant="ghost"
          ></nys-button>
          <nys-button
            id={`hide-button-${vacancyData().table.itemNum}`}
            on:nys-click={props['hide-row']}
            icon="visibility_off"
            circle
            size="sm"
            variant="ghost"
          ></nys-button>
          <nys-tooltip
            for={`hide-button-${vacancyData().table.itemNum}`}
            text="Hide Row from all search results"
            position="left"
          ></nys-tooltip>

          <nys-button
            id={vacancyData().table.itemNum}
            icon={expanded() ? 'chevron_up' : 'chevron_down'}
            circle
            size="sm"
            variant="ghost"
            on:nys-click={() => setExpanded(!expanded())}
          ></nys-button>
        </td>
        <td>{vacancyData().table.itemNum}</td>
        <td>
          {vacancyData().table.title}

          <Show when={vacancyData().keywords}>
            <div class="nys-display-flex nys-flex-gap-50 nys-flex-wrap nys-margin-100">
              <For each={vacancyData().keywords}>
                {(keyword, index) => (
                  <Tag
                    label={keyword.keyword}
                    index={index()}
                    itemNum={vacancyData().table.itemNum}
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
        <td>{vacancyData().table.grade}</td>
        <td>{vacancyData().table.posted}</td>
        <td>{vacancyData().table.deadline}</td>
        <td>{vacancyData().table.agency}</td>
        <td>{vacancyData().table.county}</td>
      </tr>
      <Show when={expanded() && vacancyData().details}>
        <tr class="expanded">
          <td colspan="8">
            <Details itemNum={props.itemNum}></Details>
          </td>
        </tr>
      </Show>
    </>
  )
}

export default Row
