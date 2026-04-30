import { Component, createEffect, createResource, Index } from 'solid-js'
import { linkedButton, linkedInput, linkedSelect } from '@/directive/linked'
import { useWaitForElts } from '@/util/useWaitForElt'
import type { NysDatepicker } from '@nysds/components'
import { getSearchParamsLookup } from '@/stores/searchParamsLookup'

const Search: Component = (props) => {
  getSearchParamsLookup()
  const getFieldsetByLegend = async (legendText: string) => {
    const fieldsets = await useWaitForElts<HTMLFieldSetElement>(
      'fieldset',
    ).then((elts) => [...elts])
    return fieldsets.find(
      (elt) => elt.querySelector('legend')?.textContent == legendText,
    )
  }

  const [categories] = createResource(() =>
    getFieldsetByLegend('Include Occupational Categories').then((fieldSet) => [
      ...(fieldSet?.querySelectorAll<HTMLInputElement>(
        'input[type="checkbox"]',
      ) ?? []),
    ]),
  )

  const [regions] = createResource(() =>
    getFieldsetByLegend('Include Regions').then((fieldSet) => [
      ...(fieldSet?.querySelectorAll<HTMLInputElement>(
        'input[type="checkbox"]',
      ) ?? []),
    ]),
  )

  let dateMin!: NysDatepicker
  let dateMax!: NysDatepicker

  const setDates = (date: Date) => {
    dateMin.value = date
    dateMin.dispatchEvent(
      new CustomEvent('nys-input', { detail: { value: date } }),
    )
    dateMax.value = date
    dateMax.dispatchEvent(
      new CustomEvent('nys-input', { detail: { value: date } }),
    )
  }

  const setToday = () => setDates(new Date())
  const setYesterday = () => {
    const date = new Date()
    date.setDate(date.getDate() - 1)
    setDates(date)
  }

  return (
    <div
      id="app"
      class="nys-display-flex nys-flex-gap-100 nys-flex-column"
    >
      <div>
        <h3>Search for Vacancies</h3>
        <div class="nys-display-flex nys-flex-column nys-flex-gap-100">
          <nys-textinput
            width="lg"
            label="Keywords"
            use:linkedInput={'input#keywords'}
          ></nys-textinput>

          <nys-textinput
            label="With the title"
            width="lg"
            use:linkedInput={'input#title'}
          ></nys-textinput>
          <nys-select
            label="In the Jurisdictional Class"
            width="lg"
            use:linkedSelect={'select#JurisClassID'}
          ></nys-select>
          <nys-combobox
            label="In Which NYS Agency"
            width="lg"
            use:linkedSelect={'select#AgID'}
          ></nys-combobox>
          <nys-select
            label="NYHELPS"
            width="sm"
            use:linkedSelect={'select#isnyhelp'}
          ></nys-select>
        </div>
      </div>

      <div>
        <h3>Filter by Date Posted</h3>
        <div class="nys-display-flex nys-flex-column nys-flex-gap-100">
          <div class="nys-display-flex nys-flex-gap-100">
            <nys-datepicker
              ref={dateMin}
              label="Start Date"
              use:linkedInput={'input#minDate'}
            ></nys-datepicker>
            <nys-datepicker
              ref={dateMax}
              label="End Date"
              use:linkedInput={'input#maxDate'}
            ></nys-datepicker>
          </div>
          <div class="nys-display-flex nys-flex-gap-100">
            <nys-button
              on:nys-click={setToday}
              label="Today"
            ></nys-button>
            <nys-button
              on:nys-click={setYesterday}
              label="Yesterday"
            ></nys-button>
          </div>
        </div>
      </div>
      <div>
        <h3>Flexibility in the Workplace</h3>
        <div class="nys-display-flex nys-flex-column nys-flex-gap-100">
          <nys-checkbox
            label="Flextime Allowed"
            use:linkedInput={'input#flextime'}
          ></nys-checkbox>
          <nys-checkbox
            label=" Compressed Workweek Allowed"
            use:linkedInput={'input#compressed'}
          ></nys-checkbox>
          <nys-checkbox
            label="Telecommuting Allowed"
            use:linkedInput={'input#telecommuting'}
          ></nys-checkbox>
        </div>
      </div>
      <div>
        <h3>Occupational Categories</h3>
        <div class="nys-display-flex nys-flex-column nys-flex-gap-100">
          <Index each={categories()}>
            {(category) => (
              <nys-checkbox
                label={category().labels?.item(0).textContent}
                use:linkedInput={`input#${category().id}`}
              ></nys-checkbox>
            )}
          </Index>
        </div>
      </div>
      <div>
        <h3>Regions</h3>

        <div class="nys-display-flex nys-flex-column nys-flex-gap-100">
          <nys-button
            prop:variant="text"
            prop:label="View Region Map"
            prop:suffixIcon="open_in_new"
            href="/assets/help/regionMapText.cfm"
            target="_blank"
          ></nys-button>
          <Index each={regions()}>
            {(regions) => (
              <nys-checkbox
                label={regions().labels?.item(0).textContent}
                use:linkedInput={`input#${regions().id}`}
              ></nys-checkbox>
            )}
          </Index>
        </div>
      </div>
      <div>
        <h3>Compensation and Grade</h3>
        <div class="nys-display-flex nys-flex-column nys-flex-gap-100">
          <nys-select
            label="Employment Type"
            width="md"
            use:linkedSelect={'select#employmentType'}
          ></nys-select>

          <div class="nys-display-flex nys-flex-gap-100">
            <nys-select
              label="Salary Grade"
              width="md"
              use:linkedSelect={'select#gradeCompareType'}
            ></nys-select>
            <nys-combobox
              label="Grade"
              width="lg"
              use:linkedSelect={'select#salGrade'}
            ></nys-combobox>
          </div>

          <nys-textinput
            label="Minimum Salary"
            width="lg"
            type="number"
            use:linkedInput={'input#SalMin'}
          ></nys-textinput>
        </div>
      </div>

      <div>
        <nys-button
          label="Submit"
          prop:type="submit"
          use:linkedButton={['input.search-submit']}
        ></nys-button>
      </div>
    </div>
  )
}

export default Search
