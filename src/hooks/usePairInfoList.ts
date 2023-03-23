import usePairInfo from '@/hooks/usePairInfo'
import { constants } from 'ethers'
import { useEffect, useState } from 'react'
import { useDialog } from '@/components/dialog'
import { Global } from '@/types/global'

const usePairInfoList = (pairList: string[]) => {
  const [pairInfoList, setPairInfoList] = useState<Global.TPairInfo[]>([])
  const { getPairDetail } = usePairInfo(constants.AddressZero)
  const { openDialog, close } = useDialog()
  useEffect(() => {
    openDialog({ title: 'Fetch Liquidity List', desc: 'Waiting...' })
    const promiseList = pairList.map((item) => {
      return getPairDetail(item)
    })
    Promise.all(promiseList).then((values) => {
      setPairInfoList(values as Global.TPairInfo[])
      close()
    })
  }, [pairList, getPairDetail])
  return pairInfoList
}
export default usePairInfoList
