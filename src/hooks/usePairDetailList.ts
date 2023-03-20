import usePairDetail, { TPairDetail } from '@/hooks/usePairDetail'
import { constants } from 'ethers'
import { useEffect, useState } from 'react'
import { useDialog } from '@/components/dialog'

const usePairDetailList = (pairList: string[]) => {
  const [pairDetailList, setPairDetailList] = useState<TPairDetail[]>([])
  const { getPairDetail } = usePairDetail(constants.AddressZero)
  const { openDialog, close } = useDialog()
  useEffect(() => {
    openDialog({ title: 'Fetch Liquidity List', desc: 'Wating...' })
    const promiseList = pairList.map((item) => {
      return getPairDetail(item)
    })
    Promise.all(promiseList).then((values) => {
      setPairDetailList(values as TPairDetail[])
      close()
    })
  }, [pairList])
  return pairDetailList
}
export default usePairDetailList
