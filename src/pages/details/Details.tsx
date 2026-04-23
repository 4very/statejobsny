import { For, mergeProps, Show, type Component } from 'solid-js'

import { refreshStaleDetails, vacancyLookup } from '../../store'
import { getUrlParams } from '../../util/searchParams'

const Details: Component<{ itemNum?: string }> = (rawProps) => {
  const urlParams = getUrlParams(document.location.search)
  const props = mergeProps(
    { itemNum: urlParams.get('id') ?? undefined },
    rawProps,
  )
  if (!props.itemNum) return <></>
  refreshStaleDetails(props.itemNum)
  const data = () => vacancyLookup[props.itemNum!]?.details
  return (
    <Show when={data()}>
      <div>
        <div>
          <h2>Job Specifics</h2>
          <h3>Duties Description</h3>
          <h6>{data()!.jobspecifics.dutiesDescription.helpText}</h6>
          <span innerHTML={data()!.jobspecifics.dutiesDescription.raw}></span>
          <h3>Minimum Qualifications</h3>
          <span
            innerHTML={data()!.jobspecifics.minimumQualifications.raw}
          ></span>
          <h3>Additional Comments</h3>
          <span>{data()!.jobspecifics.additionalComments.raw}</span>
        </div>

        <nys-accordion>
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
        </nys-accordion>
      </div>
    </Show>
  )
}

export default Details
