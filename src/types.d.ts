import type { ComponentProps } from 'solid-js'

import type * as NYSDS from '@nysds/components'

type NYSDSProps<T> = Partial<T> & {}

declare module 'solid-js' {
  namespace JSX {
    type Props<T, E = 'div'> = {
      [K in keyof T as `prop:${string & K}` | (string & K)]?: T[K]
    } & JSX.ComponentProps<E>
    interface IntrinsicElements {
      'nys-button': Props<NYSDS.NysButton>
      'nys-table': Props<NYSDS.NysTable>
      'nys-select': Props<NYSDS.NysSelect> & any
      'nys-icon': Props<NYSDS.NysIcon>
      'nys-textinput': Props<NYSDS.NysTextinput, 'input'>
      'nys-badge': Props<NYSDS.NysBadge>
      'nys-tooltip': Props<NYSDS.NysTooltip>
      'nys-pagination': Props<NYSDS.NysPagination>
      'nys-divider': Props<NYSDS.NysDivider>
      'nys-accordion': Props<NYSDS.NysAccordion> & any
      'nys-accordionitem': Props<NYSDS.NysAccordionItem> & any
    }
  }
}
