import {
  createEffect,
  For,
  Index,
  JSX,
  mergeProps,
  Show,
  type Component,
} from 'solid-js'

import { refreshStaleDetails, vacancyLookup } from '@/store'
import { getUrlParams } from '@/util/searchParams'
import DetailsItem from './DetailsItem'
import DetailsItemInline from './DetailsItemInline'
import DetailsTable from './DetailsTable'
import Tag from '@/components/Tag'

const Details: Component<
  { itemNum?: string } & JSX.DOMAttributes<HTMLDivElement>
> = (rawProps) => {
  const urlParams = getUrlParams(document.location.search)
  const props = mergeProps(
    { itemNum: urlParams.get('id') ?? undefined },
    rawProps,
  )
  if (!props.itemNum) return <></>
  const data = () => vacancyLookup[props.itemNum!]?.details

  createEffect(() => console.log(data()))
  return (
    <Show when={data()}>
      <div
        {...rawProps}
        id="details"
      >
        <h1>{data()?.information.title.content}</h1>
        <Show when={vacancyLookup[props.itemNum!].keywords}>
          <div
            class="nys-display-flex nys-flex-gap-50 nys-flex-wrap"
            style={{ 'padding-bottom': 'var(--nys-space-200)' }}
          >
            <For each={vacancyLookup[props.itemNum!].keywords}>
              {(keyword, index) => (
                <Tag
                  label={keyword.keyword}
                  index={index()}
                  itemNum={props.itemNum!}
                  skill={keyword.title}
                ></Tag>
              )}
            </For>
          </div>
        </Show>
        <div id="">
          <DetailsItemInline
            item={data()?.reviewInformation.datePosted!}
          ></DetailsItemInline>
          <DetailsItemInline
            item={data()?.reviewInformation.applicationsDue!}
          ></DetailsItemInline>
          <DetailsItemInline
            item={data()?.reviewInformation.vacancyID!}
          ></DetailsItemInline>
        </div>
        <div id="new-information">
          <h2>Information</h2>
          <DetailsTable
            data={Object.values(data()?.information!)}
          ></DetailsTable>
        </div>
        <div id="new-schedule">
          <h2>Schedule</h2>
          <DetailsTable data={Object.values(data()?.schedule!)}></DetailsTable>
        </div>
        <div id="new-location">
          <h2>Location</h2>
          <DetailsTable data={Object.values(data()?.location!)}></DetailsTable>
        </div>
        <div id="new-jobspecifics">
          <h2>Job Specifics</h2>
          <DetailsItem
            item={data()!.jobspecifics.dutiesDescription}
            highlight={true}
            itemNum={props.itemNum}
          ></DetailsItem>
          <DetailsItem
            item={data()!.jobspecifics.minimumQualifications}
            highlight={true}
            itemNum={props.itemNum}
          ></DetailsItem>
          <DetailsItem
            item={data()!.jobspecifics.additionalComments}
          ></DetailsItem>
        </div>

        <div id="new-contact">
          <h2>How to Apply</h2>
          <DetailsTable data={Object.values(data()?.contact!)}></DetailsTable>
        </div>

        {/* <nys-accordion>
          <nys-accordionitem
            id="num2"
            heading="Full Data"
          >
            <div class="columnReport">
              <For each={Object.entries(data()!)}>
                {([key, values], i1) => (
                  <>
                    <h2>{key}</h2>
                    <For each={Object.values(values)}>
                      {(entry, i2) => (
                        <p class="row">
                          <span class="leftCol">
                            {entry.title}
                            <Show when={entry.helpText}>
                              <nys-icon
                                size="3xl"
                                name="help"
                                style={{ 'padding-left': '5px' }}
                                id={`${entry.title}-help-${i1()}-${i2()}`}
                              ></nys-icon>
                              <nys-tooltip
                                for={`${entry.title}-help-${i1()}-${i2()}`}
                                text={entry.helpText}
                              ></nys-tooltip>
                            </Show>
                          </span>
                          {entry.raw}
                        </p>
                      )}
                    </For>
                  </>
                )}
              </For>
            </div>
          </nys-accordionitem>
        </nys-accordion> */}
      </div>
    </Show>
  )
}

export default Details
