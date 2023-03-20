import usePairDetail from '@/hooks/usePairDetail'
import { constants } from 'ethers'
import { useEffect, useState } from 'react'
import { useDialog } from '@/components/dialog'
import { Global } from '@/types/global'

const usePairDetailList = (pairList: string[]) => {
  const [pairDetailList, setPairDetailList] = useState<Global.TPairDetail[]>([])
  const { getPairDetail } = usePairDetail(constants.AddressZero)
  const { openDialog, close } = useDialog()
  useEffect(() => {
    openDialog({ title: 'Fetch Liquidity List', desc: 'Waiting...' })
    const promiseList = pairList.map((item) => {
      return getPairDetail(item)
    })
    Promise.all(promiseList).then((values) => {
      setPairDetailList(values as Global.TPairDetail[])
      close()
    })
  }, [pairList])
  return pairDetailList
}
export default usePairDetailList
