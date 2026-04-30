import { Component } from 'solid-js'
import { vacancyLookup } from '@/store'
import DetailsItem from '../details/DetailsItem'

const DetailsSummary: Component<{ itemNum: string }> = (props) => {
  const data = () => vacancyLookup[props.itemNum]
  return (
    <div>
      <DetailsItem
        item={data().details?.jobspecifics.dutiesDescription!}
      ></DetailsItem>
    </div>
  )
}

export default DetailsSummary
