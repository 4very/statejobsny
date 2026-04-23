import { For, Show, type Component } from 'solid-js'

import styles from './App.module.css'
import type { jobInformation } from './data'

const Details: Component<{ data?: jobInformation }> = (props) => {
  if (!props.data) return <></>
  return (
    <div>
      <div>
        <h2>Job Specifics</h2>
        <h3>Duties Description</h3>
        <h6>{props.data.jobspecifics.dutiesDescription.helpText}</h6>
        <span>{props.data.jobspecifics.dutiesDescription.raw()}</span>
        <h3>Minimum Qualifications</h3>
        <span>{props.data.jobspecifics.minimumQualifications.raw()}</span>
        <h3>Additional Comments</h3>
        <span>{props.data.jobspecifics.additionalComments.raw()}</span>
      </div>

      <nys-accordion>
        <nys-accordionitem
          id="num2"
          heading="Full Data"
        >
          <div class="columnReport">
            <For each={Object.entries(props.data)}>
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
                        {entry.raw()}
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
  )
}

export default Details
